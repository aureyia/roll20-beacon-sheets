export type SetEvent<Store> = {
  label: keyof Store;
  value: Store[keyof Store];
};
