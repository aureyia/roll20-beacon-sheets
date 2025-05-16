import { Effect } from 'effect';
import { UnknownException } from 'effect/Cause';
import { dispatchRef } from '@/external/relay/bootstrap/relay';
import {
  convertResultsToDice,
  formatDiceComponents,
} from './convertResultsToDice';
import type { DiceComponent } from '@/internal/rolls/application/rolltemplates/rolltemplates';
import type { RolledDice } from '@/internal/rolls/application/dice';

export const rollDiceWithBeacon = (
  dice: DiceComponent[],
): Effect.Effect<RolledDice[], UnknownException> => {
  const formattedDice = formatDiceComponents(dice);

  return Effect.tryPromise(() =>
    dispatchRef.value.roll({ rolls: formattedDice }),
  ).pipe(Effect.andThen((output) => convertResultsToDice(dice, output)));
};
