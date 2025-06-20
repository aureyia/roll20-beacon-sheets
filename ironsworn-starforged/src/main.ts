import { DevTools } from '@effect/experimental'
import { BrowserRuntime, BrowserSocket } from '@effect/platform-browser'
import { Effect, Layer } from 'effect'

import { createApp, ref, type Ref as VueRef } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'

import { relay_store } from './external/store.relay'
import { plugin_sync } from './external/sync'
import { plugin_sheet_relay } from './external/vue.relay'

import router from './router'

import './sheet/css/index.css'
import './sheet/scss/index.scss'

import { runner } from './simulation/runner'
import { plugin_relay_sim } from './simulation/simulator'
import { INTENSITY } from './simulation/types'

// @ts-ignore
const env = import.meta.env.MODE || ''
// Determines if the offline mode dev relay should be used
const is_dev_environment = ['development', 'test'].includes(env)
export const is_sim_environment = env === 'simulation'
export const roll_speed_ms = ref([2000])
export const ref_intensity = ref(INTENSITY.Low) as VueRef<ObjectValues<typeof INTENSITY>>
export const postRef = ref()

const main = Effect.promise(async () => {
    const i18n = createI18n({})
    const app = createApp(App)

    const { relay_sheet, dispatch } = await Effect.runPromise(
        is_sim_environment ? plugin_relay_sim() : plugin_sheet_relay(is_dev_environment)
    )

    const sync = plugin_sync(dispatch)

    app.use(router)
    app.use(i18n)
    app.use(sync)
    app.use(relay_sheet)

    Effect.runPromise(relay_store)

    if (is_sim_environment) {
        Effect.runPromise(runner(roll_speed_ms))
    }

    app.mount('#app')
})

const live_dev_tools = DevTools.layerWebSocket().pipe(
    Layer.provide(BrowserSocket.layerWebSocketConstructor)
)

// BrowserRuntime.runMain(main)

main.pipe(Effect.provide(live_dev_tools), BrowserRuntime.runMain)
