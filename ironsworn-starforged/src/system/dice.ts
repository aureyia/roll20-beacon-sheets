const ACTION = { sides: 6, label: 'Action Die' } as const;
const ORACLE = { sides: 100, label: 'Oracle Die' } as const;
const challenge = (order: string) => ({ sides: 10, label: `Challenge Die: ${order}` });

export const actionDice = [ACTION, challenge('1'), challenge('2')];
export const taskDice = [challenge('1'), challenge('2')];
export const oracleDie = [ORACLE];
