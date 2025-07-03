import { Effect } from 'effect'
import type { Intensity } from '@/simulation/types'
import { store_assets } from '@/system/assets_store'
import { store_impacts } from '@/system/impacts_store'
import { store_momentum } from '@/system/momentum_store'
import { store_stats } from '@/system/stats.store'
import { store_tasks } from '@/system/tasks_store'
import { assets, impacts, resources, stats, tasks } from './fuzzers/fuzzer_stores'
import { number_between } from './prng'
import { save_snapshot } from './storage/snapshots'

export const setup_stores = (seed: string, intensity: Intensity) =>
    Effect.sync(() => {
        // Clear Stores

        store_impacts.trigger.clear()
        store_tasks.trigger.clear()
        store_assets.trigger.clear()

        // Momentum

        const selected_momentum = Effect.runSync(number_between(seed, 'momentum', -6, 10))
        store_momentum.trigger.set({ value: selected_momentum })

        // Stats

        const stat_list = ['edge', 'heart', 'iron', 'shadow', 'wits']
        const stats_selected = stat_list.map(stat => {
            return {
                label: stat,
                // @ts-ignore
                value: stats(seed, intensity)[stat],
            }
        })

        for (const entry of stats_selected) {
            // @ts-ignore
            store_stats.trigger.set(entry)
        }

        // Resources

        const resource_list = ['health', 'spirit', 'supply', 'xp']
        const resource_selected = resource_list.map(resource => {
            return {
                label: resource,
                // @ts-ignore
                value: resources(seed, intensity)[resource],
            }
        })

        for (const entry of resource_selected) {
            // @ts-ignore
            store_stats.trigger.set(entry)
        }

        // Impacts

        const impact_list = ['misfortunes', 'lasting_effects', 'burdens', 'current_vehicle', 'other']
        const impact_selected = impact_list.map(category => {
            return {
                label: category,
                // @ts-ignore
                value: impacts(seed, intensity)[category],
            }
        })

        for (const entry of impact_selected) {
            // @ts-ignore
            store_impacts.trigger.set(entry)
        }

        // Assets

        const assets_selected = assets(seed, intensity)
        // @ts-ignore
        store_assets.trigger.set({ label: 'list', value: assets_selected })

        // Tasks

        const tasks_selected = tasks(seed, intensity)
        // @ts-ignore
        store_tasks.trigger.set({ label: 'list', value: tasks_selected })

        Effect.runPromise(
            save_snapshot('stores', {
                run_id: seed,
                momentum: selected_momentum,
                stats: stats_selected,
                resources: resource_selected,
                impacts: impact_selected,
                tasks: tasks_selected,
                assets: assets_selected,
            })
        )
    })
