import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const runTable = sqliteTable('runs', {
  id: text('seed').primaryKey(),
  intensity: text('intensity').notNull(),
  status: text('status').notNull(),
});

export type InsertRun = typeof runTable.$inferInsert;
export type SelectRun = typeof runTable.$inferSelect;

export const rollInputsTable = sqliteTable('rollInputs', {
  id: text('id').primaryKey(),
  run_id: text('run_id').notNull().references(() => runTable.id),
  input_data: text('input_data', { mode: 'json' }).notNull(),
});

export type InsertRollInputs = typeof rollInputsTable.$inferInsert;
export type SelectRollInputs = typeof rollInputsTable.$inferSelect;

export const storesTable = sqliteTable('stores', {
  id: text('id').primaryKey(),
  run_id: text('run_id').notNull().references(() => runTable.id),
  momentum: integer('momentum').notNull(),
  stats: text('stats', { mode: 'json' }).notNull(),
  resources: text('resources', { mode: 'json' }).notNull(),
  impacts: text('impacts', { mode: 'json' }).notNull(),
  tasks: text('tasks', { mode: 'json' }).notNull(),
  assets: text('assets', { mode: 'json' }).notNull(),
});

export type InsertStores = typeof storesTable.$inferInsert;
export type SelectStores = typeof storesTable.$inferSelect;
