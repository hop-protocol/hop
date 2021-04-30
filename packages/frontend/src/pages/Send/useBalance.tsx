import { useState, useRef, useEffect, useCallback } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { useApp } from 'src/contexts/AppContext'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import logger from 'src/logger'
import useInterval from 'src/hooks/useInterval'

const useBalance = (token: Token | undefined, network: Network | undefined) => {
  const { user } = useApp()
  const [balance, setBalance] = useState('')
  const [loadingBalance, setLoadingBalance] = useState(false)
  const currentToken = useRef<Token>()
  const currentNetwork = useRef<Network>()

  const getBalance = useCallback(() => {
    const _getBalance = async () => {
      if (user && token && network) {
        if (
          (currentNetwork.current && !network.eq(currentNetwork.current))
          || (currentToken.current && !token.eq(currentToken.current))
        ) {
          setLoadingBalance(true)
        }

        try {
          const _balance = await user.getBalance(token, network)
          setBalance(formatUnits(_balance.toString(), token.decimals))
        } catch (err) {
          setBalance('')
          throw err
        }
      } else {
        setBalance('')
      }

      setLoadingBalance(false)
      currentToken.current = token
      currentNetwork.current = network
    }

    _getBalance().catch(logger.error)
  }, [user, token, network])

  useEffect(() => {
    getBalance()
  }, [user, token, network])

  useInterval(() => {
    getBalance()
  }, 5e3)

  return { balance, loadingBalance }
}

export default useBalance
