export const INTENSITY = {
    High: 'high',
    Medium: 'medium',
    Low: 'low',
} as const

export type Intensity = typeof INTENSITY[keyof typeof INTENSITY]
