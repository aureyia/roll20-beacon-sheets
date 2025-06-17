// biome-ignore lint: Intended any
type TODO = any
type ObjectValues<T> = T[keyof T]

type SetEvent<Store> = {
  [K in keyof Store]: {
    label: K
    value: Store[K]
  }
}[keyof Store]
