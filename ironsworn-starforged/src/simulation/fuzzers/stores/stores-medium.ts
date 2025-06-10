import { Effect } from 'effect';
import { numberBetween } from '../../prng';
import { createId } from '@paralleldrive/cuid2';
import {
  TaskCategory,
  TaskStatus,
  Difficulty,
  type Countdown,
  type Task,
} from '@/system/tasks/types';

export const stats = (seed: string) => ({
  edge: Effect.runSync(numberBetween(seed, 'edge', 1, 5)),
  heart: Effect.runSync(numberBetween(seed, 'heart', 1, 5)),
  iron: Effect.runSync(numberBetween(seed, 'iron', 1, 5)),
  shadow: Effect.runSync(numberBetween(seed, 'shadow', 1, 5)),
  wits: Effect.runSync(numberBetween(seed, 'wits', 1, 5)),
});

export const resources = (seed: string) => ({
  health: Effect.runSync(numberBetween(seed, 'health', 0, 5)),
  spirit: Effect.runSync(numberBetween(seed, 'spirit', 0, 5)),
  supply: Effect.runSync(numberBetween(seed, 'supply', 0, 5)),
  xp: Effect.runSync(numberBetween(seed, 'xp', 0, 10)),
});

const createImpact = (category: string) => ({
  name: 'Name',
  category: category,
  description: 'description',
});

const numberOfImpacts = (seed: string, salt: string) =>
  Effect.runSync(numberBetween(seed, salt, 0, 1));

export const impacts = (seed: string) => {
  const numberOfMisfortunes = numberOfImpacts(seed, 'misfortunes');
  const numberOfLastingEffects = numberOfImpacts(seed, 'lastingEffects');
  const numberOfBurdens = numberOfImpacts(seed, 'burdens');
  const numberOfCurrentVehicle = numberOfImpacts(seed, 'currentVehicle');
  const numberOfOther = numberOfImpacts(seed, 'other');

  let impactsObject = {
    misfortunes: [] as any[],
    lastingEffects: [] as any[],
    burdens: [] as any[],
    currentVehicle: [] as any[],
    other: [] as any[],
  };

  for (let i = 0; i < numberOfMisfortunes; i++) {
    impactsObject['misfortunes'].push(createImpact('misfortunes'));
  }
  for (let i = 0; i < numberOfLastingEffects; i++) {
    impactsObject['lastingEffects'].push(createImpact('lastingEffects'));
  }
  for (let i = 0; i < numberOfBurdens; i++) {
    impactsObject['burdens'].push(createImpact('burdens'));
  }
  for (let i = 0; i < numberOfCurrentVehicle; i++) {
    impactsObject['currentVehicle'].push(createImpact('currentVehicle'));
  }
  for (let i = 0; i < numberOfOther; i++) {
    impactsObject['other'].push(createImpact('other'));
  }

  return impactsObject;
};

enum AssetCategory {
  command_vehicle = 'Command Vehicle',
  module = 'Module',
  support_vehicle = 'Support Vehicle',
  path = 'Path',
  companion = 'Companion',
  deed = 'Deed',
}

type Ability = {
  _id: string;
  dataforgedId: string;
  enabled: boolean;
};

type Asset = {
  _id: string;
  dataforgedId: string;
  name: string;
  category: AssetCategory;
  abilities: Ability[];
  meter: number | null;
};

const createAsset = (seed: string, salt: number) => {
  const categories = Object.values(AssetCategory);
  const abilities = new Array(3).fill(0).map((value, index) => ({
    _id: createId(),
    dataforgedId: `/Example/Asset/${salt}/Ability/${index + 1}`,
    enabled:
      Effect.runSync(
        numberBetween(seed, `${salt}-ability-enabled-${index + 1}`, 0, 1),
      ) === 0,
  }));

  return {
    _id: createId(),
    dataforgedId: '/Example/Asset/Id',
    name: `Asset: ${salt + 1}`,
    category: categories[Effect.runSync(numberBetween(seed, 'category', 0, 5))],
    abilities: abilities,
    meter: null,
  };
};

export const assets = (seed: string) => {
  const numberOfAssets = Effect.runSync(numberBetween(seed, 'assets', 3, 6));

  let assets = [] as Asset[];

  for (let i = 0; i < numberOfAssets; i++) {
    assets.push(createAsset(seed, i));
  }

  return assets;
};

const selectRandomObjectValue = (seed: string, salt: string, obj: Object) => {
  const objLength = Object.values(obj).length;

  return Object.values(obj)[
    Effect.runSync(numberBetween(seed, salt, 0, objLength - 1))
  ];
};

const createTask = (seed: string, salt: number) => ({
  _id: createId(),
  description: `Task: ${salt + 1}`,
  category: selectRandomObjectValue(seed, `${salt}-category`, TaskCategory),
  progress: Effect.runSync(numberBetween(seed, `${salt}-progress`, 0, 40)),
  difficulty: selectRandomObjectValue(seed, `${salt}-difficulty`, Difficulty),
  status: selectRandomObjectValue(seed, `${salt}-status`, TaskStatus),
  countdown: Effect.runSync(
    numberBetween(seed, `${salt}-countdown`, 0, 4),
  ) as Countdown,
});

export const tasks = (seed: string) => {
  const numberOfTasks = Effect.runSync(numberBetween(seed, 'tasks', 1, 6));
  let tasks = [] as Task[];

  for (let index = 0; index < numberOfTasks; index++) {
    tasks.push(createTask(seed, index));
  }

  return tasks;
};
