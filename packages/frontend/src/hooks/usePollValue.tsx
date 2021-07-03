import React, { useEffect, useRef, DependencyList } from 'react'
import useInterval from 'src/hooks/useInterval'
import { shallowEquals } from 'src/utils'

function usePollValue<T> (
  factory: () => Promise<T>,
  interval: number,
  deps: DependencyList | undefined
): T | undefined {
  const resultRef = useRef<T>()
  const prevDependencies = React.useRef([])

  const fetch = async () => {
    resultRef.current = await factory()
  }

  useEffect(() => {
    if (shallowEquals(deps, prevDependencies.current)) {
      return
    }

    fetch()
  }, [deps])

  useInterval(async () => {
    fetch()
  }, interval)

  return resultRef.current
}

export default usePollValue
