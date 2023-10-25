import { useState, useEffect } from 'react'

export default function useCurrentPathSending(lastPathSent: string | null, sending: boolean, fromTokenAmount: string | undefined, fromNetworkSlug: string | undefined, toNetworkSlug: string | undefined, sourceTokenSymbol: string | undefined): boolean {
  const [currentPathSending, setCurrentPathSending] = useState(sending ?? false)

  useEffect(() => {
    if (!lastPathSent) {
      return
    }

    const parsed = JSON.parse(lastPathSent)
    if (!parsed || !('from' in parsed) || !('to' in parsed) || !('symbol' in parsed) || !('amount' in parsed)) {
      throw new Error('Invalid JSON structure')
    }
    const { from, to, symbol, amount } = parsed

    // current path is sending if a sending transaction is active, the token amount field is blank, and all other fields are the same as the last tx
    const isCurrentPathSending = (sending && fromTokenAmount === '' && from === fromNetworkSlug && to === toNetworkSlug && symbol === sourceTokenSymbol)

    setCurrentPathSending(isCurrentPathSending)
  }, [lastPathSent, sending, fromTokenAmount, fromNetworkSlug, toNetworkSlug, sourceTokenSymbol])

  return currentPathSending
}
