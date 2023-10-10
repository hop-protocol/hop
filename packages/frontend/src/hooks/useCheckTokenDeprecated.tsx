import { useState, useEffect } from 'react'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'

const useCheckTokenDeprecated = (token: string | undefined): boolean | null => {
  const [isTokenDeprecated, setIsTokenDeprecated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setIsTokenDeprecated(null)
      return
    }

    const deprecatedTokens = (process.env.REACT_APP_DEPRECATED_TOKENS ?? '').split(',')

    setIsTokenDeprecated(deprecatedTokens.includes(normalizeTokenSymbol(token)))
  }, [token])

  return isTokenDeprecated
}

export default useCheckTokenDeprecated
