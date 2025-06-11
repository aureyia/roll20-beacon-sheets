import { Effect } from 'effect';
import { runTable, rollInputsTable, storesTable } from './schema';
import { createId } from '@paralleldrive/cuid2';

import { createClient } from "@libsql/client/web";

export const db = createClient({
  url: "http://127.0.0.1:8080"
});

export const saveSnaphot = (table: string, options: any) =>
  Effect.promise(async () => {
    if (table === 'run') {
      // db.insert(runTable).values(options);
      await db.execute({
        sql: 'INSERT INTO'
      })
    }

    if (table === 'rollInputs') {
      // await db.insert(rollInputsTable).values({
      //   id: createId(),
      //   run_id: options.seed,
      //   input_data: JSON.stringify(options.data),
      // })
    }

    if (table === 'stores') {
      // await db.insert(storesTable).values({
      //   id: createId(),
      //   run_id: options.seed,
      //   momentum: options.momentum,
      //   stats: JSON.stringify(options.stats),
      //   resources: JSON.stringify(options.resources),
      //   impacts: JSON.stringify(options.impacts),
      //   tasks: JSON.stringify(options.tasks),
      //   assets: JSON.stringify(options.assets),
      // })
    }
  });
