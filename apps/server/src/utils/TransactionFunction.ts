import type { db } from "drizzle"

export type TransactionFunction = Parameters<typeof db.transaction>[0]

export type DBTransaction = Parameters<TransactionFunction>[0]
