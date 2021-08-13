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
  address: Addressish,
) => {
  const [balance, setBalance] = useState<BigNumber>()
  const [loading, setLoading] = useState(false)
  const currentToken = useRef<Token>()
  const currentNetwork = useRef<Network>()
  const debouncer = useRef<number>(0)

  const getBalance = useCallback(() => {
    const _getBalance = async () => {
      if (token && network && address) {
        if (
          (currentNetwork.current && !network.eq(currentNetwork.current)) ||
          (currentToken.current && !token.eq(currentToken.current))
        ) {
          setLoading(true)
        }

        const ctx = ++debouncer.current
        const _balance = await token.balanceOf(address.toString())

        if (ctx === debouncer.current) {
          setBalance(_balance as BigNumber)
          setLoading(false)
        }
      } else {
        setBalance(undefined)
        setLoading(false)
      }
      currentToken.current = token
      currentNetwork.current = network
    }

    _getBalance().catch(logger.error)
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
