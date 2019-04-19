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

function compose(chain, dispatch) {
  return store => {
    return chain.reduceRight((res, middleware) => {
      return middleware(store)(res);
    }, dispatch);
  };
}

const useReducerMiddlewares = function<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined,
){
  return (middlewares: Middleware[] = []) => {
    const [state, dispatch] = useReducer(reducer, initialState, initializer)
    let middlewareDispatch;
    const composedMiddleware = useMemo(() => {
      return compose(middlewares, dispatch);
    }, middlewares);
    const middlewareAPI = useMemo(() => {
      return {
        getState: () => state,
        dispatch: (...args) => middlewareDispatch(...args),
      };
    }, [state]);
    middlewareDispatch = composedMiddleware(middlewareAPI);
    return [
      state,
      middlewareDispatch,
    ]
  }
}

export default useReducerMiddlewares