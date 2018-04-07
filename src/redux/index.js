import { createStore } from 'redux'
// import createStore from './createStore'
import counter from './reducer'

function whatever(state = 0, aciton) {
  switch (aciton.type) {
    case 'SING':
      return state + 10
    case 'DANCE':
      return state + 20
    default:
      return state
  }
}

let store = createStore(counter)

store.subscribe(() => console.log(store.getState()))
store.subscribe(() => console.log(123))
store.subscribe()

store.dispatch({ type: 'INCREMENT' })
