import { createState } from './index'
import { div, text, button } from 'longwood'
import { JSDOM } from 'jsdom'

const createRenderTarget = () =>
  new JSDOM('<div id="app" />').window.document.getElementById('app')!

describe('useStaet', () => {
  it('should expose the initial state value', () => {
    const target = createRenderTarget()
    const useState = createState('foobar')
    const render = div(useState((state) => div(text(state))))
    render(target)

    expect(target.innerHTML).toEqual('<div><div>foobar</div></div>')
  })

  it('should re-render the child tree when state changes', () => {
    const target = createRenderTarget()
    const useState = createState('foobar')
    let setStateFn: any
    const render = div(
      useState((state, setState) => {
        setStateFn = setState
        return text(state)
      })
    )
    render(target)
    expect(target.innerHTML).toEqual('<div>foobar</div>')

    setStateFn('hello world')
    expect(target.innerHTML).toEqual('<div>hello world</div>')
  })

  it('should not re-render if state is strictly equal', () => {
    const target = createRenderTarget()
    const staticValue = {}
    const useState = createState(staticValue)
    const spy = jest.fn()
    let setStateFn: any
    const render = div(
      useState((_, setState) => {
        setStateFn = setState
        spy()
        return text('hello world!')
      })
    )
    render(target)
    expect(target.innerHTML).toEqual('<div>hello world!</div>')
    setStateFn(staticValue)

    expect(spy).toBeCalledTimes(1)
  })

  it('should work with README example', () => {
    const app = createRenderTarget()
    const useState = createState(0)
    const render = div(
      useState((state, setState) =>
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
