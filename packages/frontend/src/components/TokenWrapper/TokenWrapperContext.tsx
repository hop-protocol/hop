import React, { FC, createContext, useContext, useState, useMemo } from 'react'
import { Signer, BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import logger from 'src/logger'
import { formatError } from 'src/utils'
import { useTransactionReplacement } from 'src/hooks'
import { defaultL2Network } from 'src/config/networks'
import { useQuery } from 'react-query'

type TokenWrapperContextProps = {
  amount: string
  canonicalToken?: Token
  canonicalTokenBalance: BigNumber | undefined
  error: string | null | undefined
  isNativeToken: boolean
  isUnwrapping: boolean
  isWrapping: boolean
  selectedNetwork: Network
  setAmount: (amount: string) => void
  setError: (error: string | null | undefined) => void
  setSelectedNetwork: (network: Network) => void
  unwrap: () => void
  wrap: () => void
  wrappedToken?: Token
  wrappedTokenBalance: BigNumber | undefined
}

const TokenWrapperContext = createContext<TokenWrapperContextProps>({
  amount: '',
  canonicalToken: undefined,
  canonicalTokenBalance: undefined,
  error: undefined,
  isNativeToken: false,
  isUnwrapping: false,
  isWrapping: false,
  selectedNetwork: defaultL2Network,
  setAmount: (amount: string) => {},
  setError: (error: string | null | undefined) => {},
  setSelectedNetwork: (network: Network) => {},
  unwrap: () => {},
  wrap: () => {},
  wrappedToken: undefined,
  wrappedTokenBalance: undefined,
})

const TokenWrapperContextProvider: FC = ({ children }) => {
  const [amount, setAmount] = useState<string>('')
  const { txConfirm, selectedBridge } = useApp()
  const { provider, checkConnectedNetworkId, address } = useWeb3Context()
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(defaultL2Network)

  // TODO: mv to useBridges or new hook (useNetworkBridges)
  const canonicalToken = useMemo(() => {
    if (selectedNetwork?.slug) {
      return selectedBridge?.getCanonicalToken(selectedNetwork.slug)
    }
  }, [selectedBridge, selectedNetwork])
  const wrappedToken = useMemo(() => {
    return canonicalToken?.getWrappedToken()
  }, [canonicalToken])

  const signer = provider?.getSigner()
  const [isWrapping, setWrapping] = useState<boolean>(false)
  const [isUnwrapping, setUnwrapping] = useState<boolean>(false)
  const [error, setError] = useState<string | null | undefined>(null)
  const { waitForTransaction, addTransaction } = useTransactionReplacement()

  const isNativeToken =
    useMemo(() => {
      try {
        return canonicalToken?.isNativeToken
      } catch (err) {
        logger.error(err)
      }
      return false
    }, [canonicalToken]) ?? false

  const { data } = useQuery(
    [
      `tokenBalances:${canonicalToken?.address}:${wrappedToken?.address}:${address?.address}`,
      canonicalToken?.address,
      wrappedToken?.address,
      address?.address,
    ],
    async () => {
      const canonicalBalance = await canonicalToken?.balanceOf(address?.address)
      const wrappedBalance = await wrappedToken?.balanceOf(address?.address)
      return {
        canonicalBalance,
        wrappedBalance,
      }
    },
    {
      enabled: !!address?.address && !!canonicalToken && !!wrappedToken,
      refetchInterval: 5e3,
    }
  )

  const wrap = async () => {
    try {
      if (!selectedNetwork?.networkId) return
      const networkId = Number(selectedNetwork.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(null)
      setWrapping(true)
      if (!wrappedToken) {
        throw new Error('token is required')
      }
      if (!canonicalToken) {
        throw new Error('token is required')
      }
      if (!data?.canonicalBalance) {
        throw new Error('token is required')
      }
      if (!Number(amount)) {
        throw new Error('amount is required')
      }
      const parsedAmount = parseUnits(amount, canonicalToken.decimals)
      if (parsedAmount.gt(data?.canonicalBalance)) {
        throw new Error('not enough balance')
      }
      const tokenWrapTx = await txConfirm?.show({
        kind: 'wrapToken',
        inputProps: {
          source: {
            network: selectedNetwork,
          },
          token: {
            amount: amount,
            token: canonicalToken,
            network: selectedNetwork,
          },
        },
        onConfirm: async () => {
          return wrappedToken.connect(signer as Signer).wrapToken(parsedAmount)
        },
      })

      if (tokenWrapTx && selectedNetwork) {
        setAmount('')
        addTransaction(
          new Transaction({
            hash: tokenWrapTx.hash,
            networkName: selectedNetwork?.slug,
          })
        )

        await waitForTransaction(tokenWrapTx, { networkName: selectedNetwork?.slug })
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, selectedNetwork))
      }
    }
    setWrapping(false)
  }

  const unwrap = async () => {
    try {
      const networkId = Number(selectedNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(null)
      setUnwrapping(true)
      if (!wrappedToken) {
        throw new Error('token is required')
      }
      if (!data?.wrappedBalance) {
        throw new Error('token is required')
      }
      if (!Number(amount)) {
        throw new Error('amount is required')
      }
      const parsedAmount = parseUnits(amount, wrappedToken.decimals)
      if (parsedAmount.gt(data?.wrappedBalance)) {
        throw new Error('not enough balance')
      }
      const tokenUnwrapTx = await txConfirm?.show({
        kind: 'unwrapToken',
        inputProps: {
          source: {
            network: selectedNetwork,
          },
          token: {
            amount: amount,
            token: wrappedToken,
            network: selectedNetwork,
          },
        },
        onConfirm: async () => {
          return wrappedToken.connect(signer as Signer).unwrapToken(parsedAmount)
        },
      })

      if (tokenUnwrapTx && selectedNetwork) {
        setAmount('')
        addTransaction(
          new Transaction({
            hash: tokenUnwrapTx.hash,
            networkName: selectedNetwork?.slug,
          })
        )

        await waitForTransaction(tokenUnwrapTx, { networkName: selectedNetwork?.slug })
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, selectedNetwork))
      }
    }
    setUnwrapping(false)
  }

  return (
    <TokenWrapperContext.Provider
      value={{
        amount,
        canonicalToken,
        canonicalTokenBalance: data?.canonicalBalance,
        error,
        isNativeToken,
        isUnwrapping,
        isWrapping,
        selectedNetwork,
        setAmount,
        setError,
        setSelectedNetwork,
        unwrap,
        wrap,
        wrappedToken,
        wrappedTokenBalance: data?.wrappedBalance,
      }}
    >
      {children}
    </TokenWrapperContext.Provider>
  )
}

export const useTokenWrapper = () => useContext(TokenWrapperContext)

export default TokenWrapperContextProvider
