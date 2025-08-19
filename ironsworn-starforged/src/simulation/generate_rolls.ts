import { createId } from '@paralleldrive/cuid2'
import { createAtom } from '@xstate/store'
import { Effect, Layer, Schedule, Stream } from 'effect'
import { ref } from 'vue'
import { createActor } from 'xstate'
import { intensity_ref } from '@/main'
import { store_momentum } from '@/system/momentum_store'
import { action_score_live } from '@/system/rolls/action_score'
import { dispatch_live } from '@/system/rolls/dispatch'
import { roll_formatter_live } from '@/system/rolls/formatter'
import { action_roll_handler_live, roll as roll_action } from '@/system/rolls/handler_action_roll'
import { machine } from '@/system/rolls/state_machine_calculate_outcome'
import { number_between } from './prng'
import { save_snapshot } from './storage/snapshots'
import { setup_stores } from './stores'

const main_live = action_roll_handler_live.pipe(
    Layer.provide(roll_formatter_live),
    Layer.provide(dispatch_live),
    Layer.provide(action_score_live)
)

const actor = createActor(machine)

actor.subscribe(snapshot => {
    const matched =
        // @ts-expect-error - Due to x-state types
        snapshot.matches('Eligible for Opportunity') ||
        // @ts-expect-error - Due to x-state types
        snapshot.matches('Hitting: Eligible for Strong Hit') ||
        // @ts-expect-error - Due to x-state types
        snapshot.matches('Missing: Eligible for Strong Hit') ||
        // @ts-expect-error - Due to x-state types
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

const move_data = { Name: 'Simulation Rolls' }
export const seed = createAtom('')
export const seed_replay = ref('')
export const create_seed = () => (seed_replay.value !== '' ? seed_replay.value : createId())

const modifier = () => Effect.runSync(number_between(seed.get(), 'modifier', 0, 4))

export const start_roll_stream = (speed_ms: number) => {
    const roll_stream_init = Schedule.spaced(`${speed_ms} millis`)
    return Stream.fromSchedule(roll_stream_init).pipe(
        Stream.tap(() =>
            Effect.sync(() => {
                seed.set(create_seed())
                console.log('seed', seed.get())
            })
        ),
        Stream.tap(() =>
            save_snapshot('run', {
                id: seed.get(),
                intensity: intensity_ref.value,
                status: 'TBD',
            })
        ),
        Stream.tap(() => setup_stores(seed.get(), intensity_ref.value)),
        Stream.tap(() =>
            save_snapshot('rollInputs', {
                run_id: seed.get(),
                modifier: modifier(),
                momentum: store_momentum.get().context.momentum,
                move_name: move_data.Name,
            })
        ),
        Stream.runForEach(() =>
            roll_action(
                actor,
                modifier(),
                store_momentum.get().context.momentum,
                move_data.Name
            ).pipe(Effect.provide(main_live))
        )
    )
}
