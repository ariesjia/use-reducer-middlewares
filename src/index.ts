import {useState, useMemo, Reducer, ReducerState, SetStateAction, Dispatch} from 'react'

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

function compose(chain) {
  return (store, dispatch) => {
    return chain.reduceRight((res, middleware) => {
      return middleware(store)(res);
    }, dispatch);
  };
}

const useReducerMiddlewares = function<R extends Reducer<any, any>, I>(
  reducer: R,
  initialState: I & ReducerState<R>,
  initializer: (arg: I & ReducerState<R>) => ReducerState<R> = state => state,
){
  return (middlewares: Middleware[] = []) => {
    const [hooksState, setState] = useState(initializer(initialState))
    let state = hooksState
    let middlewareDispatch;
    const dispatch = action => {
      state = reducer(state, action)
      setState(state)
      return action;
    }
    const composedMiddleware = useMemo(() => {
      return compose(middlewares);
    }, middlewares);
    const middlewareAPI = useMemo(() => {
      return {
        getState: () => state,
        dispatch: (...args) => middlewareDispatch(...args),
      };
    }, [state]);
    middlewareDispatch = composedMiddleware(middlewareAPI, dispatch);
    return [
      state,
      middlewareDispatch,
    ]
  }
}

export default useReducerMiddlewares