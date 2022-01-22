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
import { toTokenDisplay, commafy, findNetworkBySlug } from 'src/utils'
import { hopAppNetwork } from 'src/config'
import { defaultL2Network, l1Network } from 'src/config/networks'
import {
  useTransactionReplacement,
  useApprove,
  useQueryParams,
  useBalance,
  useNeedsTokenForFee,
} from 'src/hooks'
import { formatError, amountToBN } from 'src/utils/format'

type ConvertContextProps = {
  approveTokens: () => void
  approving: boolean
  convertOptions: ConvertOption[]
  convertTokens: () => void
  destBalance: BigNumber | undefined
  destNetwork: Network | undefined
  destToken: Token | undefined
  destTokenAmount: string | undefined
  details: ReactNode | undefined
  error: string | undefined
  loadingDestBalance: boolean
  loadingSourceBalance: boolean
  needsApproval: boolean | undefined
  needsTokenForFee: boolean | undefined
  selectedNetwork: Network | undefined
  sending: boolean
  setDestTokenAmount: (value: string) => void
  setError: (error: string | undefined) => void
  setSelectedNetwork: (network: Network) => void
  setSourceTokenAmount: (value: string) => void
  setTx: (tx: Transaction | undefined) => void
  setWarning: (warning: string | undefined) => void
  sourceBalance: BigNumber | undefined
  sourceNetwork: Network | undefined
  sourceToken: Token | undefined
  sourceTokenAmount: string | undefined
  switchDirection: () => void
  tx: Transaction | undefined
  unsupportedAsset: any
  validFormFields: boolean
  warning: ReactNode | undefined
}

const ConvertContext = createContext<ConvertContextProps>({
  approveTokens: () => {},
  approving: false,
  convertOptions: [],
  convertTokens: () => {},
  destBalance: undefined,
  destNetwork: undefined,
  destToken: undefined,
  destTokenAmount: undefined,
  details: [],
  error: undefined,
  loadingDestBalance: false,
  loadingSourceBalance: false,
  needsApproval: false,
  needsTokenForFee: undefined,
  selectedNetwork: undefined,
  sending: false,
  setDestTokenAmount: (value: string) => {},
  setError: (error: string | undefined) => {},
  setSelectedNetwork: (network: Network) => {},
  setSourceTokenAmount: (value: string) => {},
  setTx: (tx: Transaction | undefined) => {},
  setWarning: (warning: string | undefined) => {},
  sourceBalance: undefined,
  sourceNetwork: undefined,
  sourceToken: undefined,
  sourceTokenAmount: undefined,
  switchDirection: () => {},
  tx: undefined,
  unsupportedAsset: null,
  validFormFields: false,
  warning: undefined,
})

