import { NextResponse } from "next/server"

export async function GET() {
  // Check if we're in a build environment
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ 
      monthlyData: [], 
      categoryData: [] 
    })
  }

  try {
    // Dynamic import to avoid build-time execution
    const { getMonthlyExpenses, getCategorySummary } = await import("@/lib/db-operations")
    
    const [monthlyData, categoryData] = await Promise.all([
      getMonthlyExpenses(), 
      getCategorySummary()
    ])

    return NextResponse.json({
      monthlyData,
      categoryData,
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ 
      monthlyData: [], 
      categoryData: [] 
    })
  }
}
