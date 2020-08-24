# Longwood useState    ![Travis CI build status](https://travis-ci.org/jehna/longwood-usestate.svg?branch=master) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![npm version](https://img.shields.io/npm/v/longwood-usestate.svg?style=flat)](https://www.npmjs.com/package/longwood-usestate) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> React's `useState` style state management library for [Longwood](https://github.com/jehna/longwood)

## Example

You can use `useState` pretty much the same way you'd use React's hooks. Here's a simple example:

```js
const [counter, setCounter] = useState(0)
div(
  button({
    listen: {
      click: () => setCounter(counter.valueOf() + 1)
    },
    innerText: '+1'
  }),
  div(text('Value: '), text(counter.toFixed(0)))
)
```

[▶️ Run in CodeSandbox.io](https://codesandbox.io/s/vibrant-cookies-bz5lt?file=/src/index.ts)

The resulting state is a `ChangeableValue`, so you can pass it as a value to any
Longwood component prop. Notice using `valueOf` to grab the current value of the
`ChangeableValue`.


### State splitting

You can split the state to smaller components, just like it was a regular
Javascript object. You can even call any method like you'd normally do:

```js
const [state, setState] = useState({ numbers: randomNumbers() })
const even = state.numbers.filter((n) => n % 2 === 0)

div(
  div(text('Even numbers: '), text(even.join(', '))),
  button({
    type: 'button',
    onclick: () => setState({ numbers: randomNumbers() }),
    textContent: 'Randomize!'
  })
)
```

[▶️ Run in CodeSandbox.io](https://codesandbox.io/s/icy-dew-kw7cv?file=/src/index.ts)

This seems like magic, because it is! Let's add some type hints to see how this
works:

```ts
const [state, setState] = useState(['hello', 'world'])
// So we start as State<string[]>
const values: State<string[]> = state

// We can dynamically call any method to get a new proxied State object:
const upperCased: State<string[]> = values.map((word) => word.toUpperCase())

// The type signature changes just as you'd expect. Let's take the first item:
const firstUpperItem: State<string> = upperCased[0]

// Now the variable `firstUpperItem` has value `HELLO`
console.log('First value: ', firstUpperItem.valueOf())

// But we can change the value by calling `setState`
setState(['changed', 'values'])

// After this our value has reflects to be `CHANGED`
console.log('First value: ', firstUpperItem.valueOf())
```

[▶️ Run in CodeSandbox.io](https://codesandbox.io/s/recursing-gareth-63p7q?file=/src/index.ts)

The magic here is that `useState` returns a `State` object, which extends the
`ChangeableValue` in a way that it proxies all methods and properties from the
underlying value. These proxied methods and values all return a new `State`
object that reflects all changes made to the original state.

## Example: Todo app

Everyone's favourite example: The Todo App is available so you could have a look
at how you could use `longwood-usestate` a real-life project — that's at least
if you're creating a todo app.

[▶️ Run in CodeSandbox.io](https://codesandbox.io/s/practical-pond-1doz4?file=/src/TodoApp.ts)

## Getting started (ES Modules)

`longwood-usestate` is available as ES module, so quickest way to get started is
to import the module directly within your HTML page:

```html
<html>
  <body>
    <div id="app"></div>
    <script type="module">
      import { div } from 'https://cdn.skypack.dev/longwood'
      import { useState } from 'https://cdn.skypack.dev/longwood-usestate'

      const [greeting, setGreeting] = useState('Hello world!')
      const render = div({ textContent: state })
      render(document.getElementById('app'))
    </script>
  </body>
</html>
```

[▶️ Run in CodeSandbox.io](https://codesandbox.io/s/cranky-jang-rwuwb?file=/index.html)

This is literally all the code you'll need! No build tools needed, no extra
steps, just save the code as a .html file and start hacking.

## Getting started (npm)

You can install `longwood-usestate` to your project like a normal dependency
within your project:

```
yarn add longwood longwood-usestate
```

Then you can import the package in your js file. For example if you're using
Webpack, you can do:

```js
import { div } from 'longwood'
import { useState } from 'longwood-usestate'

const [greeting, setGreeting] = useState('Hello world!')
const render = div({ textContent: greeting })
render(document.getElementById('app'))
```

## Developing

You can use TDD for development by running:

```
yarn
yarn test --watch
```

This runs Jest, and the tests use JSDOM for asserting how DOM looks like.

### Building

You can build the project by running:

```shell
yarn build
```

This builds the project into `build/` directory.

### Deploying

This project is automatically deployed to NPM by using Travis CI. All tagged
versions are published when pushed.

Don't add tags by hand! Run:

```shell
yarn release
```

This will run an interactive deploy script to help you deploy the most recent
version.

## Contributing

This is a very early version of the project, and all feedback is welcome. Please
open an issue before implementing, as the direction still needs some
adjustments.

## Licensing

The code in this project is licensed under MIT license.
