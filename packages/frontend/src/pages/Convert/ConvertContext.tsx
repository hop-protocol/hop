import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
} from 'react'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useLocation } from 'react-router-dom'
import { Token } from '@hop-protocol/sdk'
import find from 'lodash/find'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import ConvertOption from 'src/pages/Convert/ConvertOption/ConvertOption'
import AmmConvertOption from 'src/pages/Convert/ConvertOption/AmmConvertOption'
import HopConvertOption from 'src/pages/Convert/ConvertOption/HopConvertOption'
import useBalance from 'src/hooks/useBalance'
import { toTokenDisplay } from 'src/utils'
import useApprove from 'src/hooks/useApprove'
import useQueryParams from 'src/hooks/useQueryParams'
import { reactAppNetwork } from 'src/config'

type ConvertContextProps = {
  convertOptions: ConvertOption[]
  convertOption: ConvertOption | undefined
  networks: Network[]
  l2Networks: Network[]
  selectedNetwork: Network | undefined
  setSelectedNetwork: (network: Network | undefined) => void
  sourceNetwork: Network | undefined
  destNetwork: Network | undefined
  sourceToken: Token | undefined
  destToken: Token | undefined
  sourceTokenAmount: string | undefined
  setSourceTokenAmount: (value: string) => void
  destTokenAmount: string | undefined
  setDestTokenAmount: (value: string) => void
  convertTokens: () => void
  approveTokens: () => void
  validFormFields: boolean
  sending: boolean
  approving: boolean
  needsApproval: boolean | undefined
  sendButtonText: string
  sourceBalance: BigNumber | undefined
  loadingSourceBalance: boolean
  destBalance: BigNumber | undefined
  loadingDestBalance: boolean
  switchDirection: () => void
  details: ReactNode | undefined
  warning: ReactNode | undefined
  error: string | undefined
  setError: (error: string | undefined) => void
  tx: Transaction | undefined
  setTx: (tx: Transaction | undefined) => void
  unsupportedAsset: any
}

const ConvertContext = createContext<ConvertContextProps>({
  convertOptions: [],
  convertOption: undefined,
  networks: [],
  l2Networks: [],
  selectedNetwork: undefined,
  setSelectedNetwork: (network: Network | undefined) => {},
  sourceNetwork: undefined,
  destNetwork: undefined,
  sourceToken: undefined,
  destToken: undefined,
  sourceTokenAmount: undefined,
  setSourceTokenAmount: (value: string) => {},
  destTokenAmount: undefined,
  setDestTokenAmount: (value: string) => {},
  convertTokens: () => {},
  approveTokens: () => {},
  validFormFields: false,
  sending: false,
  approving: false,
  needsApproval: false,
  sendButtonText: '',
  sourceBalance: undefined,
  loadingSourceBalance: false,
  destBalance: undefined,
  loadingDestBalance: false,
  switchDirection: () => {},
  details: [],
  warning: undefined,
  error: undefined,
  setError: (error: string | undefined) => {},
  tx: undefined,
  setTx: (tx: Transaction | undefined) => {},
  unsupportedAsset: null,
})

