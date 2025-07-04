import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Check if we're in a build environment
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ 
      transactions: [], 
      pagination: { page: 1, limit: 10, hasMore: false } 
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")

    const pageNumber = page ? Number.parseInt(page) : 1
    const limitNumber = limit ? Number.parseInt(limit) : 10

    // Dynamic import to avoid build-time execution
    const { getTransactions } = await import("@/lib/db-operations")
    const transactions = await getTransactions(limitNumber, (pageNumber - 1) * limitNumber)
    
    return NextResponse.json({
      transactions,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        hasMore: transactions.length === limitNumber
      }
    })
  } catch (error) {
    console.error("Transactions GET API error:", error)
    return NextResponse.json({ 
      transactions: [], 
      pagination: { page: 1, limit: 10, hasMore: false } 
    })
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
    const { createTransaction } = await import("@/lib/db-operations")
    const transaction = await createTransaction(body)
    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Transactions POST API error:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
