import fs from 'node:fs'
import { starforged } from '../../vendor/dataforged/dist/index-esm.mjs'

const all_oracles = starforged['Oracle Categories']
const oracle_render = []
const oracle_ranges = {}

const format_name = name => name.toLowerCase().replaceAll(' ', '_')
const create_oracle = (categoryKey, oracle, prefix = null) => {
    const name_formatted = format_name(oracle.Name)
    const key_oracle = prefix ? `${prefix}_${name_formatted}` : name_formatted
    oracle_ranges[key_oracle] = {}
    let index_selected_category = 0

    for (const [index, category] of oracle_render.entries()) {
        if (category.id === categoryKey) {
            index_selected_category = index
        }
    }

    const skeleton_oracle = { id: key_oracle, rows: [] }
    for (const entry of oracle.Table) {
        const key_entry = `${entry.Floor}_to_${entry.Ceiling}`

        skeleton_oracle.rows.push({
            id: key_entry,
            min: entry.Floor,
            max: entry.Ceiling,
        })

        for (let i = entry.Floor; i <= entry.Ceiling; i++) {
            oracle_ranges[key_oracle][i] = `${key_oracle}_${key_entry}`
        }
    }

    oracle_render[index_selected_category].oracles.push(skeleton_oracle)
}

const process_oracle = (key_category, oracle) => {
    const key_oracle = format_name(oracle.Name)
    if (oracle.Table) {
        create_oracle(key_category, oracle)
    }

    if (oracle.Oracles) {
        for (const sub_oracle of oracle.Oracles) {
            create_oracle(key_category, sub_oracle, key_oracle)
        }
    }
}

for (const category of all_oracles) {
    const key_category = format_name(category.Name)
    oracle_render.push({ id: key_category, oracles: [] })
    for (const oracle of category.Oracles) {
        process_oracle(key_category, oracle)
    }

    if (category.Categories) {
        for (const category_nested of category.Categories) {
            for (const oracle of category_nested.Oracles) {
                const key_nested_category = format_name(category_nested.Name)

                if (oracle.Table) {
                    create_oracle(key_category, oracle, key_nested_category)
                }

                if (oracle.Oracles) {
                    for (const oracle_nested of oracle.Oracles) {
                        create_oracle(key_category, oracle_nested, key_nested_category)
                    }
                }
            }
        }
    }
}

const filteredOutput = output => {}

fs.writeFileSync('oracle_render.json', JSON.stringify(oracle_render))
fs.writeFileSync('oracle_ranges.json', JSON.stringify(oracle_ranges))