const ConvertContextProvider: FC = ({ children }) => {
  const { provider, checkConnectedNetworkId, address } = useWeb3Context()
  const {
    networks,
    txHistory,
    l2Networks,
    defaultL2Network,
    selectedBridge,
    txConfirm,
    sdk,
    l1Network,
    settings,
  } = useApp()
  const { slippageTolerance, deadline } = settings
  const { pathname } = useLocation()
  const { queryParams } = useQueryParams()
  const { approve, checkApproval } = useApprove()

  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(l2Networks[0])
  const [isForwardDirection, setIsForwardDirection] = useState(true)
  const switchDirection = () => {
    setIsForwardDirection(!isForwardDirection)
  }
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('')
  const [destTokenAmount, setDestTokenAmount] = useState<string>('')
  const [amountOutMin, setAmountOutMin] = useState<BigNumber>()
  const [sending, setSending] = useState<boolean>(false)
  const [approving, setApproving] = useState<boolean>(false)
  const [sourceToken, setSourceToken] = useState<Token>()
  const [destToken, setDestToken] = useState<Token>()
  const [details, setDetails] = useState<ReactNode>()
  const [warning, setWarning] = useState<ReactNode>()
  const [bonderFee, setBonderFee] = useState<BigNumber>()
  const [error, setError] = useState<string | undefined>(undefined)
  const [tx, setTx] = useState<Transaction | undefined>()
  const debouncer = useRef(0)

  useEffect(() => {
    if (selectedNetwork && queryParams?.sourceNetwork !== selectedNetwork?.slug) {
      const matchingNetwork = find(networks, ['slug', queryParams.sourceNetwork])
      if (matchingNetwork && !matchingNetwork?.isLayer1) {
        setSelectedNetwork(matchingNetwork)
      } else {
        setSelectedNetwork(defaultL2Network)
      }
    }
  }, [queryParams])

  const convertOptions = [new AmmConvertOption(), new HopConvertOption()]
  const convertOption = useMemo(
    () => find(convertOptions, option => pathname.includes(option.path)) || convertOptions[0],
    [pathname]
  )

  const sourceNetwork = useMemo<Network | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || !isForwardDirection) {
      if (selectedNetwork?.isLayer1) {
        return defaultL2Network
      }
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isForwardDirection, selectedNetwork, l1Network, convertOption])

  const destNetwork = useMemo<Network | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || isForwardDirection) {
      if (selectedNetwork?.isLayer1) {
        return defaultL2Network
      }
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isForwardDirection, selectedNetwork, l1Network, convertOption])

  const { balance: sourceBalance, loading: loadingSourceBalance } = useBalance(
    sourceToken,
    sourceNetwork,
    address
  )
  const { balance: destBalance, loading: loadingDestBalance } = useBalance(
    destToken,
    destNetwork,
    address
  )

  const unsupportedAsset = useMemo<any>(() => {
    if (!(selectedBridge && selectedNetwork)) {
      return null
    }
    const unsupportedAssets = {
      Optimism: reactAppNetwork === 'kovan' ? [] : ['MATIC'],
      Arbitrum: reactAppNetwork === 'kovan' ? [] : ['MATIC'],
    }

    const selectedTokenSymbol = selectedBridge?.getTokenSymbol()
    for (const chain in unsupportedAssets) {
      const tokenSymbols = unsupportedAssets[chain]
      for (const tokenSymbol of tokenSymbols) {
        const isUnsupported =
          selectedTokenSymbol.includes(tokenSymbol) && selectedNetwork?.slug === chain.toLowerCase()
        if (isUnsupported) {
          return {
            chain,
            tokenSymbol,
          }
        }
      }
    }

    return null
  }, [selectedBridge, selectedNetwork])

  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else {
      setError('')
    }
  }, [unsupportedAsset])

  // Fetch source token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await convertOption.sourceToken(
          isForwardDirection,
          selectedNetwork,
          selectedBridge
        )
        setSourceToken(token)
      } catch (err) {
        logger.error(err)
        setSourceToken(undefined)
      }
    }

    console.log(`selectedNetwork:`, selectedNetwork);
    fetchToken()
  }, [convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  // Fetch destination token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await convertOption.destToken(
          isForwardDirection,
          selectedNetwork,
          selectedBridge
        )
        setDestToken(token)
      } catch (err) {
        logger.error(err)
        setDestToken(undefined)
      }
    }

    fetchToken()
  }, [convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  // Fetch send data
  useEffect(() => {
    const getSendData = async () => {
      if (!selectedBridge || !sourceTokenAmount || !sourceNetwork || !destNetwork || !sourceToken) {
        setDestTokenAmount('')
        return
      }

      const ctx = ++debouncer.current

      const { amountOut, details, warning, bonderFee } = await convertOption.getSendData(
        sdk,
        sourceNetwork,
        destNetwork,
        isForwardDirection,
        selectedBridge.getTokenSymbol(),
        parsedSourceTokenAmount
      )

      let formattedAmount = ''
      if (amountOut) {
        formattedAmount = toTokenDisplay(amountOut, sourceToken.decimals)
      }

      let _amountOutMin
      if (amountOut) {
        // amountOutMin only used for AMM option
        const slippageToleranceBps = slippageTolerance * 100
        const minBps = Math.ceil(10000 - slippageToleranceBps)
        _amountOutMin = amountOut.mul(minBps).div(10000)
      }

      if (ctx !== debouncer.current) return

      setError(undefined)
      setDestTokenAmount(formattedAmount)
      setAmountOutMin(_amountOutMin)
      setDetails(details)
      setWarning(warning)
      setBonderFee(bonderFee)
    }

    getSendData().catch(logger.error)
  }, [sourceTokenAmount, selectedBridge, selectedNetwork, convertOption, isForwardDirection])

  const needsApproval = useAsyncMemo(async () => {
    try {
      if (!(selectedBridge && sourceToken && destNetwork)) {
        return false
      }

      const targetAddress = await convertOption.getTargetAddress(
        sdk,
        selectedBridge?.getTokenSymbol(),
        sourceNetwork,
        destNetwork
      )

      return checkApproval(parsedSourceTokenAmount, sourceToken, targetAddress)
    } catch (err: any) {
      logger.error(err)
    }
  }, [convertOption, sdk, selectedBridge, sourceNetwork, destNetwork, checkApproval])

  const parsedSourceTokenAmount = useMemo(() => {
    if (!sourceTokenAmount || !sourceToken) {
      return BigNumber.from(0)
    }

    return parseUnits(sourceTokenAmount, sourceToken.decimals)
  }, [sourceTokenAmount, sourceToken])

  // ===============================================================================================
  // Transactions
  // ===============================================================================================
  const approveTokens = async (): Promise<any> => {
    try {
      const networkId = Number(sourceNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return
      setError(undefined)
      setApproving(true)
      if (!sourceToken) {
        throw new Error('No source token selected')
      }

      const targetAddress = await convertOption.getTargetAddress(
        sdk,
        selectedBridge?.getTokenSymbol(),
        sourceNetwork,
        destNetwork
      )

      const tx = await approve(parsedSourceTokenAmount, sourceToken, targetAddress)
      await tx?.wait()
      setApproving(false)
      return tx
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
      setApproving(false)
    }
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
        !destNetwork ||
        !sourceToken ||
        !selectedBridge
      ) {
        return
      }

      setSending(true)

      const signer = provider?.getSigner()
      const value = parseUnits(sourceTokenAmount, sourceToken.decimals).toString()
      const l1Bridge = await selectedBridge.getL1Bridge()
      const isCanonicalTransfer = false

      const tx = await txConfirm?.show({
        kind: 'convert',
        inputProps: {
          source: {
            amount: sourceTokenAmount,
            token: sourceToken,
          },
          dest: {
            amount: destTokenAmount,
            token: destToken,
          },
        },
        onConfirm: async () => {
          await approveTokens()

          if (!selectedBridge || !signer || !sourceToken || !amountOutMin) {
            throw new Error('Missing convert param')
          }

          return convertOption.convert(
            sdk,
            signer,
            sourceNetwork,
            destNetwork,
            isForwardDirection,
            selectedBridge.getTokenSymbol(),
            value,
            amountOutMin,
            deadline(),
            bonderFee
          )
        },
      })

      if (tx?.hash && sourceNetwork?.name) {
        const txObj = new Transaction({
          hash: tx?.hash,
          networkName: sourceNetwork.slug,
          destNetworkName: destNetwork.slug,
          token: sourceToken,
          isCanonicalTransfer,
        })
        // don't set tx status modal if it's tx to the same chain
        if (sourceNetwork.isLayer1 !== destNetwork?.isLayer1) {
          setTx(txObj)
        }
        txHistory?.addTransaction(txObj)
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
    }

    setSending(false)
  }

  const enoughBalance = sourceBalance?.gte(parsedSourceTokenAmount)
  const withinMax = true
  let sendButtonText = 'Convert'
  const validFormFields = !!(sourceTokenAmount && destTokenAmount && enoughBalance && withinMax)
  if (sourceBalance === undefined) {
    sendButtonText = 'Fetching balance...'
  } else if (!enoughBalance) {
    sendButtonText = 'Insufficient funds'
  }

  return (
    <ConvertContext.Provider
      value={{
        convertOptions,
        convertOption,
        networks,
        l2Networks,
        selectedNetwork,
        setSelectedNetwork,
        sourceNetwork,
        destNetwork,
        sourceToken,
        destToken,
        sourceTokenAmount,
        setSourceTokenAmount,
        destTokenAmount,
        setDestTokenAmount,
        convertTokens,
        approveTokens,
        validFormFields,
        sending,
        approving,
        needsApproval,
        sendButtonText,
        sourceBalance,
        loadingSourceBalance,
        destBalance,
        loadingDestBalance,
        switchDirection,
        details,
        warning,
        error,
        setError,
        tx,
        setTx,
        unsupportedAsset,
      }}
    >
      {children}
    </ConvertContext.Provider>
  )
}

export const useConvert = () => useContext(ConvertContext)

export default ConvertContextProvider
