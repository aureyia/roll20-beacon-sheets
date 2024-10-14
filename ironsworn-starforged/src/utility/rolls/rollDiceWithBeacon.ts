import { Effect } from "effect";
import { UnknownException } from "effect/Cause";
import { dispatchRef } from "@/relay/relay";
import { convertResultsToDice, formatDiceComponents } from "./convertResultsToDice";
import type { DiceComponent } from "@/rolltemplates/rolltemplates";

export const rollDiceWithBeacon = (dice: DiceComponent[]): Effect.Effect<DiceComponent[], UnknownException> => {
  const formattedDice = formatDiceComponents(dice);

  return Effect.tryPromise(() => dispatchRef.value.roll({rolls: formattedDice}))
    .pipe(
      Effect.andThen((output) => convertResultsToDice(dice, output))
    )
};
