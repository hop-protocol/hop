export const getItem = key => localStorage.getItem(key)
export const setItem = (key, value) => localStorage.setItem(key, value)
export const removeItem = key => localStorage.removeItem(key)

export const loadState = (item: string = 'state') => {
  try {
    const serializedState = getItem(item)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = (key: string = 'state', state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    setItem(key, serializedState)
  } catch (err) {
    // Ignore write errors.
  }
}
