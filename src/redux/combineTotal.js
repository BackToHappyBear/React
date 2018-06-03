/**
 * 结合 redux redux-thunk 实现增强 store
 */
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import counter from './reducer'

/**
 * 将 store 导出注入至 root 组件即可
 * 源码分析见 ./analyzeStore
 */
export let store = createStore(counter, applyMiddleware(thunk))


