import { useState, useEffect } from 'react'

const useCheckTokenDeprecated = (token: string | undefined): boolean | null => {
  const [isTokenDeprecated, setIsTokenDeprecated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setIsTokenDeprecated(null)
      return
    }

    const deprecatedTokens = (process.env.REACT_APP_DEPRECATED_TOKENS ?? '').split(',')

    setIsTokenDeprecated(deprecatedTokens.includes(token))
  }, [token])

  return isTokenDeprecated
}

export default useCheckTokenDeprecated
