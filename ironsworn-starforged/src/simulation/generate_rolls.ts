import { createId } from '@paralleldrive/cuid2'
import { createAtom } from '@xstate/store'
import { Effect, Layer, Schedule, Stream } from 'effect'
import { ref } from 'vue'
import { createActor } from 'xstate'
import { ref_intensity } from '@/main'
import { momentumStore } from '@/system/momentum/store'
import { ActionScoreLive } from '@/system/rolls/action_score'
import { DispatchLive } from '@/system/rolls/dispatch'
import { RollFormatterLive } from '@/system/rolls/formatter'
import { ActionRollLive, roll as actionRoll } from '@/system/rolls/handlers/action_roll'
import { roll as oracleRoll } from '@/system/rolls/handlers/oracle_roll'
import { roll as progressRoll } from '@/system/rolls/handlers/progress_roll'
import { machine } from '@/system/rolls/machines/calculate_outcome'
import { number_between } from './prng'
import { save_snapshot } from './storage/snapshots'
import { setup_stores } from './stores'

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
        const choice = Effect.runSync(number_between(seed.get(), 'choice', 0, 1)) > 0
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
export const createSeed = () => (replaySeed.value !== '' ? replaySeed.value : createId())

const modifier = () => Effect.runSync(number_between(seed.get(), 'modifier', 0, 4))

export const roll_stream = (speed_ms: number) => {
    const streamInit = Schedule.spaced(`${speed_ms} millis`)
    return Stream.fromSchedule(streamInit).pipe(
        Stream.tap(() =>
            Effect.sync(() => {
                seed.set(createSeed())
                console.log('seed', seed.get())
            })
        ),
        Stream.tap(() =>
            save_snapshot('run', {
                id: seed.get(),
                intensity: ref_intensity.value,
                status: 'TBD',
            })
        ),
        Stream.tap(() => setup_stores(seed.get(), ref_intensity.value)),
        Stream.tap(() =>
            save_snapshot('rollInputs', {
                run_id: seed.get(),
                modifier: modifier(),
                momentum: momentumStore.get().context.momentum,
                move_name: moveData.Name,
            })
        ),
        Stream.runForEach(n =>
            actionRoll(actor, modifier(), momentumStore.get().context.momentum, moveData.Name).pipe(
                Effect.provide(MainLive)
            )
        )
    )
}
