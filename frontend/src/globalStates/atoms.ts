import { atom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { FlowDefault, WidgetDefault } from '@globalStates/DefaultStates'
import { Widget, Flow, UserStateType } from '@globalStates/Interfaces'
import { atomWithReset } from 'jotai/utils'

export const widgetChannelOrderAtom = atom<number>(0)
export const userState = atom<UserStateType>({})
export const editWidgetChannelIdAtom = atomWithReset<string>('')
export const flowAtom = atomWithImmer<Flow>(FlowDefault)
export const resetFlowAtom = atom(null, (get, set, _update) => {
  set(flowAtom, { ...FlowDefault, sequence: get(widgetChannelOrderAtom) })
})
export const widgetAtom = atomWithImmer<Widget>(WidgetDefault)
export const widgetChannelCountAtom = atom<number>(0)
