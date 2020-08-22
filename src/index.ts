import { ChangeableValue } from 'longwood'

type WrapChangeable<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => State<R>
  : State<T>

type ArrayProxiedValues<T> = {
  [Key in Exclude<keyof ReadonlyArray<T>, 'map'>]: WrapChangeable<
    ReadonlyArray<T>[Key]
  >
} & {
  map<U>(
    callbackfn: (value: T, index: number, array: readonly T[]) => U,
    thisArg?: any
  ): State<U[]>
}
type ObjectProxiedValues<T> = {
  [Key in keyof T]: WrapChangeable<T[Key]>
}

type CommonProxiedValues<T> = {
  [Key in Exclude<keyof T, 'constructor' | 'toString'>]: WrapChangeable<T[Key]>
}

type ProxiedValues<T> = T extends Array<infer ItemType>
  ? ArrayProxiedValues<ItemType>
  : T extends { [key: string]: any }
  ? ObjectProxiedValues<T>
  : T extends string | number
  ? CommonProxiedValues<T>
  : {}

type State<T> = ChangeableValue<T> & ProxiedValues<T>

const withProxy = <T>(changeable: ChangeableValue<T>): State<T> =>
  new Proxy(changeable, {
    get: (target, prop, receiver) => {
      if (prop in target) return Reflect.get(target, prop, receiver)
      const currValue = target.getCurrentValue()
      const comparable =
        currValue instanceof Object
          ? currValue
          : Object.getPrototypeOf(currValue)

      if (prop in comparable) {
        if (typeof comparable[prop] === 'function')
          return (...args: any[]) =>
            withProxy({
              getCurrentValue: () =>
                comparable[prop].apply(changeable.getCurrentValue(), args),
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
