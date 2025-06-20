import { Effect } from 'effect'
import type { Intensity } from '@/simulation/types'
import { store_assets } from '@/system/assets/store'
import { store_impacts } from '@/system/impacts/store'
import { store_momentum } from '@/system/momentum/store'
import { store_stats } from '@/system/stats.store'
import { store_tasks } from '@/system/tasks/store'
import { assets, impacts, resources, stats, tasks } from './fuzzers/stores'
import { number_between } from './prng'
import { save_snapshot } from './storage/snapshots'

export const setupStores = (seed: string, intensity: typeof Intensity) =>
    Effect.sync(() => {
        // Clear Stores

        store_impacts.trigger.clear()
        store_tasks.trigger.clear()
        store_assets.trigger.clear()

        // Momentum

        const selectedMomentum = Effect.runSync(number_between(seed, 'momentum', -6, 10))
        store_momentum.trigger.set({ value: selectedMomentum })

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
            store_stats.trigger.set(entry)
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
            store_stats.trigger.set(entry)
        }

        // Impacts

        const impactList = ['misfortunes', 'lasting_effects', 'burdens', 'current_vehicle', 'other']

        const selectedImpacts = impactList.map(category => {
            return {
                label: category,
                // @ts-ignore
                value: impacts(seed, intensity)[category],
            }
        })

        for (const entry of selectedImpacts) {
            // @ts-ignore
            store_impacts.trigger.set(entry)
        }

        // Assets

        const selectedAssets = assets(seed, intensity)
        // @ts-ignore
        store_assets.trigger.set({ label: 'list', value: selectedAssets })

        // Tasks

        const selectedTasks = tasks(seed, intensity)
        // @ts-ignore
        store_tasks.trigger.set({ label: 'list', value: selectedTasks })

        Effect.runPromise(
            save_snapshot('stores', {
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
