import { useState, useEffect } from 'react'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'
import { deprecatedTokens } from 'src/config'

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
