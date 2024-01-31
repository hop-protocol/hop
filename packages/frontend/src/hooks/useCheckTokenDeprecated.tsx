import { deprecatedTokens } from 'src/config'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'
import { useEffect, useState } from 'react'

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
