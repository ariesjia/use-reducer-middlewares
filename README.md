# use-reducer-middlewares
> enhance React Hooks API `useReducer` can use middleware.

[![NPM](https://img.shields.io/npm/v/use-reducer-middlewares.svg)](https://www.npmjs.com/package/use-reducer-middlewares)
[![Build Status](https://travis-ci.org/ariesjia/use-reducer-middlewares.svg?branch=master)](https://travis-ci.org/ariesjia/use-reducer-middlewares)
[![minified](https://badgen.net/bundlephobia/min/use-reducer-middlewares)](https://bundlephobia.com/result?p=use-reducer-middlewares)
[![license](https://badgen.net/badge/license/MIT/blue)](https://github.com/ariesjia/use-reducer-middlewares/blob/master/LICENSE)
[![coverage](https://badgen.net/codecov/c/github/ariesjia/use-reducer-middlewares)](https://codecov.io/gh/ariesjia/use-reducer-middlewares)


## Install
```bash
// use yarn
yarn add use-reducer-middlewares
// use npm
npm install use-reducer-middlewares
```

## Demo

```javascript
import useMiddleWares from 'use-reducer-middlewares'
import logger from 'redux-logger'

const reducer = function (state, action) {
  // reducer
  return state
}

const init = function(count) {
  return {count}
}

const [state, dispatch] = useMiddleWares(reducer, 1, init)([
  logger
]);
```

## Sandbox Demo
(Code Sandbox Demo)[https://codesandbox.io/s/wk3o2jp1ll]
