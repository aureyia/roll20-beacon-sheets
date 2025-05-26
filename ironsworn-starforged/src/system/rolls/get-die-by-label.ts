import { Effect, Data } from 'effect';
import type {
  RolledDie,
  RolledChallengeDie,
  RolledActionDie,
  RolledOracleDie,
} from '@/system/rolls/dice';

type DieLabelMap = {
  'Challenge Die: 1': RolledChallengeDie;
  'Challenge Die: 2': RolledChallengeDie;
  'Action Die': RolledActionDie;
  'Oracle Die': RolledOracleDie;
};

export class DieNotFound extends Data.TaggedError('DieNotFound')<{
  message: string;
}> {}

export function getDieByLabel<L extends keyof DieLabelMap>(
  dice: RolledDie[],
  label: L,
): Effect.Effect<DieLabelMap[L], DieNotFound> {
  const die = dice.find((die): die is DieLabelMap[L] => die.label === label);

  if (!die) {
    return Effect.fail(
      new DieNotFound({ message: `Could not find die with label: ${label}` }),
    );
  }

  return Effect.succeed(die);
}
