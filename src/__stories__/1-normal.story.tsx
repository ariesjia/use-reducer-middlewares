import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import useMiddleWares from '../index'

const thunkMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return next(action);
}

const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      return {}
  }
}

const Demo = () => {
  const [state, dispatch] = useMiddleWares(reducer, initialState)([
    thunkMiddleware
  ]);
  return (
    <>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch((dispatch) => {
        window.setTimeout(() => {
          dispatch({type: 'increment'})
        }, 500)
      })}>timeout +</button>
      Count: <span id="count">{state.count}</span>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}

storiesOf('demo', module)
    .add('thunk test', () => (
        <Demo />
    ))
