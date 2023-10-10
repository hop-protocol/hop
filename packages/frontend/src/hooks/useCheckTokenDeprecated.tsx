import { useState, useEffect } from 'react'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'

const deprecatedTokens = (process.env.REACT_APP_DEPRECATED_TOKENS ?? '').split(',')

const useCheckTokenDeprecated = (token: string | undefined): boolean | null => {
  const [isTokenDeprecated, setIsTokenDeprecated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setIsTokenDeprecated(null)
      return
    }

    setIsTokenDeprecated(deprecatedTokens.includes(normalizeTokenSymbol(token)))
  }, [token])

  return isTokenDeprecated
}

export default useCheckTokenDeprecated
