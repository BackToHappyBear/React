// import { createStore } from 'redux'
import createStore from './createStore'
import counter from './reducer'

let store = createStore(counter)

store.subscribe(() => console.log(store.getState()))

const unsubscribe = store.subscribe(() => console.log(store.getState()))
unsubscribe()

store.dispatch({ type: 'INCREMENT' })
