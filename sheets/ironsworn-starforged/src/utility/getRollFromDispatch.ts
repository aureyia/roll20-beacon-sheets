import { dispatchRef } from '@/relay/relay';

export type AvailableDice = '1d6' | '1d10' | '1d100'
export type FormattedRoll = {
  rolls: {
    'dice-0'?: AvailableDice;
    'dice-1'?: AvailableDice;
    'dice-2'?: AvailableDice;
  }
}

export const getRollFromDispatch = async (formattedRoll: FormattedRoll): Promise<any> => await dispatchRef.value.roll(formattedRoll)