const ConvertContextProvider: FC = ({ children }) => {
  const { provider, checkConnectedNetworkId, address } = useWeb3Context()
  const { selectedBridge, txConfirm, sdk, settings } = useApp()
  const { slippageTolerance, deadline } = settings
  const { pathname } = useLocation()
  const { queryParams } = useQueryParams()

  const [selectedNetwork, setSelectedNetwork] = useState<Network>(defaultL2Network)
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
  const { approve, checkApproval } = useApprove(sourceToken)
  const [destToken, setDestToken] = useState<Token>()
  const [details, setDetails] = useState<ReactNode>()
  let [warning, setWarning] = useState<ReactNode>()
  const [bonderFee, setBonderFee] = useState<BigNumber>()
  const [error, setError] = useState<string | undefined>(undefined)
  const [tx, setTx] = useState<Transaction | undefined>()
  const debouncer = useRef(0)
  const { waitForTransaction, addTransaction } = useTransactionReplacement()

  useEffect(() => {
    if (selectedNetwork && queryParams?.sourceNetwork !== selectedNetwork?.slug) {
      const matchingNetwork = findNetworkBySlug(queryParams.sourceNetwork as string)
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
      Optimism: hopAppNetwork === 'kovan' ? [] : ['MATIC'],
      Arbitrum: hopAppNetwork === 'kovan' ? [] : ['MATIC'],
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

  const needsTokenForFee = useNeedsTokenForFee(sourceNetwork)

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

    if (unsupportedAsset?.chain) {
      return
    }

    fetchToken()
  }, [unsupportedAsset, convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  useEffect(() => {
    if (tx) {
      // clear source token input field
      setSourceTokenAmount('')
    }
  }, [tx])

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

    if (unsupportedAsset?.chain) {
      return
    }

    fetchToken()
  }, [unsupportedAsset, convertOption, isForwardDirection, selectedNetwork, selectedBridge])

  // Fetch send data
  useEffect(() => {
    const getSendData = async () => {
      setWarning(undefined)
      setAmountOutMin(undefined)
      setDetails(undefined)
      setBonderFee(undefined)

      if (
        !(
          selectedBridge &&
          sourceTokenAmount &&
          sourceNetwork &&
          destNetwork &&
          sourceToken &&
          !unsupportedAsset?.chain
        )
      ) {
        setDestTokenAmount('')
        return
      }

      const ctx = ++debouncer.current

      const { amountOut, details, bonderFee, warning } = await convertOption.getSendData(
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

      if (ctx !== debouncer.current) {
        return
      }

      setError(undefined)
      setWarning(warning)
      setDestTokenAmount(formattedAmount)
      setAmountOutMin(_amountOutMin)
      setDetails(details)
      setBonderFee(bonderFee)
    }

    getSendData().catch(logger.error)
  }, [
    unsupportedAsset,
    sourceTokenAmount,
    selectedBridge,
    selectedNetwork,
    convertOption,
    isForwardDirection,
  ])

  useEffect(() => {
    // NOTE: `convertOption.getSendData()` returns jsx code via the AmmConvertOption class.
    // This works for now, but we should convert AmmConvertOption Class -> React.FC w/ hooks
    if (details && (details as any).props?.children?.props?.tooltip?.props?.priceImpact) {
      const priceImpact = (details as any).props?.children?.props?.tooltip?.props?.priceImpact
      if (priceImpact && priceImpact !== 100 && (priceImpact >= 1 || priceImpact <= -1)) {
        const warning = `Warning: High Price Impact! ${commafy(priceImpact)}%`
        setWarning(warning)
      }
    }
  }, [details])

  const needsApproval = useAsyncMemo(async () => {
    try {
      if (!(selectedBridge && sourceToken && destNetwork && !unsupportedAsset?.chain)) {
        return false
      }

      const targetAddress = await convertOption.getTargetAddress(
        sdk,
        selectedBridge?.getTokenSymbol(),
        sourceNetwork
      )

      return checkApproval(parsedSourceTokenAmount, sourceToken, targetAddress)
    } catch (err: any) {
      logger.error(err)
    }
  }, [
    unsupportedAsset,
    convertOption,
    sdk,
    selectedBridge,
    sourceNetwork,
    destNetwork,
    checkApproval,
  ])

  const parsedSourceTokenAmount = useMemo(() => {
    if (!sourceTokenAmount || !sourceToken) {
      return BigNumber.from(0)
    }

    return amountToBN(sourceTokenAmount, sourceToken.decimals)
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
        sourceNetwork
      )

      const tx = await approve(parsedSourceTokenAmount, sourceToken, targetAddress)
      await tx?.wait()
      setApproving(false)
      return tx
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, selectedNetwork))
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
      const value = amountToBN(sourceTokenAmount, sourceToken.decimals).toString()
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
        const txModelArgs = {
          networkName: sourceNetwork.slug,
          destNetworkName: destNetwork.slug,
          token: sourceToken,
          isCanonicalTransfer,
        }
        const txObj = new Transaction({
          hash: tx?.hash,
          ...txModelArgs,
        })
        // don't set tx status modal if it's tx to the same chain
        if (sourceNetwork.isLayer1 !== destNetwork?.isLayer1) {
          setTx(txObj)
        }
        addTransaction(txObj)

        const res = await waitForTransaction(tx, txModelArgs)
        if (res && 'replacementTxModel' in res) {
          if (sourceNetwork.isLayer1 !== destNetwork?.isLayer1) {
            setTx(res.replacementTxModel)
          }
        }
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, selectedNetwork))
      }
      logger.error(err)
    }

    setSending(false)
  }

  const enoughBalance = sourceBalance?.gte(parsedSourceTokenAmount)
  const withinMax = true
  const validFormFields =
    !!(sourceTokenAmount && destTokenAmount && enoughBalance && withinMax) && !!details

  if (sourceBalance !== undefined && !enoughBalance) {
    warning = 'Insufficient funds'
  } else if (needsTokenForFee && sourceNetwork) {
    warning = `Add ${sourceNetwork.nativeTokenSymbol} to your account on ${sourceNetwork.name} for the transaction fee.`
  }

  return (
    <ConvertContext.Provider
      value={{
        convertOptions,
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
        sourceBalance,
        loadingSourceBalance,
        destBalance,
        loadingDestBalance,
        switchDirection,
        details,
        warning,
        setWarning,
        error,
        setError,
        tx,
        setTx,
        unsupportedAsset,
        needsTokenForFee,
      }}
    >
      {children}
    </ConvertContext.Provider>
  )
}

export const useConvert = () => useContext(ConvertContext)

export default ConvertContextProvider
