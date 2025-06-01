import { createId } from '@paralleldrive/cuid2';
import { arrayToObject, objectToArray } from '@/utility/objectify';
import { type LimitedRange } from '@/utility/limitedRange';

import { Effect, Layer, Context } from 'effect';
import { createStore } from '@xstate/store';

export type ProgressRange = LimitedRange<0, 40>;
export type Task = {
  _id: string;
  description: string;
  category: TaskCategory;
  progress: number;
  difficulty: Difficulty;
  status: TaskStatus;
  countdown?: Countdown;
};

export type Vow = Omit<Task, 'countdown'>;
export type GenericTask = Omit<Task, 'countdown'>;
export type Difficulty =
  | 'troublesome'
  | 'dangerous'
  | 'formidable'
  | 'extreme'
  | 'epic';
export type TaskCategory = 'vow' | 'generic' | 'challenge';
export type TaskStatus = 'active' | 'completed' | 'failed' | 'abandoned';
export type Countdown = 0 | 1 | 2 | 3 | 4;

type taskHydrate = { tasks: Task[] };
// export const useTaskStore = defineStore('task', () => {
//   const tasks: Ref<Array<Task>> = ref([]);

//   const addTask = (
//     description: string,
//     category: TaskCategory,
//     difficulty: Difficulty,
//   ) => {
//     tasks.value.push({
//       _id: createId(),
//       description,
//       category,
//       progress: 0,
//       difficulty,
//       status: 'active',
//     });
//   };

//   const removeTask = (id: string) => {
//     tasks.value = tasks.value.filter((task: Task) => task._id !== id);
//   };

//   const updateDifficulty = (id: string, difficulty: Difficulty) => {
//     tasks.value = tasks.value.map((task: Task) => {
//       if (task._id === id) {
//         task.difficulty = difficulty;
//       }
//       return task;
//     });
//   };

//   /**
//    * Increase the progress of a task by the corresponding amount based on its difficulty.
//    * The progress is capped at 40.
//    * @param id The id of the task to update.
//    */
//   const markProgress = (id: Task['_id']) => {
//     const task = tasks.value.find((task) => task._id === id);
//     if (task) {
//       task.progress = Math.min(
//         40,
//         task.progress +
//           {
//             troublesome: 12,
//             dangerous: 8,
//             formidable: 4,
//             extreme: 2,
//             epic: 1,
//           }[task.difficulty],
//       );
//     }
//   };

//   const clearProgress = (id: string) => {
//     tasks.value = tasks.value.map((task: Task) => {
//       if (task._id === id) {
//         task.progress = 0;
//       }
//       return task;
//     });
//   };

//   const manualProgressUpdate = (id: string, progress: number) => {
//     tasks.value = tasks.value.map((task: Task) => {
//       if (task._id === id) {
//         task.progress = progress + task.progress;
//       }
//       return task;
//     });
//   };

//   const dehydrate = () => {
//     return Effect.succeed({
//       tasks: Effect.runSync(arrayToObject(tasks.value)),
//     });
//   };

//   const hydrate = (hydrateStore: taskHydrate) => {
//     tasks.value =
//       Effect.runSync(objectToArray(hydrateStore.tasks)) ?? tasks.value;
//   };

//   return {
//     tasks,
//     updateDifficulty,
//     manualProgressUpdate,
//     removeTask,
//     addTask,
//     // roll,
//     clearProgress,
//     markProgress,
//     dehydrate,
//     hydrate,
//   };
// });

type SetEvent = {
  label: keyof Vow | keyof GenericTask;
  id: string;
  value: Vow[keyof Vow] | GenericTask[keyof GenericTask];
};

export const tasksStore = createStore({
  context: {
    list: [] as GenericTask[] | Vow[],
  },
  emits: {
    updated: () => {},
  },
  on: {
    hydrate: (
      context,
      event: { type: 'hydrate'; tasks: Record<string, any> },
    ) => {
      context.list = Effect.runSync(objectToArray(event.tasks)) ?? context.list;
    },
    add: (context, event, enqueue) => {
      //     description: string,
      //     category: TaskCategory,
      //     difficulty: Difficulty,
      //   ) => {
      //     tasks.value.push({
      //       _id: createId(),
      //       description,
      //       category,
      //       progress: 0,
      //       difficulty,
      //       status: 'active',
      //     });
      enqueue.emit.updated();
    },
    remove: () => {},
    set: (context, event: SetEvent, enqueue) => {
      context.list = context.list.map((task) => {
        if (task._id === event.id) {
          // TODO: Fix types
          // @ts-ignore
          task[event.label] = event.value;
        }

        return task;
      });
      enqueue.emit.updated();
    },
  },
});

export class DehydrateTasks extends Context.Tag('DehydrateTasks')<
  DehydrateTasks,
  {
    readonly dehydrate: () => Effect.Effect<Record<string, any>, never, never>;
  }
>() {}

export const DehydrateTasksLive = Layer.effect(
  DehydrateTasks,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = tasksStore.get().context.list;
          return yield* arrayToObject(context);
        }),
    };
  }),
);
