import { DevTools } from '@effect/experimental'
import { BrowserRuntime, BrowserSocket } from '@effect/platform-browser'
import { Effect, Layer } from 'effect'

import { createApp, ref, type Ref as VueRef } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'

import { storeRelay } from './external/store.relay'
import { syncPlugin } from './external/sync'
import { sheetRelayPlugin } from './external/vue.relay'

import router from './router'

import './sheet/css/index.css'
import './sheet/scss/index.scss'

import { runner } from './simulation/runner'
import { simRelayPlugin } from './simulation/simulator'
import { Intensity } from './simulation/types'

// @ts-ignore
const env = import.meta.env.MODE || ''
// Determines if the offline mode dev relay should be used
const isDevEnvironment = ['development', 'test'].includes(env)
export const isSimEnvironment = env === 'simulation'
export const rollSpeed = ref([2000])
export const intensity = ref(Intensity.Low) as VueRef<
    ObjectValues<typeof Intensity>
>
export const postRef = ref()

const main = Effect.promise(async () => {
    const i18n = createI18n({})
    const app = createApp(App)

    const { sheetRelay, dispatch } = await Effect.runPromise(
        isSimEnvironment ? simRelayPlugin() : sheetRelayPlugin(isDevEnvironment)
    )

    const sync = syncPlugin(dispatch)

    app.use(router)
    app.use(i18n)
    app.use(sync)
    app.use(sheetRelay)

    Effect.runPromise(storeRelay)

    if (isSimEnvironment) {
        Effect.runPromise(runner(rollSpeed))
    }

    app.mount('#app')
})

const DevToolsLive = DevTools.layerWebSocket().pipe(
    Layer.provide(BrowserSocket.layerWebSocketConstructor)
)

// BrowserRuntime.runMain(main)

main.pipe(Effect.provide(DevToolsLive), BrowserRuntime.runMain)
