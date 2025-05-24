import { Effect } from 'effect';
import type {
  RolledDie,
  RolledChallengeDie,
  RolledActionDie,
  RolledOracleDie,
} from '@/system/rolls/dice';

export function getDieByLabel(
  dice: RolledDie[],
  label: 'Challenge Die: 1' | 'Challenge Die: 2',
): Effect.Effect<RolledChallengeDie, Error>;
export function getDieByLabel(
  dice: RolledDie[],
  label: 'Action Die',
): Effect.Effect<RolledActionDie, Error>;
export function getDieByLabel(
  dice: RolledDie[],
  label: 'Oracle Die',
): Effect.Effect<RolledOracleDie, Error>;
export function getDieByLabel<T extends RolledDie>(
  dice: T[],
  label: T['label'],
): Effect.Effect<T, Error> {
  const die = dice.find((die): die is T => die.label === label);

  if (!die) {
    return Effect.fail(Error(`Could not find die with label: ${label}`));
  }

  return Effect.succeed(die);
}
