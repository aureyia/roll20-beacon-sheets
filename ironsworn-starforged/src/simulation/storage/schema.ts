import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const runTable = sqliteTable('runs', {
  id: text('seed').primaryKey(),
  intensity: text('intensity').notNull(),
  status: text('status').notNull(),
});

export type InsertRun = typeof runTable.$inferInsert;
export type SelectRun = typeof runTable.$inferSelect;

export const rollInputsTable = sqliteTable('rollInputs', {
  id: integer('id').primaryKey(),
  run_id: text('run_id').notNull().references(() => runTable.id),
  modifier: integer('modifier').notNull(),
  momentum: integer('momentum').notNull(),
  move_name: text('move_name').notNull(),
});

export type InsertRollInputs = typeof rollInputsTable.$inferInsert;
export type SelectRollInputs = typeof rollInputsTable.$inferSelect;

export const storesTable = sqliteTable('stores', {
  id: integer('id').primaryKey(),
  run_id: text('run_id').notNull().references(() => runTable.id),
  momentum: integer('momentum').notNull(),
  stats: text('stats').notNull(),
  resources: text('resources').notNull(),
  impacts: text('impacts').notNull(),
  tasks: text('tasks').notNull(),
  assets: text('assets').notNull(),
});

export type InsertStores = typeof storesTable.$inferInsert;
export type SelectStores = typeof storesTable.$inferSelect;
