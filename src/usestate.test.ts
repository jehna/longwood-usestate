import { createContext } from './index'
import { div, text, button } from 'longwood'
import { JSDOM } from 'jsdom'

const createRenderTarget = () =>
  new JSDOM('<div id="app" />').window.document.getElementById('app')!

describe('useState', () => {
  it('should expose the initial state value', () => {
    const target = createRenderTarget()
    const { provider, consumer } = createContext('foobar')
    const render = provider(div(consumer((state) => div(text(state)))))
    render(target)

    expect(target.innerHTML).toEqual('<div><div>foobar</div></div>')
  })

  it('should re-render the child tree when state changes', () => {
    const target = createRenderTarget()
    const { provider, consumer, setState } = createContext('foobar')
    const render = div(provider(div(consumer((state) => text(state)))))
    render(target)
    expect(target.innerHTML).toEqual('<div><div>foobar</div></div>')

    setState('hello world')
    expect(target.innerHTML).toEqual('<div><div>hello world</div></div>')
  })

  it('should not re-render if state is strictly equal', () => {
    const target = createRenderTarget()
    const staticValue = {}
    const { provider, consumer, setState } = createContext(staticValue)
    const spy = jest.fn()
    const render = div(
      provider(
        div(
          consumer(() => {
            spy()
            return text('hello world!')
          })
        )
      )
    )
    render(target)
    expect(target.innerHTML).toEqual('<div><div>hello world!</div></div>')
    setState(staticValue)

    expect(spy).toBeCalledTimes(1)
  })

  it('should work with README example', () => {
    const app = createRenderTarget()
    const { provider, consumer } = createContext(0)
    const render = provider(
      div(
        consumer((state, setState) =>
          div(
            text(`Count: ${state}`),
            button({
              id: 'button',
              onclick: () => setState(state + 1),
              children: [text('+1')]
            })
          )
        )
      )
    )
    render(app)
    expect(app.innerHTML).toEqual(
      '<div><div>Count: 0<button id="button">+1</button></div></div>'
    )
    app.querySelector('#button')?.dispatchEvent(CustomEvent('click', app))
    expect(app.innerHTML).toEqual(
      '<div><div>Count: 1<button id="button">+1</button></div></div>'
    )
  })
})

function CustomEvent(event: string, el: Node) {
  const params = { bubbles: false, cancelable: false, detail: null }
  var evt = el.ownerDocument!.createEvent('CustomEvent')
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
  return evt
}
