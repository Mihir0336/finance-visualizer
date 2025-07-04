import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check if we're in a build environment
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 })
  }

  try {
    const body = await request.json()
    
    // Dynamic import to avoid build-time execution
    const { updateTransaction } = await import("@/lib/db-operations")
    await updateTransaction(params.id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Transaction PUT API error:", error)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check if we're in a build environment
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 })
  }

  try {
    // Dynamic import to avoid build-time execution
    const { deleteTransaction } = await import("@/lib/db-operations")
    await deleteTransaction(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Transaction DELETE API error:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}
