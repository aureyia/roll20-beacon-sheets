import { Effect } from 'effect';
import { UnknownException } from 'effect/Cause';
import { dispatchRef } from '@/relay/relay';
import {
  convertResultsToDice,
  formatDiceComponents,
} from './convertResultsToDice';
import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import type { RolledDice } from '@/system/dice';

export const rollDiceWithBeacon = (
  dice: DiceComponent[],
): Effect.Effect<RolledDice[], UnknownException> => {
  const formattedDice = formatDiceComponents(dice);

  return Effect.tryPromise(() =>
    dispatchRef.value.roll({ rolls: formattedDice }),
  ).pipe(Effect.andThen((output) => convertResultsToDice(dice, output)));
};
