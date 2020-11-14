import { MountFn } from 'longwood'

export const createContext = <T>(state: T) => {
  let reRender: () => void
  let currentState = state

  return {
    provider: (renderer: MountFn): MountFn => (parent, index) => {
      reRender = () => renderer(parent, index)
      return renderer(parent, index)
    },
    consumer: (callback: (state: T) => MountFn): MountFn => (parent, index) =>
      callback(currentState)(parent, index),
    setState: (state: T) => {
      if (Object.is(state, currentState)) return
      currentState = state
      reRender()
    }
  }
}
