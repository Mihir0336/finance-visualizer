export interface Transaction {
  _id?: string
  amount: number
  description: string
  category: string
  date: string
  type: "income" | "expense"
  createdAt?: Date
  updatedAt?: Date
}

export interface Budget {
  _id?: string
  category: string
  amount: number
  month: string // YYYY-MM format
  createdAt?: Date
  updatedAt?: Date
}

export interface CategorySummary {
  category: string
  amount: number
  count: number
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Other",
] as const

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Refund",
  "Bonus",
  "Commission",
  "Rental Income",
  "Other",
] as const

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Other",
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type Category = (typeof CATEGORIES)[number]

export function getCategoriesForType(type: "income" | "expense"): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}
