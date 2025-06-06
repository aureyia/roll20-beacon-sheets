import { Effect } from 'effect';
import { numberBetween } from '../../prng';

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
  description: 'description'
})

const numberOfImpacts = (seed: string, salt: string) =>
  Effect.runSync(numberBetween(seed, salt, 0, 1));

export const impacts = (seed: string) => {
  const numberOfMisfortunes = numberOfImpacts(seed, 'misfortunes')
  const numberOfLastingEffects = numberOfImpacts(seed, 'lastingEffects')
  const numberOfBurdens = numberOfImpacts(seed, 'burdens')
  const numberOfCurrentVehicle = numberOfImpacts(seed, 'currentVehicle')
  const numberOfOther = numberOfImpacts(seed, 'other')

  let impactsObject = {
    misfortunes: [] as any[],
    lastingEffects: [] as any[],
    burdens: [] as any[],
    currentVehicle: [] as any[],
    other: [] as any[],
  }

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
export const assets = (seed: string) => {};
export const tasks = (seed: string) => {};
