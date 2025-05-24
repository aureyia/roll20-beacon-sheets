import { Effect } from 'effect';
import { UnknownException } from 'effect/Cause';
import { dispatchRef } from '@/external/relay/relay';
import {
  convertResultsToDice,
  formatDiceComponents,
} from './convertResultsToDice';
import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates';
import type { RolledDice } from '@/system/rolls/dice';

export const rollDiceWithBeacon = (
  dice: DiceComponent[],
): Effect.Effect<RolledDice[], UnknownException> => {
  const formattedDice = formatDiceComponents(dice);

  return Effect.tryPromise(() =>
    dispatchRef.value.roll({ rolls: formattedDice }),
  ).pipe(Effect.andThen((output) => convertResultsToDice(dice, output)));
};
