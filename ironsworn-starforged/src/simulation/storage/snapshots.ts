import { Effect } from 'effect';
import { drizzle } from "drizzle-orm/libsql";
import { runTable, rollInputsTable, storesTable } from './schema';
import { createId } from '@paralleldrive/cuid2';

export const db = drizzle({
  connection: {
    url: "file:local.db",
  },
});

export const saveSnaphot = (table: string, options: any) =>
  Effect.sync(() => {
    if (table === 'run') {
      db.insert(runTable).values(options);
    }

    if (table === 'rollInputs') {
      db.insert(rollInputsTable).values({
        id: createId(),
        run_id: options.seed,
        input_data: options.data,
      });
    }

    if (table === 'stores') {
      db.insert(storesTable).values({
        id: createId(),
        run_id: options.seed,
        momentum: options.momentum,
        stats: options.stats,
        resources: options.resources,
        impacts: options.impacts,
        tasks: options.tasks,
        assets: options.assets,
      });
    }
  });
