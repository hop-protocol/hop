import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { ethers, Signer, BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'
import Address from 'src/models/Address'
import Price from 'src/models/Price'
import { UINT256 } from 'src/constants'
import Transaction from 'src/models/Transaction'
import useInterval from 'src/hooks/useInterval'
import useBalance from 'src/hooks/useBalance'
import logger from 'src/logger'
import useApprove from 'src/hooks/useApprove'

type TokenWrapperContextProps = {
  amount: string,
  setAmount: (amount: string) => void,
  wrap: () => void,
  unwrap: () => void,
  isWrapping: boolean
  isUnwrapping: boolean
  selectedNetwork: Network | undefined,
  canonicalToken: Token | undefined
  canonicalTokenBalance: BigNumber | undefined,
  nativeTokenBalance: BigNumber | undefined,
  error: string | null | undefined,
  setError: (error: string | null | undefined) => void
}

const TokenWrapperContext = createContext<TokenWrapperContextProps>({
  amount: '',
  setAmount: (amount: string) => {},
  wrap: () => {},
  unwrap: () => {},
  isWrapping: false,
  isUnwrapping: false,
  selectedNetwork: undefined,
  canonicalToken: undefined,
  canonicalTokenBalance: undefined,
  nativeTokenBalance: undefined,
  error: undefined,
  setError: (error: string | null | undefined) => {}
})

const TokenWrapperContextProvider: FC = ({ children }) => {
  const [amount, setAmount] = useState<string>('')
  const {
    networks,
    txConfirm,
    txHistory,
    sdk,
    selectedBridge
  } = useApp()
  const { address, provider, checkConnectedNetworkId } = useWeb3Context()
  const l2Networks = useMemo(() => {
    return networks.filter(network => !network.isLayer1)
  }, [networks])
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(l2Networks[0])
  const canonicalToken = useMemo(() => {
    return selectedBridge?.getCanonicalToken(selectedNetwork.slug)
  }, [selectedBridge, selectedNetwork])
  const signer = provider?.getSigner()
  const [canonicalTokenBalance, setCanonicalTokenBalance] = useState<BigNumber | undefined>()
  const [nativeTokenBalance, setNativeTokenBalance] = useState<BigNumber | undefined>()
  const [isWrapping, setWrapping] = useState<boolean>(false)
  const [isUnwrapping, setUnwrapping] = useState<boolean>(false)
  const [error, setError] = useState<string | null | undefined>(null)

  const updateBalances = () => {
    canonicalToken
    ?.balanceOf()
    .then((balance) => {
      setCanonicalTokenBalance(balance)
    })
    .catch(err => {
      // logger.error(err)
    })
    canonicalToken
    ?.getNativeTokenBalance()
    .then((balance) => {
      setNativeTokenBalance(balance)
    })
    .catch(err => {
      // logger.error(err)
    })
  }

  useEffect(() => {
    updateBalances()
  }, [canonicalToken])
  useInterval(() => {
    updateBalances()
  }, 5 * 1000)
  useInterval(() => {
    updateBalances()
  }, 5 * 1000)

  const wrap = async () => {
    try {
      const networkId = Number(selectedNetwork.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(null)
      setWrapping(true)
      if (!canonicalToken) {
        throw new Error('token is required')
      }
      if (!nativeTokenBalance) {
        throw new Error('token is required')
      }
      if (!Number(amount)) {
        throw new Error('amount is required')
      }
      const parsedAmount = parseUnits(amount, canonicalToken.decimals)
      if (parsedAmount.gt(nativeTokenBalance)) {
        throw new Error('not enough balance')
      }
      const tokenWrapTx = await txConfirm?.show({
        kind: 'wrapToken',
        inputProps: {
          token: {
            amount: amount,
            token: canonicalToken,
            network: selectedNetwork
          }
        },
        onConfirm: async () => {
          const bridge = sdk.bridge(canonicalToken.symbol)
          return bridge
            .connect(signer as Signer)
            .wrapToken(
              parsedAmount,
              selectedNetwork.slug
            )
        }
      })

      if (tokenWrapTx) {
        setAmount('')
        if (tokenWrapTx.hash && selectedNetwork) {
          txHistory?.addTransaction(
            new Transaction({
              hash: tokenWrapTx.hash,
              networkName: selectedNetwork?.slug
            })
          )
        }
        await tokenWrapTx.wait()
      }
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
    }
    setWrapping(false)
  }

  const unwrap = async () => {
    try {
      const networkId = Number(selectedNetwork.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(null)
      setUnwrapping(true)
      if (!canonicalToken) {
        throw new Error('token is required')
      }
      if (!canonicalTokenBalance) {
        throw new Error('token is required')
      }
      if (!Number(amount)) {
        throw new Error('amount is required')
      }
      const parsedAmount = parseUnits(amount, canonicalToken.decimals)
      if (parsedAmount.gt(canonicalTokenBalance)) {
        throw new Error('not enough balance')
      }
      const tokenUnwrapTx = await txConfirm?.show({
        kind: 'unwrapToken',
        inputProps: {
          token: {
            amount: amount,
            token: canonicalToken,
            network: selectedNetwork
          }
        },
        onConfirm: async () => {
          const bridge = sdk.bridge(canonicalToken.symbol)
          return bridge
            .connect(signer as Signer)
            .unwrapToken(
              parsedAmount,
              selectedNetwork.slug
            )
        }
      })
      if (tokenUnwrapTx) {
        setAmount('')
        if (tokenUnwrapTx.hash && selectedNetwork) {
          txHistory?.addTransaction(
            new Transaction({
              hash: tokenUnwrapTx.hash,
              networkName: selectedNetwork?.slug
            })
          )
        }
        await tokenUnwrapTx.wait()
      }
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
    }
    setUnwrapping(false)
  }

  return (
    <TokenWrapperContext.Provider
      value={{
        amount,
        setAmount,
        wrap,
        unwrap,
        isWrapping,
        isUnwrapping,
        selectedNetwork,
        canonicalToken,
        canonicalTokenBalance,
        nativeTokenBalance,
        error,
        setError
      }}
    >
      {children}
    </TokenWrapperContext.Provider>
  )
}

export const useTokenWrapper = () => useContext(TokenWrapperContext)

export default TokenWrapperContextProvider
