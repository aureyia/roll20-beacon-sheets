import type { Dispatch } from '@roll20-official/beacon-sdk'
import { rollResults as rollResultsLow } from './fuzzers/roll-results/roll-results-low'
import { rollResults as rollResultsMedium } from './fuzzers/roll-results/roll-results-medium'
import { rollResults as rollResultsHigh } from './fuzzers/roll-results/roll-results-high'
import { ref } from 'vue'
import { createAtom } from '@xstate/store'
import { createId } from '@paralleldrive/cuid2'
import { seed } from './generate-rolls'
import { intensity, postRef } from '@/main'

const character = createAtom({
    id: '-ORfR02B4KDjtJ6bwU_p',
    name: 'Aureyia',
    avatar: '',
    attributes: {
        character: {
            callsign: 'Swifty',
            pronouns: 'She/Her',
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
})

const getCharacter = () => {
    if (intensity.value === 'high') {
        return character.get()
    } else if (intensity.value === 'medium') {
        return character.get()
    } else {
        return character.get()
    }
}

export const simRelay = async (relayConfig: any) => {
    relayConfig.handlers.onInit({ character: character.get(), settings: {} })
    return {
        update: (...args: any[]) => console.log('devRelay update', args),
        updateCharacter: (...args: any[]) => {
            character.set(args[0].character)
        },
        characters: {
            get ['-ORfR02B4KDjtJ6bwU_p']() {
                return character.get()
            },
        },
        updateTokensByCharacter: () => '',
        updateSharedSettings: async (update: any) => await {},
        roll: async (roll: any) => {
            if (intensity.value === 'high') {
                return await rollResultsHigh(seed.get())
            } else if (intensity.value === 'medium') {
                return await rollResultsMedium(seed.get())
            } else {
                return await rollResultsLow(seed.get())
            }
        },
        post: async (args: any) => (postRef.value = args),
    } as any as Dispatch
}
