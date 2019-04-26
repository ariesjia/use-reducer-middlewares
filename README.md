# use-reducer-middlewares
> enhance React Hooks API useReducer to apply middlewares.

[![NPM](https://img.shields.io/npm/v/use-reducer-middlewares.svg)](https://www.npmjs.com/package/use-reducer-middlewares)
[![Build Status](https://travis-ci.org/ariesjia/use-reducer-middlewares.svg?branch=master)](https://travis-ci.org/ariesjia/use-reducer-middlewares)
[![minified](https://badgen.net/bundlephobia/min/use-reducer-middlewares)](https://bundlephobia.com/result?p=use-reducer-middlewares)
[![license](https://badgen.net/npm/license/use-reducer-middlewares)](https://github.com/ariesjia/use-reducer-middlewares/blob/master/LICENSE)


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
