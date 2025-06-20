// id: {oracle_id}-{min}-to-{max}
type Result = {
    min: number
    max: number
}

// id: {category}-{name}
export type OracleRender = {
    [key: string]: {
        [key: string]: Result[]
    }
}

const renderExample = [
    {
        id: 'category-id',
        oracles: [
            {
                id: 'oracle-id',
                rows: [
                    { id: 'result-id', min: 1, max: 2 }
                ]
            }
        ]
    }
]

// i18n ids: 
// "oracle--{category}--{name}": "Oracle Name"
// "oracle--{category}--{name}--description": ""
// "oracle--{category}--{name}--{min}-to-{max}: "Result Text"

const oracles = {
    "character-creation": {
        "background-assets": {
            "1-to-5": {
                min: 1,
                max: 5,
                actions: {},
            },
            "6-to-10": {
                min: 6,
                max: 10,
                actions: {},
            }
        }
    }
}

type OracleRanges = {
    [key: string]: {
        [key: number]: string
    }
}

const ranges = {
    "background-assets": {
        1: 'background-assets--1-to-5',
        2: 'background-assets--1-to-5',
        3: 'background-assets--1-to-5',
        4: 'background-assets--1-to-5',
        5: 'background-assets--1-to-5',
    }
}

// Flat Map for rendering
// Some different data structure for the rolling

// roll d100 die
// get result
// check what range it falls within
// if rolled 7, what is the fastest way to know you are within the 6 to 10 range
//
