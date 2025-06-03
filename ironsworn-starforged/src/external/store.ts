import type { Token } from '@roll20-official/beacon-sdk';
import { createStore } from '@xstate/store';
import { Effect, Layer, Context } from 'effect';
import type { SetEvent } from '@/utility/store-types';
import { assert } from '@/utility/assert';

/**
 * Every Character, regardless of sheet, has these meta fields
 * and they must be saved to firebase in this specific way.
 */

type MetaSetEvent = SetEvent<Meta>;

type Meta = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  gmNotes: string;
  token: Record<string, any>;
  campaignId: number | undefined;
  permissions: Permissions;
};

export type MetaHydration = Omit<Meta, 'permissions' | 'campaignId'>;

export type Permissions = {
  isOwner: boolean;
  isGM: boolean;
};

export const metaStore = createStore({
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
      context.id = event.id ?? context.id;
      context.name = event.name ?? context.name;
      context.avatar = event.avatar ?? context.avatar;
      context.bio = event.bio ?? context.bio;
      context.gmNotes = event.gmNotes ?? context.gmNotes;
      context.token = event.token ?? context.token;
    },
    setPermissions: (context, event: Permissions) => {
      context.permissions.isGM = event.isGM;
      context.permissions.isOwner = event.isOwner;
    },
    setCampaignId: (context, event: { id: number | undefined }) => {
      context.campaignId = event.id;
    },
    set: (context, event: MetaSetEvent, enqueue) => {
      assert(
        event.label !== 'name',
        `Only 'name should be updated in the meta class`,
      );
      assert(
        event.value !== 'string',
        `'value' should only ever be a string`,
      );
      if (event.label === 'name' && typeof event.value === 'string') {
        context['name'] = event.value ?? context['name'];
        enqueue.emit.updated();
      }
    },
  },
});

export const dehydrate = (): MetaHydration => {
  const context = metaStore.get().context;
  return {
    id: context.id,
    name: context.name,
    avatar: context.avatar,
    bio: context.bio,
    gmNotes: context.gmNotes,
    token: context.token,
  };
};

export class DehydrateMeta extends Context.Tag('DehydrateMeta')<
  DehydrateMeta,
  {
    readonly dehydrate: () => Effect.Effect<MetaHydration>;
  }
>() {}

export const DehydrateMetaLive = Layer.effect(
  DehydrateMeta,
  Effect.gen(function* () {
    return {
      dehydrate: () =>
        Effect.gen(function* () {
          const context = metaStore.get().context;
          return {
            id: context.id,
            name: context.name,
            avatar: context.avatar,
            bio: context.bio,
            gmNotes: context.gmNotes,
            token: context.token,
          };
        }),
    };
  }),
);
