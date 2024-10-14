import { Context, Effect, pipe, Layer } from "effect";
import { UnknownException } from "effect/Cause";
import { dispatchRef } from "@/relay/relay";
import { convertResultsToDice, formatDiceComponents } from "./convertResultsToDice";
import type { DiceComponent } from "@/rolltemplates/rolltemplates";
import { FormattedRoll } from "./rollTypes";


// TODO: Try and get services/layers working

class Dispatch extends Context.Tag('@app/Dispatch')<
  Dispatch,
  { readonly roll: (formattedDice: FormattedRoll) => Effect.Effect<unknown, UnknownException, never> }
>() {};

export const DispatchLive = Layer.effect(
  Dispatch,
  {
    roll: (formattedDice: FormattedRoll) => Effect.tryPromise(() => dispatchRef.value.roll({rolls: formattedDice}))
  }
)

class BeaconRoll extends Context.Tag('@app/BeaconRoll')<
  BeaconRoll,
  { readonly roll: () => Effect.Effect<DiceComponent[], UnknownException>}
>() {};

export const BeaconRollLive = Layer.effect(
  BeaconRoll,
  {
    roll: (dice: DiceComponent[]) => pipe(
      Effect.andThen(() => formatDiceComponents(dice)),
      Effect.andThen((formattedDice) => Dispatch.pipe(
        Effect.flatMap((dispatch) => Effect.runPromise(dispatch.roll(formattedDice)))
      )),
      Effect.andThen((result) => convertResultsToDice(dice, result))
    )
  }
)

export const rollDiceWithBeacon = (dice: DiceComponent[]): Effect.Effect<DiceComponent[], UnknownException> => {
  const formattedDice = formatDiceComponents(dice);

  return Effect.tryPromise(() => dispatchRef.value.roll({rolls: formattedDice})).pipe(
    Effect.andThen((output) => convertResultsToDice(dice, output))
  )
};