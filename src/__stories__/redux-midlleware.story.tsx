import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { createLogger } from 'redux-logger'

import useMiddleWares from '../index'

const initialState = {};

function reducer() {
  return {}
}

const Demo = () => {
  const [state, dispatch] = useMiddleWares(reducer, initialState)([
    createLogger({
      logger: {
        ...console,
        log(...args) {
          action('log')(args)
          console.log(...args)
        }
      }
    })
  ]);
  return (
    <>
      <button onClick={() => dispatch({type: 'log'})}>LOG</button>
    </>
  );
}

storiesOf('demo', module)
    .add('redux-logger test', () => (
        <Demo />
    ))
