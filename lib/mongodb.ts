import { MongoClient } from "mongodb"

let uri = process.env.MONGODB_URI

// Ensure the connection string has the required parameters
if (uri && !uri.includes('retryWrites=true')) {
  uri += (uri.includes('?') ? '&' : '?') + 'retryWrites=true&w=majority'
}

// MongoDB connection options - disable SSL for local connections
const isLocalConnection = uri?.includes('localhost') || uri?.includes('127.0.0.1')

const options = {
  ssl: !isLocalConnection,
  tls: !isLocalConnection,
  tlsAllowInvalidCertificates: !isLocalConnection,
  tlsAllowInvalidHostnames: !isLocalConnection,
  retryWrites: true,
  w: 'majority' as const,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client
let clientPromise: Promise<MongoClient>

async function connectToMongo() {
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  
  try {
    const client = new MongoClient(uri, options)
    return await client.connect()
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectToMongo()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  clientPromise = connectToMongo()
}

export default clientPromise
