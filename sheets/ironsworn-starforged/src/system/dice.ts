const ACTION = { sides: 6, label: 'Action Die' }
const challenge = (order :string) => ({ sides: 10, label: `Challenge Dice: ${order}`})

export const actionDice = [ ACTION, challenge('1'), challenge('2') ];
export const taskDice = [ challenge('1'), challenge('2') ];
export const oracleDice = [{ sides: 100, label: 'Oracle Dice' }];
