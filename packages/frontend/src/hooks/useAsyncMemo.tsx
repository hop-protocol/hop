import React, { useEffect, useRef, DependencyList } from 'react'
import { shallowEquals } from 'src/utils'

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

export default useAsyncMemo
