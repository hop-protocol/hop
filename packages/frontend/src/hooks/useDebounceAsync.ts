import { useRef, useEffect, useState } from 'react'
import wait from 'src/utils/wait'

const useDebouncePromise = (
  fn: (isCancelled: () => boolean) => void,
  debounceDelay: number,
  throttleDelay: number
) => {
  const context = useRef(0)
  const lastExecutedRef = useRef(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const execute = async () => {
      setLoading(true)
      const ctx = ++context.current
      const isCancelled = () => {
        return ctx !== context.current
      }

      const cooldown = lastExecutedRef.current + throttleDelay - Date.now()
      await wait(Math.max(debounceDelay, cooldown))
      if (isCancelled()) return

      lastExecutedRef.current = Date.now()

      try {
        await fn(isCancelled)
      } catch (err) {
        setLoading(false)
        throw err
      }

      if (!isCancelled()) {
        setLoading(false)
      }
    }

    execute()
  }, [fn])

  return loading
}

export default useDebouncePromise
