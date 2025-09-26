import { DevTools } from '@effect/experimental'
import { BrowserRuntime, BrowserSocket } from '@effect/platform-browser'
import { Effect, Layer } from 'effect'

import { createApp, ref, type Ref as VueRef } from 'vue'
import { createI18n } from 'vue-i18n'

// @ts-ignore | Can't find module
import App from '@/App.vue'

import { relay_store } from './external/store.relay'
import { plugin_sync } from './external/sync'
import { plugin_sheet_relay } from './external/vue.relay'

import router from './router'

import './sheet/css/index.css'
import './sheet/scss/index.scss'

import type { Dispatch } from '@roll20-official/beacon-sdk'
// import { start_simulator } from './simulation/runner'
// import { plugin_relay_sim } from './simulation/simulator'
import { INTENSITY } from './simulation/types'

// @ts-ignore
const env = import.meta.env.MODE || ''
// Determines if the offline mode dev relay should be used
const dev_environment_enabled = ['development', 'test'].includes(env)
export const sim_environment_enabled = env === 'simulation'
export const roll_speed_ms = ref([2000])
export const intensity_ref = ref(INTENSITY.Low) as VueRef<ObjectValues<typeof INTENSITY>>
export const post_ref = ref()

const main = Effect.promise(async () => {
    const i18n = createI18n({})
    const app = createApp(App)

    // biome-ignore lint: Intentional any
    let relay_live: any
    let dispatch_live: Dispatch

    if (sim_environment_enabled) {
        const { plugin_relay_sim } = await import('./simulation/simulator')
        const { relay_sheet, dispatch } = await Effect.runPromise(plugin_relay_sim())

        relay_live = relay_sheet
        dispatch_live = dispatch
    } else {
        const { relay_sheet, dispatch } = await Effect.runPromise(
            plugin_sheet_relay(dev_environment_enabled)
        )

        relay_live = relay_sheet
        dispatch_live = dispatch
    }

    const sync = plugin_sync(dispatch_live)

    app.use(router)
    app.use(i18n)
    app.use(sync)
    app.use(relay_live)

    Effect.runPromise(relay_store)

    if (sim_environment_enabled) {
        const { start_simulator } = await import('./simulation/runner')
        Effect.runPromise(start_simulator(roll_speed_ms))

        const { StandardSimView } = await import('@/views/simulation/character')
        router.addRoute('character-standard', {
            path: '/simulation',
            name: 'characterStandardSimulation',
            component: StandardSimView,
            alias: '/character-simulation',
        })
    }

    app.mount('#app')
})

const live_dev_tools = DevTools.layerWebSocket().pipe(
    Layer.provide(BrowserSocket.layerWebSocketConstructor)
)

main.pipe(Effect.provide(live_dev_tools), BrowserRuntime.runMain)
