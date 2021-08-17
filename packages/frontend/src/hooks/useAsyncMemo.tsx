import React, { useEffect, useRef, useState, DependencyList } from 'react'
import { shallowEquals } from 'src/utils'

function useAsyncMemo<T> (
  factory: () => Promise<T>,
  deps: DependencyList | undefined
): T | undefined {
  const [res, setRes] = useState<T>()
  const prevDependencies = React.useRef<DependencyList>()

  useEffect(() => {
    if (shallowEquals(deps, prevDependencies.current)) {
      return
    }
    prevDependencies.current = deps

    const fetchRes = async () => {
      const _res = await factory()
      setRes(_res)
    }

    fetchRes()
  }, [deps])

  return res
}

export default useAsyncMemo
