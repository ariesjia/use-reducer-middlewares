import * as React from "react";
import render, { act } from 'hooks-test-util'
import useMiddleWares from '../index'

describe("reducer test", () => {
  it('should update state when reducer return new state', () => {
    const initialState = {}

    const newState = {
      state: 'test'
    }

    function reducer() {
      return newState
    }

    // @ts-ignore
    const { container } = render(() => useMiddleWares(reducer, initialState)([
    ]))

    const action = {type: 'test'}
    act(() => {
      container.hook[1](action)
    })

    expect(container.hook[0]).toEqual(newState)
  })

  it('should reducer can access current state and action', () => {
    const initialState = {
      status: null,
      text: 'hello'
    }

    function reducer(state, action) {
      switch (action.type) {
        case 'test':
          return {
            ...state,
            ...action.payload,
          }
        default:
          return initialState
      }
    }

    const { container } = render(() => useMiddleWares(reducer, initialState)([
    ]))

    expect(container.hook[0]).toEqual(initialState)

    act(() => {
      const action = {type: 'test', payload: {
        status: 'done',
        data: 'data'
      }}
      container.hook[1](action)
    })
    expect(container.hook[0]).toEqual({
      status: 'done',
      data: 'data',
      text: 'hello'
    })

    act(() => {
      container.hook[1]({type: 'test2'})
    })
    expect(container.hook[0]).toEqual(initialState)
  })

  it('should use initializer to init state when initializer parameter', function () {

    function initializer(count) {
      return {count}
    }

    function reducer() {
      return {}
    }

    const { container } = render(() => useMiddleWares(reducer, 1, initializer)([
    ]))

    expect(container.hook[0]).toEqual({count: 1})

  })
})
