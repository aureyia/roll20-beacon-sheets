import { Effect, Stream } from 'effect';
import {
  onInit,
  onChange,
  onSettingsChange,
  onSharedSettingsChange,
  onTranslationsRequest,
  onDragOver,
} from '@/external/relay-handlers';
import { type App } from 'vue';
import { dispatchRef } from '@/external/vue.relay';
import { simRelay } from './dispatch.mock';
import { rollSteam } from './generate-rolls';

export const relayConfig = {
  handlers: {
    onInit,
    onChange,
    onSettingsChange,
    onSharedSettingsChange,
    onTranslationsRequest,
    onDragOver,
  },
};

export const simRelayPlugin = () =>
  Effect.gen(function* () {
    const dispatch = yield* Effect.promise(() => simRelay(relayConfig));

    dispatchRef.value = dispatch;

    const sheetRelay = {
      install(app: App) {
        app.provide('dispatch', dispatch);
      },
    };

    return {
      sheetRelay,
      dispatch,
    };
  });

export const simRunner = Effect.gen(function* () {
  yield* Effect.sleep('5 seconds');
  yield* Stream.runDrain(rollSteam);
});
