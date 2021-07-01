import React, { useEffect, useRef, DependencyList } from 'react'

function useAsyncMemo<T> (
  factory: () => Promise<T>,
  deps: DependencyList | undefined
): T | undefined {
  const resultRef = useRef<T>()
  const prevDependencies = React.useRef([])

  useEffect(() => {
    if (shallowEquals(deps, prevDependencies.current)) {
      return
    }

    const fetchRes = async () => {
      resultRef.current = await factory()
    }

    fetchRes()
  }, [deps])

  return resultRef.current
}

const shallowEquals = (a?: DependencyList, b?: DependencyList) => {
  if (a?.length !== b?.length) return false
  if (a === undefined && b === undefined) return true
  if (a === undefined || b === undefined) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
}

export default useAsyncMemo
