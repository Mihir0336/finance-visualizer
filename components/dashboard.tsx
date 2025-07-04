"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyChart } from "./charts/monthly-chart"
import { CategoryChart } from "./charts/category-chart"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import type { MonthlyData, CategorySummary, Transaction } from "@/lib/types"

interface DashboardProps {
  onDataUpdate?: () => void
}

export function Dashboard({ onDataUpdate }: DashboardProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [analyticsResponse, transactionsResponse] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/transactions?limit=5"),
      ])

      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json()
        setMonthlyData(analytics.monthlyData)
        setCategoryData(analytics.categoryData)
      }

      if (transactionsResponse.ok) {
        const transactions = await transactionsResponse.json()
        // Handle the new API response format with pagination
        const transactionList = transactions.transactions || transactions
        setRecentTransactions(Array.isArray(transactionList) ? transactionList : [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Trigger parent update when data changes
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate()
    }
  }, [monthlyData, categoryData, onDataUpdate])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Calculate summary statistics
  const currentMonth = monthlyData[monthlyData.length - 1]
  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.amount, 0)
  const totalIncome = currentMonth?.income || 0
  const netIncome = totalIncome - totalExpenses

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Financial Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Overview of your financial activity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-lg sm:text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{categoryData.reduce((sum, cat) => sum + cat.count, 0)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {monthlyData.length > 0 && <MonthlyChart data={monthlyData} />}
        {categoryData.length > 0 && <CategoryChart data={categoryData} />}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
          <CardDescription className="text-sm">Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent transactions</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base truncate">{transaction.description}</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <Badge variant="outline" className="text-xs w-fit">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-semibold text-sm sm:text-base ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
