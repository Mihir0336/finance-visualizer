"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react"
import type { MonthlyData, CategorySummary, Budget } from "@/lib/types"

interface InsightsProps {
  monthlyData: MonthlyData[]
  categoryData: CategorySummary[]
}

export function Insights({ monthlyData, categoryData }: InsightsProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const currentMonth = new Date().toISOString().slice(0, 7)

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(`/api/budgets?month=${currentMonth}`)
        if (response.ok) {
          const data = await response.json()
          setBudgets(data)
        }
      } catch (error) {
        console.error("Failed to fetch budgets:", error)
      }
    }

    fetchBudgets()
  }, [currentMonth])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Calculate insights
  const getSpendingTrend = () => {
    if (monthlyData.length < 2) return null

    const current = monthlyData[monthlyData.length - 1]
    const previous = monthlyData[monthlyData.length - 2]

    const change = current.expenses - previous.expenses
    const percentChange = (change / previous.expenses) * 100

    return {
      change,
      percentChange,
      isIncrease: change > 0,
    }
  }

  const getTopSpendingCategory = () => {
    if (categoryData.length === 0) return null
    return categoryData[0]
  }

  const getBudgetAlerts = () => {
    return budgets
      .map((budget) => {
        const spent = categoryData.find((c) => c.category === budget.category)?.amount || 0
        const percentage = (spent / budget.amount) * 100

        return {
          category: budget.category,
          budget: budget.amount,
          spent,
          percentage,
          isOverBudget: spent > budget.amount,
          isNearLimit: percentage > 80 && percentage <= 100,
        }
      })
      .filter((alert) => alert.isOverBudget || alert.isNearLimit)
  }

  const getAverageTransaction = () => {
    const totalTransactions = categoryData.reduce((sum, cat) => sum + cat.count, 0)
    const totalAmount = categoryData.reduce((sum, cat) => sum + cat.amount, 0)

    if (totalTransactions === 0) return 0
    return totalAmount / totalTransactions
  }

  const spendingTrend = getSpendingTrend()
  const topCategory = getTopSpendingCategory()
  const budgetAlerts = getBudgetAlerts()
  const avgTransaction = getAverageTransaction()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Financial Insights</h2>
        <p className="text-muted-foreground text-sm sm:text-base">AI-powered analysis of your spending patterns</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Spending Trend */}
        {spendingTrend && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Spending Trend</CardTitle>
              {spendingTrend.isIncrease ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {spendingTrend.isIncrease ? "+" : ""}
                {spendingTrend.percentChange.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {spendingTrend.isIncrease ? "Increase" : "Decrease"} from last month
              </p>
              <p className="text-xs sm:text-sm mt-2">
                {formatCurrency(Math.abs(spendingTrend.change))} {spendingTrend.isIncrease ? "more" : "less"} than last
                month
              </p>
            </CardContent>
          </Card>
        )}

        {/* Top Spending Category */}
        {topCategory && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Top Spending Category</CardTitle>
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{topCategory.category}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(topCategory.amount)} • {topCategory.count} transactions
              </p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {((topCategory.amount / categoryData.reduce((sum, cat) => sum + cat.amount, 0)) * 100).toFixed(1)}% of
                  total
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Average Transaction */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(avgTransaction)}</div>
            <p className="text-xs text-muted-foreground">Per transaction this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              Budget Alerts
            </CardTitle>
            <CardDescription className="text-sm">Categories that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {budgetAlerts.map((alert) => (
                <div key={alert.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm sm:text-base">{alert.category}</span>
                    <Badge variant={alert.isOverBudget ? "destructive" : "secondary"} className="text-xs">
                      {alert.isOverBudget ? "Over Budget" : "Near Limit"}
                    </Badge>
                  </div>
                  <Progress
                    value={Math.min(100, alert.percentage)}
                    className={`h-2 ${alert.isOverBudget ? "bg-red-100" : "bg-orange-100"}`}
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                    <span>Spent: {formatCurrency(alert.spent)}</span>
                    <span>Budget: {formatCurrency(alert.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Spending Recommendations</CardTitle>
          <CardDescription className="text-sm">Personalized tips to improve your finances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spendingTrend?.isIncrease && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Spending Increase Detected</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Your expenses increased by {spendingTrend.percentChange.toFixed(1)}% this month. Consider reviewing
                    your {topCategory?.category.toLowerCase()} spending.
                  </p>
                </div>
              </div>
            )}

            {budgetAlerts.length === 0 && budgets.length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Great Budget Management!</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    You're staying within your budgets across all categories. Keep up the good work!
                  </p>
                </div>
              </div>
            )}

            {avgTransaction > 100 && (
              <div className="flex items-start gap-3 p-3  rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm sm:text-base">High Average Transaction</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Your average transaction is {formatCurrency(avgTransaction)}. Consider tracking smaller purchases to
                    get a complete picture.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
