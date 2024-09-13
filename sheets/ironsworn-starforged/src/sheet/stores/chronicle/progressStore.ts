import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { createId } from '@paralleldrive/cuid2'
import { arrayToObject, objectToArray } from '@/utility/objectify';
import { dispatchRef, initValues } from '@/relay/relay';
import { type LimitedRange } from '@/utility/limitedRange';
import getRollResult from '@/utility/getRollResult';
import type { Dispatch } from '@roll20-official/beacon-sdk';
import { taskDice } from '@/system/dice';
import { createRollTemplate } from '@/rolltemplates/rolltemplates';

export type Difficulty = 'troublesome' | 'dangerous' | 'formidable' | 'extreme' | 'epic'
export type TaskCategory = 'vow' | 'generic' | 'challenge'
export type TaskStatus = 'active' | 'completed' | 'failed' | 'abandoned'
export type Countdown = 0 | 1 | 2 | 3 | 4
export type ProgressRange = LimitedRange<0, 40>

interface Task {
  _id: string
  description: string
  type: TaskCategory
  progress: number
  difficulty: Difficulty
  status: TaskStatus
  countdown?: Countdown
}

interface taskHydrate {
  tasks: Task[]
};

export const useTaskStore = defineStore('task', () => {

  const tasks: Ref<Array<Task>> = ref([]);

  const addTask = () => {

  }

//   const updatedTasks = tasks.value.map((task :Task) => {
//     if (task._id === id) {
//       let newProgress
//       switch (task.difficulty) {
//         case 'troublesome':
//           newProgress = (task.progress + 12 > 40) ? 40 : task.progress + 12 
//           break
//         case 'dangerous':
//           newProgress = (task.progress + 8 > 40) ? 40 : task.progress + 8
//           break
//         case 'formidable':
//           newProgress = (task.progress + 4 > 40) ? 40 : task.progress + 4
//           break
//         case 'extreme':
//           newProgress = (task.progress + 2 > 40) ? 40 : task.progress + 2
//           break
//         case 'epic':
//           newProgress = (task.progress + 1 > 40) ? 40 : task.progress + 1
//           break
//         default:
//           throw new Error('Invalid difficulty')
//       }
//       task.progress = newProgress
//       return task
//     }
//     return task
//   })
//   tasks.value = updatedTasks
// }

  /**
   * Increase the progress of a task by the corresponding amount based on its difficulty.
   * The progress is capped at 40.
   * @param id The id of the task to update.
   */
  const markProgress = (id :Task['_id']) => {
    const task = tasks.value.find(task => task._id === id);
    if (task) {
      task.progress = Math.min(40, task.progress + {
        troublesome: 12,
        dangerous: 8,
        formidable: 4,
        extreme: 2,
        epic: 1
      }[task.difficulty]);
    }
  }

  const roll = async (id: Task['_id'], customDispatch?: Dispatch) => {
    const dispatch = customDispatch || (dispatchRef.value as Dispatch);
    const task = tasks.value.find(task => task._id === id);
    const calculatedProgress = Math.floor((task?.progress ?? 0) / 4)

    const { dice } = await getRollResult(taskDice, dispatch);

    const rollTemplate = createRollTemplate({
      type: 'task',
      parameters: {
        characterName: initValues.character.name,
        title: 'Rolling ' + task?.type,
        dice,
        progress: calculatedProgress,
      }
    });

    await dispatch.post({
      characterId: initValues.character.id,
      content: rollTemplate,
      options: {
        whisper: undefined,
        secret: undefined,
      },
    });

    return dice;
  }

  const dehydrate = () => {
    return {
      tasks: arrayToObject(tasks.value)
    };
  };

  const hydrate = (hydrateStore: taskHydrate) => {
    tasks.value = objectToArray(hydrateStore.tasks) ?? tasks.value
  };

  return {
    tasks,
    roll,
    markProgress,
    dehydrate,
    hydrate,
  };
});