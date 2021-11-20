import { useState, useRef, useEffect, useCallback } from 'react'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import logger from 'src/logger'
import useInterval from 'src/hooks/useInterval'
import { Addressish } from 'src/models/Address'

const useBalance = (
  token: Token | undefined,
  network: Network | undefined,
  address: Addressish
) => {
  const [balance, setBalance] = useState<BigNumber>()
  const [loading, setLoading] = useState(false)
  const currentToken = useRef<Token>()
  const currentNetwork = useRef<Network>()

  const getBalance = useCallback(() => {
    let isSubscribed = true
    const _getBalance = async () => {
      if (token && network && address) {
        if (
          (currentNetwork.current && !network.eq(currentNetwork.current)) ||
          (currentToken.current && !token.eq(currentToken.current))
        ) {
          setLoading(true)
        }

        const _balance = await token.balanceOf(address.toString())

        if (isSubscribed) {
          setBalance(_balance as BigNumber)
          setLoading(false)
        }
      } else {
        if (isSubscribed) {
          setBalance(undefined)
          setLoading(false)
        }
      }
      if (isSubscribed) {
        currentToken.current = token
        currentNetwork.current = network
      }
    }

    _getBalance().catch(logger.error)

    return () => {
      isSubscribed = false
    }
  }, [token, network, address])

  useEffect(() => {
    getBalance()
  }, [token, network, address])

  useInterval(() => {
    getBalance()
  }, 8e3)

  return { balance, loading }
}

export default useBalance
