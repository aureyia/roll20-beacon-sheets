import type { Token } from '@roll20-official/beacon-sdk';
import { createStore } from '@xstate/store';
import { sync } from './sync';

/* Every Character, regardless of sheet, has these meta fields
 * and they must be saved to firebase in this specific way.
 * This store can be reused as-is for any other Vue project.
 * */
export type MetaHydrate = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  gmNotes: string;
  token: Record<string, any>;
};

export type MetaDehydrate = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  gmNotes: string;
  token: Record<string, any>;
};

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
  on: {
    hydrate: (context, event: MetaHydrate) => {
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
      sync.send({ type: 'update' });
    },
    setCampaignId: (context, event: { id: number | undefined }) => {
      context.campaignId = event.id;
      sync.send({ type: 'update' });
    },
  },
});

export const dehydrate = (): MetaDehydrate => {
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
