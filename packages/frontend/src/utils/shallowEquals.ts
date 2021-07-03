import { DependencyList } from 'react'

const shallowEquals = (a?: DependencyList, b?: DependencyList) => {
  if (a?.length !== b?.length) return false
  if (a === undefined && b === undefined) return true
  if (a === undefined || b === undefined) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }

  return true
}

export default shallowEquals
