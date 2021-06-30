import React, { useEffect, useRef, DependencyList } from 'react'
import useInterval from 'src/hooks/useInterval'

function usePollValue<T> (
  factory: () => Promise<T>,
  interval: number
): T | undefined {
  const resultRef = useRef<T>()

  useInterval(async () => {
    resultRef.current = await factory()
  }, interval)

  return resultRef.current
}

export default usePollValue
