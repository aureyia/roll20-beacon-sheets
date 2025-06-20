import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const table_run = sqliteTable('runs', {
    id: text('seed').primaryKey(),
    intensity: text('intensity').notNull(),
    status: text('status').notNull(),
})

export type InsertRun = typeof table_run.$inferInsert
export type SelectRun = typeof table_run.$inferSelect

export const table_roll_inputs = sqliteTable('rollInputs', {
    id: integer('id').primaryKey(),
    run_id: text('run_id')
        .notNull()
        .references(() => table_run.id),
    modifier: integer('modifier').notNull(),
    momentum: integer('momentum').notNull(),
    move_name: text('move_name').notNull(),
})

export type InsertRollInputs = typeof table_roll_inputs.$inferInsert
export type SelectRollInputs = typeof table_roll_inputs.$inferSelect

export const table_stores = sqliteTable('stores', {
    id: integer('id').primaryKey(),
    run_id: text('run_id')
        .notNull()
        .references(() => table_run.id),
    momentum: integer('momentum').notNull(),
    stats: text('stats').notNull(),
    resources: text('resources').notNull(),
    impacts: text('impacts').notNull(),
    tasks: text('tasks').notNull(),
    assets: text('assets').notNull(),
})

export type InsertStores = typeof table_stores.$inferInsert
export type SelectStores = typeof table_stores.$inferSelect
