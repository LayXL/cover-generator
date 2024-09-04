import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./db/schema"

const queryClient = postgres(<string>Bun.env.DB_URL)

export const db = drizzle(queryClient, { schema })

export * as schema from "./db/schema"
