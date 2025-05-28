import { Effect } from 'effect';
import {
  onInit,
  onChange,
  onSettingsChange,
  onSharedSettingsChange,
  onTranslationsRequest,
  onDragOver,
} from '@/external/relay-handlers';
import { initRelay } from '@roll20-official/beacon-sdk';
import { shallowRef, type App } from 'vue';

export const dispatchRef = shallowRef();
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

export const getVueRelay = () =>
  Effect.gen(function* () {
    const dispatch = yield* Effect.promise(
      // @ts-ignore
      // relayConfig is Beacon implementation, so can't be resolved
      () => initRelay(relayConfig),
    );

    dispatchRef.value = dispatch;

    const vueRelay = {
      install(app: App) {
        app.provide('dispatch', dispatch);
      },
    };

    return {
      vueRelay,
      dispatch,
    };
  });
