import { Console, Duration, Effect, Queue, Stream } from 'effect'
import { sync } from '@/external/sync'
import { store_assets } from '@/system/assets/store'
import { store_character } from '@/system/character.store'
import { store_impacts } from '@/system/impacts/store'
import { store_momentum } from '@/system/momentum/store'
import { store_resources } from '@/system/resources.store'
import { store_settings } from '@/system/settings.store'
import { store_stats } from '@/system/stats.store'
import { store_tasks } from '@/system/tasks/store'
import { store_meta } from './store'

export const relay_store = Effect.gen(function* () {
    const queue = yield* Queue.bounded<string>(20)

    const update = () =>
        Effect.gen(function* () {
            yield* Queue.offer(queue, 'update')
        })

    store_meta.on('updated', () => Effect.runPromise(update()))
    store_character.on('updated', () => Effect.runPromise(update()))
    store_resources.on('updated', () => Effect.runPromise(update()))
    store_impacts.on('updated', () => Effect.runPromise(update()))
    store_momentum.on('updated', () => Effect.runPromise(update()))
    store_assets.on('updated', () => Effect.runPromise(update()))
    store_stats.on('updated', () => Effect.runPromise(update()))
    store_tasks.on('updated', () => Effect.runPromise(update()))
    store_settings.on('updated', () => Effect.runPromise(update()))

    // @ts-ignore
    const debounce_duration = Number(import.meta.env.VITE_DEBOUNCE) || 800

    const stream = Stream.fromQueue(queue).pipe(
        Stream.tap(() => Console.log('Testing')),
        Stream.debounce(Duration.millis(debounce_duration))
    )

    yield* Stream.runForEach(stream, () => Effect.sync(() => sync.send({ type: 'update' })))

    console.log('Store Relay: Initialised')
})
