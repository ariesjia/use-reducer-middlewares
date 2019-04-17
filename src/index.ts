import {useReducer, useMemo, useCallback, Reducer, ReducerState, SetStateAction, Dispatch} from 'react'

export interface MiddlewareAPI<S = any> {
  dispatch: Dispatch<any>
  getState(): S
}

export interface Middleware<
  DispatchExt = {},
  S = any,
  > {
  (store: MiddlewareAPI<S>): (
    next: Dispatch<SetStateAction<any>>
  ) => (action: any) => any
}

function applyMiddleware(chain) {
  return (store) => {
    return chain.reduceRight((res, middleware) => {
      return middleware(store)(res)
    }, store.dispatch);
  }
}

const useReducerMiddlewares = function<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined,
){
  return (chain: Middleware[] = []) => {
    const [state, dispatch] = useReducer(reducer, initialState, initializer);
    const getState = useCallback(() => state, [state])
    const middleWareDispatch = useMemo(() => {
      const store = { dispatch, getState }
      return applyMiddleware(chain)(store)
    }, chain)
    return [
      state,
      middleWareDispatch,
    ]
  }
}

export default useReducerMiddlewares