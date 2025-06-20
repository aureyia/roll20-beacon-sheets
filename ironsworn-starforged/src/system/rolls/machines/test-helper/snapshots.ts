import fs from 'node:fs'
import path from 'node:path'
import { diff } from 'json-diff'

const output_file = path.resolve(__dirname, 'outcomes_expected.json')
const test_file = path.resolve(__dirname, 'temp/test_outcomes.json')
const diff_file = path.resolve(__dirname, 'temp/diff.json')

export const outcomes_load = () => {
    if (!fs.existsSync(output_file)) {
        return {}
    }
    return JSON.parse(fs.readFileSync(output_file))
}

export const test_outcomes_load = () => {
    if (!fs.existsSync(test_file)) {
        return {}
    }
    return JSON.parse(fs.readFileSync(test_file))
}

export const outcomes_save = (outcomes: any) => {
    fs.writeFileSync(output_file, JSON.stringify(outcomes))
}

export const test_outcomes_save = (outcomes: any) => {
    fs.writeFileSync(test_file, JSON.stringify(outcomes))
}

export const diff_save = (results: any) => {
    fs.writeFileSync(diff_file, JSON.stringify(results))
}

export const get_outcome_key = ({
    challenge_die_1,
    challenge_die_2,
    momentum,
    action_score,
    burn,
}) => {
    return `${challenge_die_1}-${challenge_die_2}-${momentum}-${action_score}-${burn}`
}

export const compare = () => {
    const outcomes_expected = outcomes_load()
    const outomes_test = test_outcomes_load()

    const results = diff(outcomes_expected, outomes_test)

    if (results === undefined) {
        return 'No differences found.'
    }
    diff_save(results)
    return 'Differences found!'
}
