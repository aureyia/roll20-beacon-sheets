import { Effect } from 'effect'
import { impactsStore } from '@/system/impacts/store'
import { tasksStore } from '@/system/tasks/store'
import { assetsStore } from '@/system/assets/store'
import { resources, stats, impacts, assets, tasks } from './fuzzers/stores'
import { statsStore } from '@/system/stats.store'
import { numberBetween } from './prng'
import { momentumStore } from '@/system/momentum/store'
import { saveSnapshot } from './storage/snapshots'
import type { Intensity } from '@/simulation/types'

export const setupStores = (seed: string, intensity: typeof Intensity) =>
  Effect.sync(() => {
    // Clear Stores

    impactsStore.trigger.clear()
    tasksStore.trigger.clear()
    assetsStore.trigger.clear()

    // Momentum

    const selectedMomentum = Effect.runSync(
      numberBetween(seed, 'momentum', -6, 10)
    )
    momentumStore.trigger.set({ value: selectedMomentum })

    // Stats

    const statList = ['edge', 'heart', 'iron', 'shadow', 'wits']
    const selectedStats = statList.map(stat => {
      return {
        label: stat,
        // @ts-ignore
        value: stats(seed, intensity)[stat],
      }
    })

    for (const entry of selectedStats) {
      // @ts-ignore
      statsStore.trigger.set(entry)
    }

    // Resources

    const resourceList = ['health', 'spirit', 'supply', 'xp']
    const selectedResources = resourceList.map(resource => {
      return {
        label: resource,
        // @ts-ignore
        value: resources(seed, intensity)[resource],
      }
    })

    for (const entry of selectedResources) {
      // @ts-ignore
      statsStore.trigger.set(entry)
    }

    // Impacts

    const impactList = [
      'misfortunes',
      'lastingEffects',
      'burdens',
      'currentVehicle',
      'other',
    ]

    const selectedImpacts = impactList.map(category => {
      return {
        label: category,
        // @ts-ignore
        value: impacts(seed, intensity)[category],
      }
    })

    for (const entry of selectedImpacts) {
      // @ts-ignore
      impactsStore.trigger.set(entry)
    }

    // Assets

    const selectedAssets = assets(seed, intensity)
    // @ts-ignore
    assetsStore.trigger.set({ label: 'list', value: selectedAssets })

    // Tasks

    const selectedTasks = tasks(seed, intensity)
    // @ts-ignore
    tasksStore.trigger.set({ label: 'list', value: selectedTasks })

    Effect.runPromise(
      saveSnapshot('stores', {
        run_id: seed,
        momentum: selectedMomentum,
        stats: selectedStats,
        resources: selectedResources,
        impacts: selectedImpacts,
        tasks: selectedTasks,
        assets: selectedAssets,
      })
    )
  })
