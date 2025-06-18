import { Effect, Layer, Stream, Schedule } from 'effect'
import { momentumStore } from '@/system/momentum/store'
import { roll as actionRoll } from '@/system/rolls/handlers/action-roll'
import { roll as progressRoll } from '@/system/rolls/handlers/progress-roll'
import { roll as oracleRoll } from '@/system/rolls/handlers/oracle-roll'
import { machine } from '@/system/rolls/machines/calculate-outcome'
import { createAtom } from '@xstate/store'
import { createActor } from 'xstate'
import { RollFormatterLive } from '@/system/rolls/formatter'
import { DispatchLive } from '@/system/rolls/dispatch'
import { ActionRollLive } from '@/system/rolls/handlers/action-roll'
import { ActionScoreLive } from '@/system/rolls/action-score'
import { createId } from '@paralleldrive/cuid2'
import { numberBetween } from './prng'
import { ref } from 'vue'
import { intensity } from '@/main'
import { setupStores } from './stores'
import { saveSnapshot } from './storage/snapshots'

const MainLive = ActionRollLive.pipe(
    Layer.provide(RollFormatterLive),
    Layer.provide(DispatchLive),
    Layer.provide(ActionScoreLive)
)

const actor = createActor(machine)

actor.subscribe(snapshot => {
    const matched =
        // @ts-ignore
        snapshot.matches('Eligible for Opportunity') ||
        // @ts-ignore
        snapshot.matches('Hitting: Eligible for Strong Hit') ||
        // @ts-ignore
        snapshot.matches('Missing: Eligible for Strong Hit') ||
        // @ts-ignore
        snapshot.matches('Eligible for Weak Hit')

    if (matched) {
        const choice =
            Effect.runSync(numberBetween(seed.get(), 'choice', 0, 1)) > 0
        actor.send({
            type: 'burnChoice',
            value: choice,
        })
    }
})

actor.start()

const moveData = { Name: 'Simulation Rolls' }
export const seed = createAtom('')
export const replaySeed = ref('')
export const createSeed = () =>
    replaySeed.value !== '' ? replaySeed.value : createId()

const modifier = () =>
    Effect.runSync(numberBetween(seed.get(), 'modifier', 0, 4))

export const rollSteam = (speed: number) => {
    const streamInit = Schedule.spaced(`${speed} millis`)
    return Stream.fromSchedule(streamInit).pipe(
        Stream.tap(() =>
            Effect.sync(() => {
                seed.set(createSeed())
                console.log('seed', seed.get())
            })
        ),
        Stream.tap(() =>
            saveSnapshot('run', {
                id: seed.get(),
                intensity: intensity.value,
                status: 'TBD',
            })
        ),
        Stream.tap(() => setupStores(seed.get(), intensity.value)),
        Stream.tap(() =>
            saveSnapshot('rollInputs', {
                run_id: seed.get(),
                modifier: modifier(),
                momentum: momentumStore.get().context.momentum,
                move_name: moveData.Name,
            })
        ),
        Stream.runForEach(n =>
            actionRoll(
                actor,
                modifier(),
                momentumStore.get().context.momentum,
                moveData.Name
            ).pipe(Effect.provide(MainLive))
        )
    )
}
