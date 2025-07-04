import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Check if we're in a build environment
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json([])
  }

  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7)

    // Dynamic import to avoid build-time execution
    const { getBudgets } = await import("@/lib/db-operations")
    const budgets = await getBudgets(month)
    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Budgets GET API error:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  // Check if we're in a build environment
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 })
  }

  try {
    const body = await request.json()
    
    // Dynamic import to avoid build-time execution
    const { setBudget } = await import("@/lib/db-operations")
    const budget = await setBudget(body)
    return NextResponse.json(budget)
  } catch (error) {
    console.error("Budgets POST API error:", error)
    return NextResponse.json({ error: "Failed to set budget" }, { status: 500 })
  }
}
