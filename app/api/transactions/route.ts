import { type NextRequest, NextResponse } from "next/server"
import { getTransactions, createTransaction } from "@/lib/db-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")

    const pageNumber = page ? Number.parseInt(page) : 1
    const limitNumber = limit ? Number.parseInt(limit) : 10

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
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const transaction = await createTransaction(body)
    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
