import { type Dispatch, initRelay } from '@roll20-official/beacon-sdk'
import { Effect } from 'effect'
import { type App, shallowRef } from 'vue'
import {
    onChange,
    onDragOver,
    onInit,
    onSettingsChange,
    onSharedSettingsChange,
    onTranslationsRequest,
} from '@/external/relay_handlers'

export const ref_dispatch = shallowRef()
export const config_relay = {
    handlers: {
        onInit,
        onChange,
        onSettingsChange,
        onSharedSettingsChange,
        onTranslationsRequest,
        onDragOver,
    },
}

const relay_dev = async () =>
    ({
        // biome-ignore lint: Intentional any
        update: (...args: any[]) => console.log('relay_dev update', args),
        // biome-ignore lint: Intentional any
        updateCharacter: (...args: any[]) => console.log('relay_dev updateCharacter', args),
        characters: {},
        // biome-ignore lint: Intentional any
    }) as any as Dispatch

export const plugin_sheet_relay = (mode: boolean) =>
    Effect.gen(function* () {
        console.log('config_relay', config_relay)
        const dispatch = yield* Effect.promise(async () => {
            if (mode) {
                return relay_dev()
            }
            // @ts-ignore
            return initRelay(config_relay)
        })

        ref_dispatch.value = dispatch
        console.log('ref_dispatch.value', ref_dispatch.value)

        const relay_sheet = {
            install(app: App) {
                app.provide('dispatch', dispatch)
            },
        }

        return {
            relay_sheet,
            dispatch,
        }
    })
