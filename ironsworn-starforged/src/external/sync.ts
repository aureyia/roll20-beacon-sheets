import { createId } from '@paralleldrive/cuid2'
import type {
    Character,
    CompendiumDragDropData,
    Dispatch,
    Settings,
    UpdateArgs,
} from '@roll20-official/beacon-sdk'
import { Effect, Layer } from 'effect'
import { type App, reactive, ref } from 'vue'
import type { ActorRefFrom } from 'xstate'
import { assertEvent, createActor, setup } from 'xstate'
import { live_dehydrate_meta } from '@/external/store'
import { live_dehydrate_assets } from '@/system/assets/store'
import { live_dehydrate_character } from '@/system/character.store'
import { live_dehydrate_impacts } from '@/system/impacts/store'
import { live_dehydrate_momentum } from '@/system/momentum/store'
import { live_dehydrate_resources } from '@/system/resources.store'
import { live_dehydrate_settings } from '@/system/settings.store'
import { live_dehydrate_stats } from '@/system/stats.store'
import { live_dehydrate_tasks } from '@/system/tasks/store'
import { Dehydration, live_dehydration } from './services/dehydration'
import { Hydration, live_hydration } from './services/hydration'
import { store_meta } from './store'

export const beaconPulse = ref(0)

export type InitValues = {
    id: string
    character: Character
    settings: Settings
    compendiumDrop: CompendiumDragDropData | null
}

export const sheet_init_values: InitValues = reactive({
    id: '',
    character: {
        attributes: {},
    } as Character,
    settings: {} as Settings,
    compendiumDrop: null,
})

const live_dehydration_services = Layer.mergeAll(
    live_dehydrate_meta,
    live_dehydrate_character,
    live_dehydrate_assets,
    live_dehydrate_stats,
    live_dehydrate_resources,
    live_dehydrate_momentum,
    live_dehydrate_impacts,
    live_dehydrate_settings,
    live_dehydrate_tasks
)

const MainLive = live_dehydration.pipe(Layer.provide(live_dehydration_services))

// biome-ignore lint: Intentional any
const update = (dispatch: Dispatch, data: any) =>
    Effect.gen(function* () {
        const dehydration = yield* Dehydration

        const character = yield* dehydration.dehydrate_stores()
        character.character.attributes.updateId = createId()

        dispatch.updateCharacter(character as UpdateArgs)
    }).pipe(Effect.provide(MainLive))

export type SyncActor = ActorRefFrom<typeof machine>
export const machine = setup({
    types: {
        context: {} as {
            // biome-ignore lint: Intentional any
            character: any
            dispatch?: Dispatch
            updateId: string
        },
        events: {} as
            | { type: 'initialised'; dispatch: Dispatch }
            | { type: 'update' }
            | { type: 'synced' }
            | { type: 'hydrated' },
    },
    actions: {
        saveDispatchToContext: ({ context, event }) => {
            assertEvent(event, 'initialised')
            context.dispatch = event.dispatch
        },
    },
}).createMachine({
    context: {
        character: {
            id: '',
            character: {
                attributes: {},
            } as Character,
            settings: {} as Settings,
            compendiumDrop: null,
        },
        updateId: '',
    },
    id: 'Syncing',
    initial: 'initialising',
    states: {
        initialising: {
            on: {
                initialised: {
                    target: 'hydrating',
                    actions: {
                        type: 'saveDispatchToContext',
                    },
                },
            },
        },
        hydrating: {
            on: {
                update: {
                    target: 'syncing',
                },
            },
        },
        syncing: {
            on: {
                synced: {
                    target: 'hydrating',
                },
            },
        },
    },
})

export const sync = createActor(machine)
export const plugin_sync = (dispatch: Dispatch) => {
    sync.subscribe(async snapshot => {
        if (snapshot.value === 'initialising') {
            console.log('Sync: Initialising')
            store_meta.send({
                type: 'set_campaign_id',
                id: sheet_init_values.settings.campaignId,
            })

            store_meta.send({
                type: 'set_permissions',
                isOwner: sheet_init_values.settings.owned,
                isGM: sheet_init_values.settings.gm,
            })

            sync.send({
                type: 'initialised',
                dispatch: dispatch,
            })
        }

        if (snapshot.value === 'hydrating') {
            console.log('Sync: Hydrating')
            const id_character = sheet_init_values.character.id
            const char_saved = dispatch.characters[id_character]

            const { attributes } = char_saved
            const { ...profile } = char_saved

            await Effect.runPromise(
                Effect.gen(function* () {
                    const hydration = yield* Hydration
                    return hydration.hydrateStores(attributes, profile)
                }).pipe(Effect.provide(live_hydration))
            )
        }

        if (snapshot.value === 'syncing') {
            console.log('Sync: Syncing')
            await Effect.runPromise(update(dispatch, 'nom'))
            sync.send({
                type: 'synced',
            })
        }
    })

    sync.start()

    return {
        install(app: App) {
            app.provide('sync', sync)
        },
    }
}
