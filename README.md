# Longwood useState    ![Travis CI build status](https://travis-ci.org/jehna/longwood-usestate.svg?branch=master) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![npm version](https://img.shields.io/npm/v/longwood-usestate.svg?style=flat)](https://www.npmjs.com/package/longwood-usestate) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> Simple [React context](https://reactjs.org/docs/context.html)-style state management library for [Longwood](https://github.com/jehna/longwood)

## Example

You can use `createContext` function to craete a context object with state:

```js
const { provider, consumer, setState } = createContext(0)
const render = provider(
  div(
    consumer((state) =>
      div(
        text(`Count: ${state}`),
        button({
          onclick: () => setState(state + 1),
          children: [text('+1')]
        })
      )
    )
  )
)
render(app)
```

You can then modify the state and the provider automatically re-renders the DOM.

[▶️ Run in CodeSandbox.io](https://codesandbox.io/s/blissful-montalcini-4kqlc)

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

      const { provider, consumer } = createContext(0)
      const render = provider(
        div(
          consumer((state, setState) =>
            div(
              text(`Count: ${state}`),
              button({
                onclick: () => setState(state + 1),
                children: [text('+1')]
              })
            )
          )
        )
      )
      render(document.getElementById('app'))
    </script>
  </body>
</html>
```

[▶️ Run in CodeSandbox.io](https://codesandbox.io/s/smoosh-sky-xu3w6)

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
