import { FlowDefault, FreeLimitsDefault, WidgetDefault } from '@globalStates/DefaultStates'
import { type Flow, type UserStateType, type Widget } from '@globalStates/Interfaces'
import { atom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { atomWithReset } from 'jotai/utils'

export const freeLimitsAtom = atom<typeof FreeLimitsDefault>(FreeLimitsDefault)
export const widgetChannelOrderAtom = atom<number>(0)
export const userState = atom<UserStateType>({})
export const editWidgetChannelIdAtom = atomWithReset<number>(0)
export const flowAtom = atomWithImmer<Flow>(FlowDefault)
export const resetFlowAtom = atom(undefined, (get, set) => {
  set(flowAtom, { ...FlowDefault, sequence: get(widgetChannelOrderAtom) })
})
export const widgetAtom = atomWithImmer<Widget>(WidgetDefault)
export const widgetChannelCountAtom = atom<number>(0)
