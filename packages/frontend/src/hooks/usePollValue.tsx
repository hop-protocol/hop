import React, { useEffect, useRef, DependencyList } from 'react'
import { useInterval } from 'usehooks-ts'
import { shallowEquals } from 'src/utils'

function usePollValue<T>(
  factory: () => Promise<T>,
  interval: number,
  deps: DependencyList | undefined
): T | undefined {
  const resultRef = useRef<T>()
  const prevDependencies = React.useRef([])

  const fn = async () => {
    resultRef.current = await factory()
  }

  useEffect(() => {
    if (shallowEquals(deps, prevDependencies.current)) {
      return
    }

    fn()
  }, deps || [])

  useInterval(async () => {
    fn()
  }, interval)

  return resultRef.current
}

export default usePollValue
