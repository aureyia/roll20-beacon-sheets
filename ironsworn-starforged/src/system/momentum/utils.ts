export const momentum_max = (impacts: number) => (impacts > 10 ? 0 : 10 - impacts)

export const momentum_reset = (impacts: number) => (impacts === 1 ? 1 : impacts >= 2 ? 0 : 2)
