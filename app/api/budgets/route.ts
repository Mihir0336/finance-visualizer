import { type NextRequest, NextResponse } from "next/server"
import { getBudgets, setBudget } from "@/lib/db-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7)

    const budgets = await getBudgets(month)
    return NextResponse.json(budgets)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const budget = await setBudget(body)
    return NextResponse.json(budget)
  } catch (error) {
    return NextResponse.json({ error: "Failed to set budget" }, { status: 500 })
  }
}
