import fs from 'nod:fs'
import { starforged } from '../../vendor/dataforged/dist/index-esm.mjs'


const oraclesAll = starforged['Oracle Categories']
const outputRender = []
const ranges = {}

const formatName = (name) => name.toLowerCase().replaceAll(' ', '-')
const createOracle = (categoryKey, oracle, prefix = null) => {
    const formattedName = formatName(oracle.Name)
    const oracleKey = prefix ? `${prefix}-${formattedName}` : formattedName
    ranges[oracleKey] = {}
    let selectCategoryIndex = 0

    for (const [index, category] of outputRender.entries()) {
        if (category.id === categoryKey) {
            selectCategoryIndex = index
        }
    }
    const renderOracle = { id: oracleKey, rows: [] }
    for (const entry of oracle.Table) {
        const entryKey = `${entry.Floor}-to-${entry.Ceiling}`

        renderOracle.rows.push({
            id: entryKey,
            min: entry.Floor,
            max: entry.Ceiling
        })

        for (let i = entry.Floor; i <= entry.Ceiling; i++) {
            ranges[oracleKey][i] = `${oracleKey}-${entryKey}`
        }
    }

    outputRender[selectCategoryIndex].oracles.push(renderOracle)
}

for (const category of oraclesAll) {
    const categoryKey = formatName(category.Name)
    outputRender.push({ id: categoryKey, oracles: [] })
    for (const oracle of category.Oracles) {
        const oracleKey = formatName(oracle.Name)

        if (oracle.Table) {
            createOracle(categoryKey, oracle)
        }

        if (oracle.Oracles) {
            for (const nestedOracle of oracle.Oracles) {
                createOracle(categoryKey, nestedOracle, oracleKey)
            }
        }
    }

    if (category.Categories) {
        for (const nestedCategory of category.Categories) {
            for (const oracleNestedCategory of nestedCategory.Oracles) {
                const keyNestedCategory = formatName(nestedCategory.Name)

                if (oracleNestedCategory.Table) {
                    createOracle(categoryKey, oracleNestedCategory, keyNestedCategory)
                }

                if (oracleNestedCategory.Oracles) {
                    for (const nestedOracleNestedCategory of oracleNestedCategory.Oracles) {
                        createOracle(categoryKey, nestedOracleNestedCategory, keyNestedCategory)
                    }
                }
            }
        }
    }
}

const filteredOutput = (output) => {

}

fs.writeFileSync('outputRender.json', JSON.stringify(outputRender))
fs.writeFileSync('ranges.json', JSON.stringify(ranges))
