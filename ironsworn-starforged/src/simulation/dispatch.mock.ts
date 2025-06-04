import type { Dispatch } from '@roll20-official/beacon-sdk';
import { rollResults } from './roll-results';
import { ref } from 'vue';

export const postRef = ref();

const character = {
  id: '-ORfR02B4KDjtJ6bwU_p',
  name: 'Iirkupi Obroh',
  avatar: '',
  attributes: {
    character: {
      callsign: 'klsdjfkl;dsjflk;sdjfkl;',
      pronouns: 'sd',
    },
    assets: {},
    stats: {
      edge: 2,
      heart: 2,
      iron: 3,
      shadow: 1,
      wits: 1,
    },
    resources: {
      health: 5,
      spentXp: 0,
      spirit: 5,
      supply: 5,
      xp: 3,
    },
    momentum: {
      momentum: 5,
    },
    impacts: {
      misfortunes: {},
      lastingEffects: {},
      burdens: {},
      currentVehicle: {},
      other: {},
    },
    settings: {
      darkMode: 'unset',
      mode: 'character-standard',
    },
    tasks: {},
    updateId: 'rszqyfky9nfp9ufqgewhjk1n',
  },
  bio: null,
  gmNotes: null,
  token: {
    name: 'Iirkupi Obroh',
    represents: '-ORfR02B4KDjtJ6bwU_p',
    imgsrc: '/images/character.png',
    width: 70,
    height: 70,
    layer: 'objects',
  },
};

export const simRelay = async (relayConfig: any) => {
  relayConfig.handlers.onInit({ character, settings: {} });
  return {
    update: (...args: any[]) => console.log('devRelay update', args),
    updateCharacter: (...args: any[]) =>
      console.log('devRelay updateCharacter', args),
    characters: {
      '-ORfR02B4KDjtJ6bwU_p': character,
    },
    updateTokensByCharacter: () => '',
    updateSharedSettings: async (update: any) => await {},
    roll: async (roll: any) => await rollResults,
    post: async (args: any) => (postRef.value = args),
  } as any as Dispatch;
};
