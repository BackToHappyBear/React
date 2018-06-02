class store {
  constructor(reducer) {
    this.store = {}
    this.listeners = []
    this.reducer = reducer
  }
  
  getState = () => this.store

  subscribe = listener => {
    this.listeners.push(listener)
    return this.listeners.filter(l => l !== listener)
  }

  dispatch = action => {
    const store = this.reducer(this.store, action)
    if (store !== this.store) {
      this.store = store
      this.listeners.forEach(l => l(this.store))
    }
  }
  
}

const createStore = new store(reducer)