import type { Token } from '@roll20-official/beacon-sdk'
import { createStore } from '@xstate/store'
import { Context, Effect, Layer } from 'effect'
import { assert } from '@/utility/assert'

/**
 * Every Character, regardless of sheet, has these meta fields
 * and they must be saved to firebase in this specific way.
 */

type MetaSetEvent = SetEvent<Meta>

type Meta = {
    id: string
    name: string
    avatar: string
    bio: string
    gmNotes: string
    // biome-ignore lint: Intentional any
    token: Record<string, any>
    campaignId: number | undefined
    permissions: Permissions
}

export type MetaHydration = Omit<Meta, 'permissions' | 'campaignId'>

export type Permissions = {
    isOwner: boolean
    isGM: boolean
}

export const store_meta = createStore({
    context: {
        id: '',
        name: '',
        avatar: '',
        bio: '',
        gmNotes: '',
        token: {} as Token,
        campaignId: undefined as number | undefined,
        permissions: {
            isOwner: false,
            isGM: false,
        },
    },
    emits: {
        updated: () => {},
    },
    on: {
        hydrate: (context, event: MetaHydration) => {
            context.id = event.id ?? context.id
            context.name = event.name ?? context.name
            context.avatar = event.avatar ?? context.avatar
            context.bio = event.bio ?? context.bio
            context.gmNotes = event.gmNotes ?? context.gmNotes
            context.token = event.token ?? context.token
        },
        set_permissions: (context, event: Permissions) => {
            context.permissions.isGM = event.isGM
            context.permissions.isOwner = event.isOwner
        },
        set_campaign_id: (context, event: { id: number | undefined }) => {
            context.campaignId = event.id
        },
        set: (context, event: MetaSetEvent, enqueue) => {
            assert(event.label === 'name')
            assert(typeof event.value === 'string')
            if (event.label === 'name' && typeof event.value === 'string') {
                context.name = event.value ?? context.name
                enqueue.emit.updated()
            }
        },
    },
})

export const dehydrate = (): MetaHydration => {
    const context = store_meta.get().context
    return {
        id: context.id,
        name: context.name,
        avatar: context.avatar,
        bio: context.bio,
        gmNotes: context.gmNotes,
        token: context.token,
    }
}

export class DehydrateMeta extends Context.Tag('DehydrateMeta')<
    DehydrateMeta,
    {
        readonly dehydrate: () => Effect.Effect<MetaHydration>
    }
>() {}

export const live_dehydrate_meta = Layer.effect(
    DehydrateMeta,
    Effect.gen(function* () {
        return {
            dehydrate: () =>
                Effect.gen(function* () {
                    const context = store_meta.get().context
                    return yield* Effect.succeed({
                        id: context.id,
                        name: context.name,
                        avatar: context.avatar,
                        bio: context.bio,
                        gmNotes: context.gmNotes,
                        token: context.token,
                    })
                }),
        }
    })
)
