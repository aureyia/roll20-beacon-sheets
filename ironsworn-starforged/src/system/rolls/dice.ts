const ACTION = { sides: 6, label: 'Action Die' } as const
const ORACLE = { sides: 100, label: 'Oracle Die' } as const
const challenge = (order: string) => ({
    sides: 10,
    label: `Challenge Die: ${order}`,
})

export const actionDice = [ACTION, challenge('1'), challenge('2')]
export const taskDice = [challenge('1'), challenge('2')]
export const actionDie = [ACTION]
export const challengeDice = [challenge('1'), challenge('2')]
export const oracleDie = [ORACLE]

export type Die<S extends number = number, L extends string = string> = {
    sides: S
    label: L
}

export type RolledDie = Die & { value: number }

export type ActionDie = Die<6, 'Action Die'>
export type ChallengeDie = Die<10, 'Challenge Die: 1' | 'Challenge Die: 2'>
export type OracleDie = Die<100, 'Oracle Die'>

export type RolledFrom<T extends Die> = T & { value: number }
export type RolledActionDie = RolledFrom<ActionDie>
export type RolledChallengeDie = RolledFrom<ChallengeDie>
export type RolledOracleDie = RolledFrom<OracleDie>

export type EvaluatedChallengeDice = RolledChallengeDie & {
    exceeded: boolean
}

export type FinalisedActionDiceBundle = [
    { sides: 6; label: 'Action Die'; value: number },
    { sides: 10; label: 'Challenge Die: 1'; value: number; exceeded: boolean },
    { sides: 10; label: 'Challenge Die: 2'; value: number; exceeded: boolean },
]
