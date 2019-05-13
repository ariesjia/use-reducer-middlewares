import * as React from "react";
import render, { act } from 'hooks-test-util'
import useMiddleWares from '../index'

describe("middleware test", () => {
  it('should excute middleware when dispatch', () => {
    const mockFunc = jest.fn()

    const testMiddleware = ({ dispatch, getState }) => next => action => {
      mockFunc(action)
      return next(action);
    }

    const initialState = {}

    function reducer() {
      return {}
    }

    const { container } = render(() => useMiddleWares(reducer, initialState)([
      testMiddleware
    ]))

    const action = {type: 'test'};
    act(() => {
      container.hook[1](action)
    })
    expect(mockFunc).toHaveBeenCalled()
    expect(mockFunc).toHaveBeenCalledWith(action)
  })

  it('should excute middleware as chain', () => {

    const amockFunc = jest.fn()
    const bmockFunc = jest.fn()

    const AMiddleware = ({ dispatch, getState }) => next => action => {
      amockFunc(action)
      return next({
        ...action,
        meta: 'fromA'
      });
    }

    const BMiddleware = ({ dispatch, getState }) => next => action => {
      bmockFunc(action)
      return next({
        ...action,
        meta: 'fromB'
      });
    }

    const initialState = {}

    function reducer(state, action) {
      return {
        ...state,
        ...action
      }
    }

    const { container } = render(() => useMiddleWares(reducer, initialState)([
      AMiddleware,
      BMiddleware
    ]))

    const action = {type: 'test'};
    act(() => {
      container.hook[1](action)
    })

    expect(amockFunc).toHaveBeenCalled()
    expect(bmockFunc).toHaveBeenCalled()
    expect(amockFunc).toHaveBeenCalledWith(action)
    expect(bmockFunc).toHaveBeenCalledWith({
      ...action,
      meta: "fromA",
    })
    expect(container.hook[0]).toEqual({
      ...action,
      meta: "fromB",
    })
  })

  it('should get current state when excute getState method in middleware', function () {

    const initialState = {
      status: 'status'
    }

    const testMiddleware = ({ getState }) => next => action => {
      expect(getState()).toEqual(initialState)
      return next(action)
    }

    function reducer() {
      return {}
    }

    const { container } = render(() => useMiddleWares(reducer, initialState)([
      testMiddleware
    ]))

    const action = {type: 'test'};

    act(() => {
      container.hook[1](action)
    })
  })

  it('should dispatch new action when excute dispatch method in middleware', function () {
    const initialState = {}

    const testMiddleware = ({ dispatch }) => next => action => {
      if(action.type === 'test') {
        dispatch({
          type: 'test_middleware'
        })
      }
      return next(action)
    }

    const reducer = jest.fn().mockImplementation(() => ({}))

    const { container } = render(() => useMiddleWares(reducer, initialState)([
      testMiddleware
    ]))

    const action = {type: 'test'}

    act(() => {
      container.hook[1](action)
    })

    expect(reducer).toBeCalledTimes(2)
    expect(reducer).toHaveBeenNthCalledWith(1, {}, {type: 'test_middleware'})
    expect(reducer).toHaveBeenNthCalledWith(2, {}, {type: 'test'})
  })

  it('should get current state after middleware dispatch changed state', function () {
    const initialState = {}

    const testMiddleware = ({ dispatch }) => next => action => {
      if(action.type === 'test') {
        dispatch({
          type: 'test_middleware'
        })
      }
      return next(action)
    }

    const reducer = jest.fn().mockImplementation((state, action) => ({
      status: action.type
    }))

    const { container } = render(() => useMiddleWares(reducer, initialState)([
      testMiddleware
    ]))

    const action = {type: 'test'}

    act(() => {
      container.hook[1](action)
    })

    expect(reducer).toBeCalledTimes(2)
    expect(reducer).toHaveBeenNthCalledWith(1, {}, {type: 'test_middleware'})
    expect(reducer).toHaveBeenNthCalledWith(2, {
      status: 'test_middleware'
    }, {type: 'test'})
  })
})
