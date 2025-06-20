import { Effect, Fiber, Queue, Ref, Stream, SubscriptionRef } from 'effect'
import { type Ref as VueRef, watch } from 'vue'
import { runner_simulation } from './simulator'

export const runner = (roll_speed: VueRef) =>
    Effect.gen(function* () {
        const queue = yield* Queue.bounded<number>(20)
        const fiber_ref = yield* SubscriptionRef.make<Fiber.RuntimeFiber<
            // biome-ignore lint: Intentional any
            any,
            // biome-ignore lint: Intentional any
            any
        > | null>(null)

        const start_fiber = (speed_ms: number) => Effect.fork(runner_simulation(speed_ms))

        const fiber_initial = yield* start_fiber(roll_speed.value[0])
        yield* Ref.set(fiber_ref, fiber_initial)

        watch(roll_speed, speed_ms => {
            Effect.runPromise(Queue.offer(queue, speed_ms[0]))
        })

        const stream = Stream.fromQueue(queue).pipe(Stream.debounce('3000 millis'))

        yield* Stream.runForEach(stream, speed_ms =>
            Effect.gen(function* () {
                const fiber_current = yield* Ref.get(fiber_ref)
                if (fiber_current) {    
                    yield* Fiber.interrupt(fiber_current)
                }

                const fiber_new = yield* start_fiber(speed_ms)
                yield* Ref.set(fiber_ref, fiber_new)
            })
        )

        const fiber_final = yield* Ref.get(fiber_ref)

        if (fiber_final) {
            yield* fiber_final
        }
    })
