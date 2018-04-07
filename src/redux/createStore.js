/**
 * 官方 redux 的例子，可以看出 createStore 是一个函数
 * 入参 reducer 是一个函数
 * 返回值 store 有 getState、subscribe、dispatch 3个方法
 * 根据这些粗略的实现一个 createStore 函数
 */
export default function createStore(reducer) {
  // 定义一个状态
  let state

  // 获取最新的 state
  const getState = () => state

  // 存储订阅的监听器
  let listeners = []

  // 订阅和发布
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  // 派发
  const dispatch = action => {
    state = reducer(state, action)
    listeners.forEach(l => l())
  }
  dispatch()

  return {
    getState,
    subscribe,
    dispatch,
  }
}