import * as React from "react";
import { render, getByTestId } from 'react-testing-library'
import userEvent from 'user-event'
import useMiddleWares from '../index'


describe("use-form test", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should get initial form value', () => {

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
})
