import { Effect } from 'effect'
import {
  onInit,
  onChange,
  onSettingsChange,
  onSharedSettingsChange,
  onTranslationsRequest,
  onDragOver,
} from '@/external/relay-handlers'
import { initRelay, type Dispatch } from '@roll20-official/beacon-sdk'
import { shallowRef, type App } from 'vue'

export const dispatchRef = shallowRef()
export const relayConfig = {
  handlers: {
    onInit,
    onChange,
    onSettingsChange,
    onSharedSettingsChange,
    onTranslationsRequest,
    onDragOver,
  },
}

const devRelay = async () =>
  ({
    // biome-ignore lint: Intentional any
    update: (...args: any[]) => console.log('devRelay update', args),
    // biome-ignore lint: Intentional any
    updateCharacter: (...args: any[]) =>
      console.log('devRelay updateCharacter', args),
    characters: {},
    // biome-ignore lint: Intentional any
  }) as any as Dispatch

export const sheetRelayPlugin = (mode: boolean) =>
  Effect.gen(function* () {
    console.log('relayConfig', relayConfig)
    const dispatch = yield* Effect.promise(async () => {
      if (mode) {
        return devRelay()
      }
      // @ts-ignore
      return initRelay(relayConfig)
    })

    dispatchRef.value = dispatch
    console.log('dispatchRef.value', dispatchRef.value)

    const sheetRelay = {
      install(app: App) {
        app.provide('dispatch', dispatch)
      },
    }

    return {
      sheetRelay,
      dispatch,
    }
  })
