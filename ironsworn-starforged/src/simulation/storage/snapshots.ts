import { Effect } from 'effect'
import { drizzle } from 'drizzle-orm/libsql'
import { runTable, rollInputsTable, storesTable } from './schema'
import { createId } from '@paralleldrive/cuid2'

export const db = drizzle({
  connection: {
    url: 'http://127.0.0.1:8080',
  },
})

export const saveSnaphot = (table: string, options: any) =>
  Effect.promise(async () => {
    if (table === 'run') {
      await db.insert(runTable).values(options)
    }

    if (table === 'rollInputs') {
      await db.insert(rollInputsTable).values(options)
    }

    if (table === 'stores') {
      await db.insert(storesTable).values({
        run_id: options.run_id,
        momentum: options.momentum,
        stats: JSON.stringify(options.stats),
        resources: JSON.stringify(options.resources),
        impacts: JSON.stringify(options.impacts),
        tasks: JSON.stringify(options.tasks),
        assets: JSON.stringify(options.assets),
      })
    }
  })
