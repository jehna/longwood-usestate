import { useState } from './index'
import { div, ul, li, key, text } from 'longwood'
import { JSDOM } from 'jsdom'

describe('useState', () => {
  it('should expose the intiial value with getCurrentValue', () => {
    const [state] = useState('hello')
    expect(state.getCurrentValue()).toEqual('hello')
  })

  it('should change the value when setter is called', () => {
    const [state, setState] = useState('hello')
    setState('world')
    expect(state.getCurrentValue()).toEqual('world')
  })

  it('should call onChange listeners when value changes', () => {
    const callback = jest.fn()
    const [state, setState] = useState('hello')
    state.onChange(callback)
    setState('world')
    expect(callback).toBeCalledWith('world')
  })

  it('should not call onChange if the state is the same', () => {
    const callback = jest.fn()
    const [state, setState] = useState('hello')
    state.onChange(callback)
    setState('hello')
    expect(callback).not.toBeCalled()
  })

  it(`should proxy common methods of state's prototype`, () => {
    const [state] = useState(['hello'])
    const derivedState = state.map((s) => s + ' world')
    expect(derivedState.getCurrentValue()).toEqual(['hello world'])
  })

  it(`should proxy common properties of state's prototype`, () => {
    const [state, setState] = useState(['hello'])
    const derivedState = state.length
    setState(['hello', 'world'])
    expect(derivedState.getCurrentValue()).toEqual(2)
  })

  it('should listen to changes by proxy props', () => {
    const [state, setState] = useState(['hello'])
    const callback = jest.fn()
    const derivedState = state.length
    derivedState.onChange(callback)
    setState(['hello', 'world'])
    expect(callback).toBeCalledWith(2)
  })

  it('should listen to changes by proxy methods', () => {
    const [state, setState] = useState(['there'])
    const callback = jest.fn()
    const derivedState = state.map((what) => `Hello ${what}`)
    derivedState.onChange(callback)
    setState(['world'])
    expect(callback).toBeCalledWith(['Hello world'])
  })

  it('should chain prixies', () => {
    const [state, setState] = useState([1, 2, 3, 4, 5])
    const derivedState = state.filter((n) => n % 2 === 0).map((n) => n * 2)
    expect(derivedState.getCurrentValue()).toEqual([4, 8])
    setState([5, 6, 7, 8, 9])
    expect(derivedState.getCurrentValue()).toEqual([12, 16])
  })

  it('should work with plain objects', () => {
    const [state, setState] = useState({ foo: 'bar' })

    const prop = state.foo
    expect(prop.getCurrentValue()).toEqual('bar')

    const callback = jest.fn()
    prop.onChange(callback)
    setState({ foo: 'change in prop' })
    expect(prop.getCurrentValue()).toEqual('change in prop')
    expect(callback).toBeCalledWith('change in prop')
  })

  it('should work with nested objects', () => {
    const [state, setState] = useState({ nested: { bar: 'baz' } })

    const nested = state.nested.bar
    expect(nested.getCurrentValue()).toEqual('baz')

    const callback = jest.fn()
    nested.onChange(callback)
    setState({
      ...state.getCurrentValue(),
      nested: { bar: 'change in nested' }
    })
    expect(nested.getCurrentValue()).toEqual('change in nested')
    expect(callback).toBeCalledWith('change in nested')
  })
})

describe('Usage with longwood', () => {
  const createRenderTarget = () =>
    new JSDOM('<div id="app" />').window.document.getElementById('app')!

  it('should allow rendering initial value', () => {
    const [className] = useState('hello')
    const render = div({ className })
    const element = createRenderTarget()
    render(element)
    expect(element.innerHTML).toEqual('<div class="hello"></div>')
  })

  it('should allow changing values', () => {
    const [className, setClassName] = useState('hello')
    const render = div({ className })
    const element = createRenderTarget()
    render(element)
    setClassName('world')
    expect(element.innerHTML).toEqual('<div class="world"></div>')
  })

  it('should allow following props', () => {
    const [state, setState] = useState({ className: 'foo' })
    const render = div({ className: state.className })
    const element = createRenderTarget()
    render(element)
    setState({ className: 'bar' })
    expect(element.innerHTML).toEqual('<div class="bar"></div>')
  })

  it('should allow array-based list items', () => {
    const [todos] = useState(['Do this', 'Do that'])
    const render = ul({
      children: [todos.map((todo) => key(todo, li({ children: [text(todo)] })))]
    })
    const element = createRenderTarget()
    render(element)
    expect(element.innerHTML).toEqual(
      '<ul><li>Do this</li><li>Do that</li></ul>'
    )
  })

  it('should allow changing array-based state', () => {
    type Todo = { label: string; checked: boolean }
    const [todos, setTodos] = useState<Todo[]>([
      { label: 'Do this', checked: false },
      { label: 'Do that', checked: false }
    ])

    const undone = todos.filter((todo) => !todo.checked)
    const render = ul({
      children: [
        undone.map((todo) =>
          key(todo.label, li({ children: [text(todo.label)] }))
        )
      ]
    })
    const element = createRenderTarget()
    render(element)

    // Check first todo item
    setTodos(
      todos
        .getCurrentValue()
        .map((todo, i) => (i === 0 ? { ...todo, checked: true } : todo))
    )

    expect(element.innerHTML).toEqual('<ul><li>Do that</li></ul>')
  })
})
