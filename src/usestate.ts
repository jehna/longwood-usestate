import { ChangeableValue } from 'longwood'

type WrapChangeable<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => State<R>
  : State<T>

type ArrayProxiedValues<T> = {
  [Key in keyof ReadonlyArray<T>]: WrapChangeable<ReadonlyArray<T>[Key]>
}
type ObjectProxiedValues<T> = {
  [Key in keyof T]: WrapChangeable<T[Key]>
}

type ProxiedValues<T> = T extends Array<infer ItemType>
  ? ArrayProxiedValues<ItemType>
  : T extends { [key: string]: any }
  ? ObjectProxiedValues<T>
  : {}

type State<T> = ChangeableValue<T> & ProxiedValues<T>

const withProxy = <T>(changeable: ChangeableValue<T>): State<T> =>
  new Proxy(changeable, {
    get: (target, prop, receiver) => {
      if (prop in target) return Reflect.get(target, prop, receiver)
      const currValue: any = target.getCurrentValue()
      if (prop in currValue) {
        if (typeof currValue[prop] === 'function')
          return (...args: any[]) =>
            withProxy({
              getCurrentValue: () =>
                currValue[prop].apply(changeable.getCurrentValue(), args),
              onChange(listener) {
                return changeable.onChange(() =>
                  listener(this.getCurrentValue())
                )
              }
            })
        else
          return withProxy({
            getCurrentValue: () => (changeable.getCurrentValue() as any)[prop],
            onChange(listener) {
              return changeable.onChange((next) => listener(next[prop]))
            }
          })
      }
    }
  }) as State<T>

export const useState = <T>(initialState: T) => {
  let current = initialState
  const listeners: ((newValue: T) => void)[] = []
  const changeable: ChangeableValue<T> = {
    getCurrentValue: () => current,
    onChange: (listener) => {
      listeners.push(listener)
      return () => listeners.splice(listeners.indexOf(listener), 1)
    }
  }

  const setter = (newValue: T) => {
    if (current === newValue) return
    current = newValue
    listeners.forEach((listener) => listener(newValue))
  }
  return [withProxy(changeable), setter] as const
}
