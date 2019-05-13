import {useState, useRef, useMemo, Reducer, ReducerState, SetStateAction, Dispatch} from 'react'

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
      return middleware(store)(res)
    }, dispatch)
  }
}

const useReducerMiddlewares = function<R extends Reducer<any, any>, I>(
  reducer: R,
  initialState: I & ReducerState<R>,
  initializer: (arg: I & ReducerState<R>) => ReducerState<R> = state => state,
){
  return (middlewares: Middleware[] = []) => {
    const ref = useRef(initializer(initialState))
    const [, setState] = useState(ref.current)
    let middlewareDispatch
    const dispatch = action => {
      ref.current = reducer(ref.current, action)
      setState(ref.current)
      return action
    }
    const composedMiddleware = useMemo(() => {
      return compose(middlewares)
    }, middlewares)
    const middlewareAPI = {
      getState: () => ref.current,
      dispatch: (...args) => middlewareDispatch(...args),
    }
    middlewareDispatch = composedMiddleware(middlewareAPI, dispatch)
    return [
      ref.current,
      middlewareDispatch,
    ]
  }
}

export default useReducerMiddlewares