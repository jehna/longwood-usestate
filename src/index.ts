import { MountFn } from 'longwood'

export const createContext = <T>(state: T) => {
  let reRender: () => void
  let currentState = state
  const setStateFn = (state: T) => {
    if (Object.is(state, currentState)) return
    currentState = state
    reRender()
  }

  return {
    provider: (renderer: MountFn): MountFn => (parent, index) => {
      reRender = () => renderer(parent, index)
      return renderer(parent, index)
    },
    consumer: (
      callback: (state: T, setState: typeof setStateFn) => MountFn
    ): MountFn => (parent, index) =>
      callback(currentState, setStateFn)(parent, index),
    setState: setStateFn
  }
}
