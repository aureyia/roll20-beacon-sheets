import { Effect, Stream } from 'effect'
import type { App } from 'vue'
import {
    onChange,
    onDragOver,
    onInit,
    onSettingsChange,
    onSharedSettingsChange,
    onTranslationsRequest,
} from '@/external/relay_handlers'
import { dispatch_ref } from '@/external/vue.relay'
import { relay_sim } from './dispatch.mock'
import { start_roll_stream } from './generate_rolls'

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

export const plugin_relay_sim = () =>
    Effect.gen(function* () {
        const dispatch = yield* Effect.promise(() => relay_sim(config_relay))

        dispatch_ref.value = dispatch

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

export const simulation_process = (speed_ms: number) =>
    Effect.gen(function* () {
        yield* Effect.sleep('1 seconds')
        yield* Stream.runDrain(start_roll_stream(speed_ms))
    })
