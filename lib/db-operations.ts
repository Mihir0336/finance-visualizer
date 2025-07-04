import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import type { Transaction, Budget, CategorySummary, MonthlyData } from "./types"

const DB_NAME = "finance_tracker"

export async function getTransactions(limit?: number): Promise<Transaction[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const query = db.collection("transactions").find({}).sort({ date: -1 })

  if (limit) {
    query.limit(limit)
  }

  const transactions = await query.toArray()

  return transactions.map((t) => ({
    ...t,
    _id: t._id.toString(),
  }))
}

export async function createTransaction(transaction: Omit<Transaction, "_id">): Promise<Transaction> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const result = await db.collection("transactions").insertOne({
    ...transaction,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    ...transaction,
    _id: result.insertedId.toString(),
  }
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>): Promise<void> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  await db.collection("transactions").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...transaction,
        updatedAt: new Date(),
      },
    },
  )
}

export async function deleteTransaction(id: string): Promise<void> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) })
}

export async function getMonthlyExpenses(): Promise<MonthlyData[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const pipeline = [
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%Y-%m", date: { $dateFromString: { dateString: "$date" } } } },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: "$_id.month",
        data: {
          $push: {
            type: "$_id.type",
            amount: "$total",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]

  const result = await db.collection("transactions").aggregate(pipeline).toArray()

  return result.map((item) => {
    const income = item.data.find((d: any) => d.type === "income")?.amount || 0
    const expenses = item.data.find((d: any) => d.type === "expense")?.amount || 0

    return {
      month: item._id,
      income,
      expenses,
      net: income - expenses,
    }
  })
}

export async function getCategorySummary(): Promise<CategorySummary[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const pipeline = [
    { $match: { type: "expense" } },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { amount: -1 } },
  ]

  const result = await db.collection("transactions").aggregate(pipeline).toArray()

  return result.map((item) => ({
    category: item._id,
    amount: item.amount,
    count: item.count,
  }))
}

export async function getBudgets(month: string): Promise<Budget[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const budgets = await db.collection("budgets").find({ month }).toArray()

  return budgets.map((b) => ({
    ...b,
    _id: b._id.toString(),
  }))
}

export async function setBudget(budget: Omit<Budget, "_id">): Promise<Budget> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const result = await db.collection("budgets").findOneAndUpdate(
    { category: budget.category, month: budget.month },
    {
      $set: {
        ...budget,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true, returnDocument: "after" },
  )

  return {
    ...result.value,
    _id: result.value._id.toString(),
  }
}
