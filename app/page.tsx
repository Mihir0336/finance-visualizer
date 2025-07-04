"use client"

import { useState, useEffect, useCallback } from "react"
import { Dashboard } from "@/components/dashboard"
import { TransactionList } from "@/components/transaction-list"
import { BudgetManager } from "@/components/budget-manager"
import { Insights } from "@/components/insights"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MonthlyData, CategorySummary } from "@/lib/types"

export default function Home() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<string>("dashboard")

  // Load active tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem('finance-active-tab')
    if (savedTab && ['dashboard', 'transactions', 'budgets', 'insights'].includes(savedTab)) {
      setActiveTab(savedTab)
    }
  }, [])

  // Save active tab to localStorage when it changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    localStorage.setItem('finance-active-tab', value)
  }

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch("/api/analytics")
      if (response.ok) {
        const data = await response.json()
        setMonthlyData(data.monthlyData)
        setCategoryData(data.categoryData)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchAnalytics])

  // Listen for storage events (when data changes in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'finance-data-updated') {
        fetchAnalytics()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [fetchAnalytics])

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Finance Tracker</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <ThemeToggle />
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
          <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2 sm:py-1">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs sm:text-sm py-2 sm:py-1">Transactions</TabsTrigger>
          <TabsTrigger value="budgets" className="text-xs sm:text-sm py-2 sm:py-1">Budgets</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm py-2 sm:py-1">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Dashboard onDataUpdate={fetchAnalytics} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionList onDataUpdate={fetchAnalytics} />
        </TabsContent>

        <TabsContent value="budgets">
          <BudgetManager categoryData={categoryData} onDataUpdate={fetchAnalytics} />
        </TabsContent>

        <TabsContent value="insights">
          <Insights monthlyData={monthlyData} categoryData={categoryData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
