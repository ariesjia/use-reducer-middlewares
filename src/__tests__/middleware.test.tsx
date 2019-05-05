import * as React from "react";
import render, { act } from 'hooks-test-util'
import useMiddleWares from '../index'


describe("use-form test", () => {
  beforeEach(() => {
    jest.resetModules()
  })

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

    const action = {type: 'hello'};
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
})
