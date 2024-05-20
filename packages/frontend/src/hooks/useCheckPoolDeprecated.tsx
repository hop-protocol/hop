import { checkIsTokenDeprecated } from './useCheckTokenDeprecated.js'
import { deprecatedPools } from '#config/index.js'
import { normalizeTokenSymbol } from '#utils/normalizeTokenSymbol.js'
import { useEffect, useState } from 'react'

export function checkIsPoolDeprecated(token: string | undefined): boolean {
  return checkIsTokenDeprecated(token) || deprecatedPools?.includes(normalizeTokenSymbol(token))
}

export const useCheckPoolDeprecated = (token: string | undefined): boolean | null => {
  const [isPoolDeprecated, setIsPoolDeprecated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setIsPoolDeprecated(null)
      return
    }

    setIsPoolDeprecated(checkIsPoolDeprecated(token))
  }, [token])

  return isPoolDeprecated
}
