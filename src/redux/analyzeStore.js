/**
 * 浅读 createStore applyMiddleware redux-thunk 源码
 */
let store = createStore(counter, applyMiddleware(thunk))

/** 
 * 之前实现了不包含 middleware 简单的 createStore 
 * 几行代码后进入 applyMiddleware 的源码
 */
function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    /**
     * 类型检测与空值处理后最终执行如下
     */
    return enhancer(createStore)(reducer, preloadedState)
  }
  // ...
}

/**
 * applyMiddleware(thunk)(createStore)(reducer, preloadedState)
 * middlewares 本例中即 redux-thunk，当然也可加入多个 middleware
 * 这里会有点绕，需结合 thunk 的源码看
 */
function applyMiddleware(...middlewares) {
  return (createStore) => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    /**
     * middleware 的形式即: store => next => action
     * compose(...chain) 返回的是一个 next => action 之后的函数
     * 每一个 middleware 都拿到了 middlewareAPI 里的 getState 与 dispatch
     * 同时又将 store.dispatch 传入，即 next
     * chain 是一个 函数数组，由于闭包的原因，每个函数引用的 store 都是相同的
     */
    chain = middlewares.map(middleware => middleware(middlewareAPI))

    /*
     * dispatch 最终会由 compose（...[A, B, C])(store.dispatch)
     * 转变为 A(B(C(store.dispatch))) 即 增强型 dispatch
     * 这里需要跳转到 thunkMiddleware的源码解读
     */
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

// A(B(C(store.dispatch)))({ type: 'ADD', payload: 1 })
function logger({ dispatch, getState }) {
  return next => action => {
    console.log('before action', getState())
    next(action)
    console.log('after action', getState())
  }
}

/**
 * 从 middlewareAPI中 拿到 dispatch 和 getState，然后依旧返回一个函数
 * 这里的 next 即上面 dispatch中 传递的 store.dispatch
 * 结合如下异步 action 的例子，这里的 dispatch 即 action => dispatch(action)
 * 本质上 redux-thunk 的作用就是处理 function 类型的 action
 */
function thunkMiddleware({
  dispatch,
  getState
}) {
  return next => action =>
    typeof action === 'function' ?
    action(dispatch, getState) :
    next(action);
}

/**
 * 异步 action
 */
function incrementAsync() {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}

/**
 * compose 源码
 */
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

export default function compose02(...funcs) {
  return arg => funcs.reduceRight((composed, f) => f(composed), arg);
}