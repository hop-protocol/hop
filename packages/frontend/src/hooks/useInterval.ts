import { useEffect, useRef } from 'react'
import logger from 'src/logger'

const useInterval = (callback: () => any, delay: number) => {
  const savedCallback = useRef<() => any>()
  const savedDelay = useRef<number | null>()
  const savedTimeout = useRef<number | undefined>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    savedDelay.current = delay
  }, [delay])

  // Set up the interval.
  useEffect(() => {
    let id: number
    const tick = async () => {
      if (savedCallback.current) {
        await savedCallback.current()
      }
      if (savedDelay.current !== null) {
        id = setTimeout(tick, savedDelay.current)
        if (savedTimeout.current === undefined) {
          savedTimeout.current = id
        }
        if (savedTimeout.current !== id) {
          clearTimeout(savedTimeout.current)
          savedTimeout.current = id
        }
      }
    }

    tick().catch(logger.error)

    return () => {
      clearTimeout(id)
    }
  }, [delay])
}

export default useInterval
