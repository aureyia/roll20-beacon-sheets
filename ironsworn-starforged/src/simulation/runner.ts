import { Effect, Ref as EffectRef, Fiber, Queue, Stream, SubscriptionRef } from 'effect'
import { type Ref as VueRef, watch } from 'vue'
import { simulation_process } from './simulator'

export const start_simulator = (roll_speed: VueRef) =>
    Effect.gen(function* () {
        const queue = yield* Queue.bounded<number>(20)
        const fiber_ref = yield* SubscriptionRef.make<Fiber.RuntimeFiber<
            // biome-ignore lint: Intentional any
            any,
            // biome-ignore lint: Intentional any
            any
        > | null>(null)

        const start_fiber = (speed_ms: number) => Effect.fork(simulation_process(speed_ms))

        const fiber_initial = yield* start_fiber(roll_speed.value[0])
        yield* EffectRef.set(fiber_ref, fiber_initial)

        watch(roll_speed, speed_ms => {
            Effect.runPromise(Queue.offer(queue, speed_ms[0]))
        })

        const stream = Stream.fromQueue(queue).pipe(Stream.debounce('3000 millis'))

        yield* Stream.runForEach(stream, speed_ms =>
            Effect.gen(function* () {
                const fiber_current = yield* EffectRef.get(fiber_ref)
                if (fiber_current) {
                    yield* Fiber.interrupt(fiber_current)
                }

                const fiber_new = yield* start_fiber(speed_ms)
                yield* EffectRef.set(fiber_ref, fiber_new)
            })
        )

        const fiber_final = yield* EffectRef.get(fiber_ref)

        if (fiber_final) {
            yield* fiber_final
        }
    })
