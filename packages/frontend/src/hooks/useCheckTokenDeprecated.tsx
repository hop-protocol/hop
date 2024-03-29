import { deprecatedTokens } from 'src/config'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'
import { useEffect, useState } from 'react'

export function checkIsTokenDeprecated(token: string | undefined): boolean {
  return deprecatedTokens?.includes(normalizeTokenSymbol(token))
}

export const useCheckTokenDeprecated = (token: string | undefined): boolean | null => {
  const [isTokenDeprecated, setIsTokenDeprecated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setIsTokenDeprecated(null)
      return
    }

    setIsTokenDeprecated(checkIsTokenDeprecated(token))
  }, [token])

  return isTokenDeprecated
}
