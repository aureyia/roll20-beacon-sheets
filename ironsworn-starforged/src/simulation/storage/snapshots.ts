import { drizzle } from 'drizzle-orm/libsql'
import { Effect } from 'effect'
import { table_roll_inputs, table_run, table_stores } from './schema'

export const db = drizzle({
    connection: {
        url: 'http://127.0.0.1:8080',
    },
})

export const save_snapshot = (table: string, options: any) =>
    Effect.promise(async () => {
        if (table === 'run') {
            await db.insert(table_run).values(options)
        }

        if (table === 'rollInputs') {
            await db.insert(table_roll_inputs).values(options)
        }

        if (table === 'stores') {
            await db.insert(table_stores).values({
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
