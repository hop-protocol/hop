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
    const seen: any = []
    const serializedState = JSON.stringify(state, (key, val) => {
      if (val !== null && typeof val === 'object') {
        if (seen.indexOf(val) >= 0) {
          return
        }
        seen.push(val)
      }
      return val
    })
    setItem(key, serializedState)
  } catch (err) {
    // Ignore write errors.
    console.error(err)
  }
}
