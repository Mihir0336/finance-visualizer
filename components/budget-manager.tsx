"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { EXPENSE_CATEGORIES, type Budget, type CategorySummary } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface BudgetManagerProps {
  categoryData: CategorySummary[]
  onDataUpdate?: () => void
}

export function BudgetManager({ categoryData, onDataUpdate }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" })
  const { toast } = useToast()

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setBudgets(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [currentMonth])

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newBudget.category || !newBudget.amount || Number.parseFloat(newBudget.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please select a category and enter a valid amount",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newBudget.category,
          amount: Number.parseFloat(newBudget.amount),
          month: currentMonth,
        }),
      })

      if (!response.ok) throw new Error("Failed to set budget")

      toast({
        title: "Success",
        description: "Budget set successfully",
      })

      setNewBudget({ category: "", amount: "" })
      fetchBudgets()
      // Trigger parent update
      if (onDataUpdate) {
        onDataUpdate()
      }
      // Notify other tabs/windows
      localStorage.setItem('finance-data-updated', Date.now().toString())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set budget",
        variant: "destructive",
      })
    }
  }

  const getBudgetProgress = (category: string) => {
    const budget = budgets.find((b) => b.category === category)
    const spent = categoryData.find((c) => c.category === category)?.amount || 0

    if (!budget) return null

    const percentage = (spent / budget.amount) * 100
    return {
      budget: budget.amount,
      spent,
      remaining: Math.max(0, budget.amount - spent),
      percentage: Math.min(100, percentage),
      isOverBudget: spent > budget.amount,
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const availableCategories = EXPENSE_CATEGORIES.filter((category) => !budgets.some((budget) => budget.category === category))

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Budget Management</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="month" className="text-sm">Month:</Label>
          <Input
            id="month"
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Set New Budget */}
      {availableCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Set Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetBudget} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBudget.category}
                  onValueChange={(value) => setNewBudget((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">Set Budget</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Budget Overview */}
      {loading ? (
        <div className="text-center py-8">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No budgets set for this month</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = getBudgetProgress(budget.category)

            return (
              <Card key={budget._id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg">{budget.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  {progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Spent: {formatCurrency(progress.spent)}</span>
                        <span>Budget: {formatCurrency(progress.budget)}</span>
                      </div>
                      <Progress
                        value={progress.percentage}
                        className={`h-2 ${progress.isOverBudget ? "bg-red-100" : ""}`}
                      />
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={progress.isOverBudget ? "text-red-600" : "text-green-600"}>
                          {progress.isOverBudget ? "Over budget" : "Remaining"}:{" "}
                          {formatCurrency(Math.abs(progress.remaining))}
                        </span>
                        <span className="text-muted-foreground">{progress.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
