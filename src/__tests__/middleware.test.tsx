import * as React from "react";
import { render, getByTestId } from 'react-testing-library'
import userEvent from 'user-event'
import useMiddleWares from '../index'


describe("use-form test", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should excute middleware', () => {

    const mockFunc = jest.fn()

    const testMiddleware = ({ dispatch, getState }) => next => action => {
      mockFunc(dispatch, getState)
      return next(action);
    }

    const initialState = {};
    function reducer() {
      return {}
    }
    function Component() {
      const [state, dispatch] = useMiddleWares(reducer, initialState)([
        testMiddleware
      ]);
      return (
        <>
          <button data-testid="button" onClick={() => dispatch({type: 'increment'})}>+</button>
        </>
      );
    }
    const { container } = render(<Component />)
    const button = getByTestId(container, 'button')
    userEvent.click(button)
    expect(mockFunc).toHaveBeenCalled()
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


    const initialState = {};
    function reducer(state, action) {
      return {
        ...state,
        ...action
      }
    }

    let currentState

    function Component() {
      const [state, dispatch] = useMiddleWares(reducer, initialState)([
        AMiddleware,
        BMiddleware
      ]);
      currentState = state
      return (
        <>
          <button data-testid="button" onClick={() => dispatch({type: 'test'})}>+</button>
        </>
      );
    }
    const { container } = render(<Component />)
    const button = getByTestId(container, 'button')
    userEvent.click(button)
    expect(amockFunc).toHaveBeenCalled()
    expect(bmockFunc).toHaveBeenCalled()
    expect(amockFunc).toHaveBeenCalledWith({
      type: 'test'
    })
    expect(bmockFunc).toHaveBeenCalledWith({
      type: 'test',
      meta: "fromA",
    })
    expect(currentState).toEqual({
      type: 'test',
      meta: "fromB",
    })
  })
})
