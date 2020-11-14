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

const UseStateKey = Symbol('@@UseStateKey')

const getStateFromNode = <T>(parent: Node, initialState: T) =>
  /**
   * Note that usestate (ab)uses Javascript's dynamic nature so it saves the
   * local state to the DOM object itself as a new property.
   */
  UseStateKey in parent ? (parent as any)[UseStateKey] : initialState

export const createState = <T>(initialState: T) => {
  return (
    callback: (state: T, setState: (newState: T) => void) => MountFn
  ): MountFn => {
    let reRender: () => void
    return (parent, index) => {
      const setStateFn = (newState: T) => {
        if (Object.is(getStateFromNode(parent, initialState), newState)) return
        ;(parent as any)[UseStateKey] = newState
        reRender()
      }
      reRender = () =>
        callback(getStateFromNode(parent, initialState), setStateFn)(
          parent,
          index
        )
      return callback(getStateFromNode(parent, initialState), setStateFn)(
        parent,
        index
      )
    }
  }
}
