import React, { FC, createContext, useContext, useState, useMemo, useEffect } from 'react'
import { Signer, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { useLocation } from 'react-router-dom'
import { HopBridge, Token as SDKToken } from '@hop-protocol/sdk'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { UINT256 } from 'src/constants'
import logger from 'src/logger'
import ConvertOption from 'src/pages/Convert/ConvertOption'
import AmmConvertOption from 'src/pages/Convert/ConvertOption/AmmConvertOption'
import HopConvertOption from 'src/pages/Convert/ConvertOption/HopConvertOption'
import NativeConvertOption from 'src/pages/Convert/ConvertOption/NativeConvertOption'
import useBalance from 'src/pages/Convert/useBalance'

type ConvertContextProps = {
  tokens: Token[]
  selectedToken: Token | undefined
  setSelectedToken: (token: Token) => void
  selectedBridge: HopBridge | undefined
  setSelectedBridge: (bridge: HopBridge) => void
  convertOptions: ConvertOption[]
  convertOption: ConvertOption | undefined
  networks: Network[]
  l2Networks: Network[]
  selectedNetwork: Network | undefined
  setSelectedNetwork: (network: Network | undefined) => void
  sourceNetwork: Network | undefined
  destNetwork: Network | undefined
  sourceTokenAmount: string | undefined
  setSourceTokenAmount: (value: string) => void
  destTokenAmount: string | undefined
  setDestTokenAmount: (value: string) => void
  convertTokens: () => void
  validFormFields: boolean
  calcAltTokenAmount: (value: string) => Promise<string>
  sending: boolean
  sendButtonText: string
  sourceBalance: BigNumber | undefined
  loadingSourceBalance: boolean
  destBalance: BigNumber | undefined
  loadingDestBalance: boolean
  switchDirection: () => void
  error: string | undefined
  setError: (error: string | undefined) => void
  tx: Transaction | undefined
  setTx: (tx: Transaction | undefined) => void
}

const ConvertContext = createContext<ConvertContextProps>({
  tokens: [],
  selectedToken: undefined,
  setSelectedToken: (token: Token) => {},
  selectedBridge: undefined,
  setSelectedBridge: (bridge: HopBridge) => {},
  convertOptions: [],
  convertOption: undefined,
  networks: [],
  l2Networks: [],
  selectedNetwork: undefined,
  setSelectedNetwork: (network: Network | undefined) => {},
  sourceNetwork: undefined,
  destNetwork: undefined,
  sourceTokenAmount: undefined,
  setSourceTokenAmount: (value: string) => {},
  destTokenAmount: undefined,
  setDestTokenAmount: (value: string) => {},
  convertTokens: () => {},
  validFormFields: false,
  calcAltTokenAmount: async (value: string): Promise<string> => '',
  sending: false,
  sendButtonText: '',
  sourceBalance: undefined,
  loadingSourceBalance: false,
  destBalance: undefined,
  loadingDestBalance: false,
  switchDirection: () => {},
  error: undefined,
  setError: (error: string | undefined) => {},
  tx: undefined,
  setTx: (tx: Transaction | undefined) => {},
})

const ConvertContextProvider: FC = ({ children }) => {
  const { provider, checkConnectedNetworkId } = useWeb3Context()
  const app = useApp()
  const { user, networks, tokens, bridges, txConfirm, sdk, l1Network } = app
  const { pathname } = useLocation()
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const [selectedBridge, setSelectedBridge] = useState<HopBridge>()

  useEffect(() => {
    const newSelectedBridge = bridges.find(_bridge => {
      return _bridge.getTokenSymbol() === selectedToken.symbol
    })

    if (newSelectedBridge) {
      setSelectedBridge(newSelectedBridge)
    }
  }, [bridges, selectedToken, setSelectedBridge])

  const convertOptions = useMemo(() => {
    return [
      new AmmConvertOption(),
      new HopConvertOption(),
      new NativeConvertOption()
    ]
  }, [])
  const convertOption = useMemo(() => {
    return convertOptions.find(option =>
      pathname.includes(option.path)
    ) || convertOptions[0]
  }, [pathname])
  const l2Networks = networks.filter((network: Network) => !network.isLayer1)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(
    l2Networks[0]
  )
  const [isForwardDirection, setIsForwardDirection] = useState(true)
  const switchDirection = () => {
    setIsForwardDirection(!isForwardDirection)
  }
  const sourceNetwork = useMemo<Network | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || !isForwardDirection) {
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isForwardDirection, selectedNetwork, l1Network, convertOption])
  const destNetwork = useMemo<Network | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || isForwardDirection) {
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isForwardDirection, selectedNetwork, l1Network, convertOption])
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('')
  const [destTokenAmount, setDestTokenAmount] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)

  const [sourceToken, setSourceToken] = useState<SDKToken>()
  const [destToken, setDestToken] = useState<SDKToken>()

  useEffect(() => {
    const fetchToken = async () => {
      const token = await convertOption.sourceToken(isForwardDirection, selectedNetwork, selectedBridge)
      setSourceToken(token)
    }

    fetchToken()
  }, [user, convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  useEffect(() => {
    const fetchToken = async () => {
      const token = await convertOption.destToken(isForwardDirection, selectedNetwork, selectedBridge)
      setDestToken(token)
    }

    fetchToken()
  }, [user, convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  const { balance: sourceBalance, loading: loadingSourceBalance } = useBalance(
    sourceToken,
    sourceNetwork
  )
  const { balance: destBalance, loading: loadingDestBalance } = useBalance(
    destToken,
    destNetwork
  )
  const [error, setError] = useState<string | undefined>(undefined)
  const [tx, setTx] = useState<Transaction | undefined>()

  const calcAltTokenAmount = async (value: string) => {
    if (value) {
      if (!sourceNetwork) {
        return ''
      }
      if (!destNetwork) {
        return ''
      }
      if (sourceNetwork.isLayer1) {
        return value
      }
      if (!sourceNetwork.slug) {
        return value
      }
      if (convertOption instanceof AmmConvertOption) {
        const amount = parseUnits(value, selectedToken.decimals)
        const bridge = sdk.bridge(selectedToken?.symbol)
        const amountOut = await bridge.getAmountOut(
          amount,
          sourceNetwork.slug,
          destNetwork.slug
        )

        value = Number(
          formatUnits(amountOut.toString(), selectedToken.decimals)
        ).toFixed(2)
      }
    }

    return value
  }

  const approveTokens = async (): Promise<any> => {
    if (!sourceToken) {
      throw new Error('No source token selected')
    }

    const targetAddress = await convertOption.getTargetAddress(
      sdk,
      sourceToken,
      sourceNetwork
    )

    const parsedAmount = parseUnits(sourceTokenAmount, sourceToken.decimals)
    const approved = await sourceToken.allowance(
      targetAddress
    )

    let tx: any
    if (approved.lt(parsedAmount)) {
      tx = await txConfirm?.show({
        kind: 'approval',
        inputProps: {
          sourceTokenAmount,
          tokenSymbol: sourceToken.symbol
        },
        onConfirm: async (approveAll: boolean) => {
          const approveAmount = approveAll ? UINT256 : parsedAmount
          return sourceToken.approve(
            targetAddress,
            approveAmount
          )
        }
      })
    }

    if (tx?.hash && sourceNetwork) {
      app?.txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: sourceNetwork.slug
        })
      )
    }
    await tx?.wait()
    return tx
  }

  const convertTokens = async () => {
    try {
      setTx(undefined)
      const networkId = Number(sourceNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(undefined)
      if (
        !Number(sourceTokenAmount) ||
        !sourceNetwork ||
        !destNetwork
      ) {
        return
      }

      setSending(true)

      const signer = provider?.getSigner()
      const value = parseUnits(
        sourceTokenAmount,
        selectedToken.decimals
      ).toString()
      const bridge = sdk.bridge(selectedToken?.symbol).connect(signer as Signer)
      const l1Bridge = await bridge.getL1Bridge()
      const isCanonicalTransfer = false

      const tx = await txConfirm?.show({
        kind: 'convert',
        inputProps: {
          source: {
            amount: sourceTokenAmount,
            token: selectedToken
          },
          dest: {
            amount: destTokenAmount,
            token: selectedToken
          }
        },
        onConfirm: async () => {
          await approveTokens()

          convertOption.convert(
            sdk,
            signer as Signer,
            sourceNetwork,
            destNetwork,
            isForwardDirection,
            selectedToken,
            value
          )
        }
      })

      if (tx?.hash && sourceNetwork?.name) {
        const txObj = new Transaction({
            hash: tx?.hash,
            networkName: sourceNetwork.slug,
            destNetworkName: destNetwork.slug,
            token: selectedToken,
            isCanonicalTransfer
          })
        // don't set tx status modal if it's tx to the same chain
        if (sourceNetwork.isLayer1 !== destNetwork?.isLayer1) {
          setTx(txObj)
        }
        app?.txHistory?.addTransaction(
          txObj
        )
      }
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
    }

    setSending(false)
  }

  const enoughBalance = Number(sourceBalance) >= Number(sourceTokenAmount)
  const withinMax = true
  let sendButtonText = 'Convert'
  const validFormFields = !!(
    sourceTokenAmount &&
    destTokenAmount &&
    enoughBalance &&
    withinMax
  )
  if (sourceBalance === undefined) {
    sendButtonText = 'Fetching balance...'
  } else if (!enoughBalance) {
    sendButtonText = 'Insufficient funds'
  }

  return (
    <ConvertContext.Provider
      value={{
        tokens,
        selectedToken,
        setSelectedToken,
        selectedBridge,
        setSelectedBridge,
        convertOptions,
        convertOption,
        networks,
        l2Networks,
        selectedNetwork,
        setSelectedNetwork,
        sourceNetwork,
        destNetwork,
        sourceTokenAmount,
        setSourceTokenAmount,
        destTokenAmount,
        setDestTokenAmount,
        convertTokens,
        validFormFields,
        calcAltTokenAmount,
        sending,
        sendButtonText,
        sourceBalance,
        loadingSourceBalance,
        destBalance,
        loadingDestBalance,
        switchDirection,
        error,
        setError,
        tx,
        setTx
      }}
    >
      {children}
    </ConvertContext.Provider>
  )
}

export const useConvert = () => useContext(ConvertContext)

export default ConvertContextProvider
