export const findRange = (
    entries: [{ id: string; min: number; max: number }],
    value: number
) => {
    let low = 0
    let high = entries.length - 1

    while (low <= high) {
        const mid = (low + high) >>> 1
        const range = entries[mid]

        if (value < range.min) {
            high = mid - 1
        } else if (value > range.max) {
            low = mid + 1
        } else {
            return range.id
        }
    }

    return null
}
