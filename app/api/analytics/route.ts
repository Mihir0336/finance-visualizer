import { NextResponse } from "next/server"
import { getMonthlyExpenses, getCategorySummary } from "@/lib/db-operations"

export async function GET() {
  try {
    const [monthlyData, categoryData] = await Promise.all([getMonthlyExpenses(), getCategorySummary()])

    return NextResponse.json({
      monthlyData,
      categoryData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
