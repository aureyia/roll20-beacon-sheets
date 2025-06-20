import { Effect, Fiber, Queue, Ref, Stream, SubscriptionRef } from 'effect'
import { type Ref as VueRef, watch } from 'vue'
import { simRunner } from './simulator'

export const runner = (rollSpeed: VueRef) =>
    Effect.gen(function* () {
        const queue = yield* Queue.bounded<number>(20)
        const fiber_ref = yield* SubscriptionRef.make<Fiber.RuntimeFiber<
            // biome-ignore lint: Intentional any
            any,
            // biome-ignore lint: Intentional any
            any
        > | null>(null)

        const startFiber = (speed_ms: number) => Effect.fork(simRunner(speed_ms))

        const initial_fiber = yield* startFiber(rollSpeed.value[0])
        yield* Ref.set(fiber_ref, initial_fiber)

        watch(rollSpeed, speed_ms => {
            Effect.runPromise(Queue.offer(queue, speed_ms[0]))
        })

        const stream = Stream.fromQueue(queue).pipe(Stream.debounce('3000 millis'))

        yield* Stream.runForEach(stream, speed =>
            Effect.gen(function* () {
                const currentFiber = yield* Ref.get(fiber_ref)
                if (currentFiber) {
                    yield* Fiber.interrupt(currentFiber)
                }

                const newFiber = yield* startFiber(speed)
                yield* Ref.set(fiber_ref, newFiber)
            })
        )

        const finalFiber = yield* Ref.get(fiber_ref)

        if (finalFiber) {
            yield* finalFiber
        }
    })
