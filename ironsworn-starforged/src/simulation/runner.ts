import { Effect, Fiber, Queue, Stream, Ref, SubscriptionRef } from 'effect';
import { watch, type Ref as VueRef } from 'vue';
import { simRunner } from './simulator';

export const runner = (rollSpeed: VueRef) =>
  Effect.gen(function* () {
    const queue = yield* Queue.bounded<number>(20);
    const fiberRef = yield* SubscriptionRef.make<Fiber.RuntimeFiber<
      any,
      any
    > | null>(null);

    const startFiber = (speed: number) => Effect.fork(simRunner(speed));

    const initialFiber = yield* startFiber(rollSpeed.value[0]);
    yield* Ref.set(fiberRef, initialFiber);

    watch(rollSpeed, (newSpeed) => {
      Effect.runPromise(Queue.offer(queue, newSpeed[0]));
    });

    const stream = Stream.fromQueue(queue).pipe(Stream.debounce('3000 millis'));

    yield* Stream.runForEach(stream, (speed) =>
      Effect.gen(function* () {
        const currentFiber = yield* Ref.get(fiberRef);
        if (currentFiber) {
          yield* Fiber.interrupt(currentFiber);
        }

        const newFiber = yield* startFiber(speed);
        yield* Ref.set(fiberRef, newFiber);
      }),
    );

    const finalFiber = yield* Ref.get(fiberRef);

    if (finalFiber) {
      yield* finalFiber;
    }
  });
