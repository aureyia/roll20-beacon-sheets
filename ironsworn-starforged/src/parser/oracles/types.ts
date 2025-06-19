
// id: {oracle_entry_id}-result
type Result = { id: string }

// id: {oracle_id}-{min}-to-{max}
type OracleEntry = {
    id: string
    min: number
    max: number
    result_id: Result['id']
}

// id: {category}-{name}
export type Oracle = {
    id: string
    category: string
    entries: OracleEntry[]
}

// i18n ids: 
// "oracle--{category}--{name}": "Oracle Name"
// "oracle--{category}--{name}--description": ""
// "oracle--{category}--{name}--{min}-to-{max}: "Result Text"

const categories = {
    "character-creation": [
        "background-assets"
    ]
}

const oracles = {
    "background-assets": [
        "1-to-5",
        "6-to-10"
    ]
}

const entries = {
    "background-assets--1-to-5": {
        min: 1,
        max: 5,
        actions: {}
    },
    "background-assets--6-to-10": {
        min: 6,
        max: 10,
        actions: {}
    }
}

const ranges = {
    "background-assets": [
        { id: 'background-assets--1-to-5', min: 1, max: 5 },
        { id: 'background-assets--6-to-10', min: 6, max: 10 }
    ]
}


// Flat Map for rendering
// Some different data structure for the rolling

// roll d100 die
// get result
// check what range it falls within
// if rolled 7, what is the fastest way to know you are within the 6 to 10 range
//

import { findRange } from "@/utility/binary-search"

findRange(ranges["background-assets"], 7)
