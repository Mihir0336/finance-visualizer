"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Loader2 } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { TransactionForm } from "./transaction-form"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TransactionListProps {
  onDataUpdate?: () => void
}

export function TransactionList({ onDataUpdate }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const ITEMS_PER_PAGE = 10

  const fetchTransactions = async (page: number = 1, append: boolean = false) => {
    try {
      const response = await fetch(`/api/transactions?page=${page}&limit=${ITEMS_PER_PAGE}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      
      if (append) {
        setTransactions(prev => [...prev, ...data.transactions])
        setDisplayedTransactions(prev => [...prev, ...data.transactions])
      } else {
        setTransactions(data.transactions)
        setDisplayedTransactions(data.transactions)
      }
      
      setHasMore(data.transactions.length === ITEMS_PER_PAGE)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchTransactions(1, false)
  }, [])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    await fetchTransactions(nextPage, true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })

      // Refresh the entire list to maintain consistency
      setCurrentPage(1)
      fetchTransactions(1, false)
      // Trigger parent update
      if (onDataUpdate) {
        onDataUpdate()
      }
      // Notify other tabs/windows
      localStorage.setItem('finance-data-updated', Date.now().toString())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingTransaction(null)
    // Refresh the entire list to maintain consistency
    setCurrentPage(1)
    fetchTransactions(1, false)
    // Trigger parent update
    if (onDataUpdate) {
      onDataUpdate()
    }
    // Notify other tabs/windows
    localStorage.setItem('finance-data-updated', Date.now().toString())
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (showForm || editingTransaction) {
    return (
      <TransactionForm
        transaction={editingTransaction || undefined}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false)
          setEditingTransaction(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Transactions</h2>
          <p className="text-sm text-muted-foreground">
            Showing {displayedTransactions.length} transactions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading transactions...</p>
        </div>
      ) : displayedTransactions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Add your first transaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {displayedTransactions.map((transaction) => (
            <Card key={transaction._id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <Badge variant={transaction.type === "income" ? "default" : "secondary"} className="w-fit text-xs">
                        {transaction.type}
                      </Badge>
                        <Badge variant="outline" className="w-fit text-xs">{transaction.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base truncate">{transaction.description}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span
                        className={`text-base sm:text-lg font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setEditingTransaction(transaction)} className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this transaction? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(transaction._id!)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

          {hasMore && (
            <div className="text-center pt-4">
              <Button 
                onClick={handleLoadMore} 
                disabled={loadingMore}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Transactions'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
