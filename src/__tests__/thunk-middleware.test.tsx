import * as React from "react";
import render, { act } from 'hooks-test-util'
import thunkMiddleware from 'redux-thunk'
import useMiddleWares from '../index'


function flushPromises() {
  return new Promise(function(resolve) {
    setTimeout(resolve);
  });
}

describe("middleware test",() => {
  it('should excute middleware when dispatch', async () => {
    const mockFunc = jest.fn()

    const initialState = {count: 0};

    function reducer(state, action) {
      switch (action.type) {
        case 'increment':
          return {count: state.count + 1};
        case 'decrement':
          return {count: state.count - 1};
        case 'reset':
          return {count: 0};
        default:
          return state
      }
    }

    const logMiddleware = ({ getState }) => next => action => {
      mockFunc(getState())
      next(action)
      mockFunc(getState())
    }

    const { container } = render(() => useMiddleWares(reducer, initialState)([
      thunkMiddleware, logMiddleware
    ]))

    function dispatchAction(hook = container.hook) {
      hook[1]((dispatch) => {
        dispatch({type: 'increment'})
        Promise.resolve().then(() => {
          dispatch({type: 'reset'})
        })
      })
    }

    act(() => {
      dispatchAction()
    })

    act(() => {
      dispatchAction()
    })

    await flushPromises()

    expect(mockFunc).toBeCalledTimes(8)
    expect(mockFunc).toHaveBeenNthCalledWith(1, {
      count: 0
    })
    expect(mockFunc).toHaveBeenNthCalledWith(2, {
      count: 1
    })
    expect(mockFunc).toHaveBeenNthCalledWith(3, {
      count: 1
    })
    expect(mockFunc).toHaveBeenNthCalledWith(4, {
      count: 2
    })
    expect(mockFunc).toHaveBeenNthCalledWith(5, {
      count: 2
    })
    expect(mockFunc).toHaveBeenNthCalledWith(6, {
      count: 0
    })
    expect(mockFunc).toHaveBeenNthCalledWith(7, {
      count: 0
    })
    expect(mockFunc).toHaveBeenNthCalledWith(8, {
      count: 0
    })
  })
})
