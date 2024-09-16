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

export type ProgressRange = LimitedRange<0, 40>
export type Task = {
  _id: string
  description: string
  category: TaskCategory
  progress: number
  difficulty: Difficulty
  status: TaskStatus
  countdown?: Countdown
}

export type Vow = Omit<Task, 'countdown'>
export type GenericTask = Omit<Task, 'countdown'>
export type Difficulty = 'troublesome' | 'dangerous' | 'formidable' | 'extreme' | 'epic'
export type  TaskCategory = 'vow' | 'generic' | 'challenge'
export type TaskStatus = 'active' | 'completed' | 'failed' | 'abandoned'
export type Countdown = 0 | 1 | 2 | 3 | 4

type taskHydrate = { tasks: Task[] };
export const useTaskStore = defineStore('task', () => {

  const tasks: Ref<Array<Task>> = ref([]);

  const addTask = (description: string, category: TaskCategory, difficulty: Difficulty) => {
    tasks.value.push({ _id: createId(), description, category, progress: 0, difficulty, status: 'active' })
  }

  const removeTask = (id: string) => {
    tasks.value = tasks.value.filter((task: Task) => task._id !== id)
  }

  const updateDifficulty = (id: string, difficulty: Difficulty) => {
    tasks.value = tasks.value.map((task: Task) => {
      if (task._id === id) {
        task.difficulty = difficulty
      }
      return task
    })
  }

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

  const clearProgress = (id: string) => {
    tasks.value = tasks.value.map((task: Task) => {
      if (task._id === id) {
        task.progress = 0
      }
      return task
    })
  }

  const manualProgressUpdate = (id: string, progress: number) => {
    tasks.value = tasks.value.map((task: Task) => {
      if (task._id === id) {
        task.progress = progress + task.progress
      }
      return task
    })
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
        title: 'Rolling ' + task?.category,
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
    updateDifficulty,
    manualProgressUpdate,
    removeTask,
    addTask,
    roll,
    clearProgress,
    markProgress,
    dehydrate,
    hydrate,
  };
});