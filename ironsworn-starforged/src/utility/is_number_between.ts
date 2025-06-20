export const is_number_between = (value: number, min: number, max: number): boolean =>
    typeof value === 'number' && value >= min && value <= max
