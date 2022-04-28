import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
  ChangeEvent,
} from 'react'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'
import { Token } from '@hop-protocol/sdk'
import find from 'lodash/find'
import Chain from 'src/models/Chain'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import ConvertOption from 'src/pages/Convert/ConvertOption/ConvertOption'
import AmmConvertOption from 'src/pages/Convert/ConvertOption/AmmConvertOption'
import HopConvertOption from 'src/pages/Convert/ConvertOption/HopConvertOption'
import { toTokenDisplay, commafy } from 'src/utils'
import { defaultL2Network, l1Network } from 'src/config/networks'
import {
  useTransactionReplacement,
  useApprove,
  useBalance,
  useNeedsTokenForFee,
  useAssets,
  useSelectedNetwork,
} from 'src/hooks'
import { formatError, amountToBN } from 'src/utils/format'

type ConvertContextProps = {
  approveTokens: () => void
  approving: boolean
  convertOptions: ConvertOption[]
  convertTokens: () => void
  destBalance?: BigNumber
  destinationChain?: Chain
  destToken?: Token
  destTokenAmount?: string
  details?: ReactNode
  error?: string
  loadingDestBalance: boolean
  loadingSourceBalance: boolean
  needsApproval?: boolean
  needsTokenForFee?: boolean
  selectBothNetworks: (event: ChangeEvent<{ value: any }>) => void
  selectedNetwork?: Chain
  sending: boolean
  setDestTokenAmount: (value: string) => void
  setError: (error?: string) => void
  setSourceTokenAmount: (value: string) => void
  setTx: (tx?: Transaction) => void
  setWarning: (warning?: string) => void
  sourceBalance?: BigNumber
  sourceChain?: Chain
  sourceToken?: Token
  sourceTokenAmount?: string
  switchDirection: () => void
  tx?: Transaction
  unsupportedAsset: any
  validFormFields: boolean
  warning?: ReactNode
}

const ConvertContext = createContext<ConvertContextProps | undefined>(undefined)

const ConvertProvider: FC = ({ children }) => {
  const { provider, checkConnectedNetworkId, address } = useWeb3Context()
  const { selectedBridge, txConfirm, sdk, settings } = useApp()
  const { slippageTolerance, deadline } = settings
  const { pathname } = useLocation()
  const { selectedNetwork, selectBothNetworks } = useSelectedNetwork()
  const [isConvertingToHToken, setIsConvertingToHToken] = useState(true)
  const switchDirection = () => setIsConvertingToHToken(direction => !direction)
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('')
  const [destTokenAmount, setDestTokenAmount] = useState<string>('')
  const [amountOutMin, setAmountOutMin] = useState<BigNumber>()
  const [sending, setSending] = useState<boolean>(false)
  const [approving, setApproving] = useState<boolean>(false)
  const [sourceToken, setSourceToken] = useState<Token>()
  const { approve, checkApproval } = useApprove(sourceToken)
  const [destToken, setDestToken] = useState<Token>()
  const [details, setDetails] = useState<ReactNode>()
  const [warning, setWarning] = useState<ReactNode>()
  const [bonderFee, setBonderFee] = useState<BigNumber>()
  const [error, setError] = useState<string | undefined>(undefined)
  const [tx, setTx] = useState<Transaction | undefined>()
  const debouncer = useRef(0)
  const { waitForTransaction, addTransaction } = useTransactionReplacement()

  const { unsupportedAsset } = useAssets(selectedBridge, selectedNetwork)

  const convertOptions = [new AmmConvertOption(), new HopConvertOption()]
  const convertOption = useMemo(
    () => find(convertOptions, option => pathname.includes(option.path)) || convertOptions[0],
    [pathname]
  )

  const sourceChain = useMemo<Chain | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || !isConvertingToHToken) {
      if (selectedNetwork?.isLayer1) {
        return defaultL2Network
      }
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isConvertingToHToken, selectedNetwork, l1Network, convertOption])

  const destinationChain = useMemo<Chain | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || isConvertingToHToken) {
      if (selectedNetwork?.isLayer1) {
        return defaultL2Network
      }
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isConvertingToHToken, selectedNetwork, l1Network, convertOption])

  const { balance: sourceBalance, loading: loadingSourceBalance } = useBalance(sourceToken, address)
  const { balance: destBalance, loading: loadingDestBalance } = useBalance(destToken, address)

  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else {
      setError('')
    }
  }, [unsupportedAsset])

  const needsTokenForFee = useNeedsTokenForFee(sourceChain)

  // Fetch source token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await convertOption.sourceToken(
          isConvertingToHToken,
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
  }, [unsupportedAsset, convertOption, isConvertingToHToken, selectedNetwork, selectedBridge])

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
          isConvertingToHToken,
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
  }, [unsupportedAsset, convertOption, isConvertingToHToken, selectedNetwork, selectedBridge])

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
          sourceChain &&
          destinationChain &&
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
        sourceChain,
        destinationChain,
        isConvertingToHToken,
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
    isConvertingToHToken,
  ])

  useEffect(() => {
    // NOTE: `convertOption.getSendData()` returns jsx code via the AmmConvertOption class.
    // This works for now, but we should convert AmmConvertOption Class -> React.FC w/ hooks
    if (details && (details as any).props?.children?.props?.tooltip?.props?.priceImpact) {
      const priceImpact = (details as any).props?.children?.props?.tooltip?.props?.priceImpact
      const isFavorableSlippage = Number(destTokenAmount) >= Number(sourceTokenAmount)
      const isHighPriceImpact = priceImpact && priceImpact !== 100 && Math.abs(priceImpact) >= 1
      const showWarning = isHighPriceImpact && !isFavorableSlippage
      if (showWarning) {
        const warning = `Warning: Price impact is high. Slippage is ${commafy(priceImpact)}%`
        setWarning(warning)
      }
    }
  }, [details])

  const needsApproval = useAsyncMemo(async () => {
    try {
      if (!(selectedBridge && sourceToken && destinationChain && !unsupportedAsset?.chain)) {
        return false
      }

      const targetAddress = await convertOption.getTargetAddress(
        sdk,
        selectedBridge?.getTokenSymbol(),
        sourceChain
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
    sourceChain,
    destinationChain,
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
      const networkId = Number(sourceChain?.networkId)
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
        sourceChain
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
      const networkId = Number(sourceChain?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setError(undefined)
      if (
        !Number(sourceTokenAmount) ||
        !sourceChain ||
        !destinationChain ||
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
            network: sourceChain
          },
          dest: {
            amount: destTokenAmount,
            token: destToken,
            network: destinationChain
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
            sourceChain,
            destinationChain,
            isConvertingToHToken,
            selectedBridge.getTokenSymbol(),
            value,
            amountOutMin,
            deadline(),
            bonderFee
          )
        },
      })

      if (tx?.hash && sourceChain?.name) {
        const txModelArgs = {
          networkName: sourceChain.slug,
          destNetworkName: destinationChain.slug,
          token: sourceToken,
          isCanonicalTransfer,
        }
        const txObj = new Transaction({
          hash: tx?.hash,
          ...txModelArgs,
        })
        // don't set tx status modal if it's tx to the same chain
        if (sourceChain.isLayer1 !== destinationChain?.isLayer1) {
          setTx(txObj)
        }
        addTransaction(txObj)

        const res = await waitForTransaction(tx, txModelArgs)
        if (res && 'replacementTxModel' in res) {
          if (sourceChain.isLayer1 !== destinationChain?.isLayer1) {
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

  useEffect(() => {
    if (sourceBalance !== undefined && !enoughBalance) {
      setWarning('Insufficient funds')
    } else if (needsTokenForFee && sourceChain) {
      setWarning(
        `Add ${sourceChain.nativeTokenSymbol} to your account on ${sourceChain.name} for the transaction fee.`
      )
    }
  }, [sourceBalance, enoughBalance, needsTokenForFee, sourceChain])

  return (
    <ConvertContext.Provider
      value={{
        approveTokens,
        approving,
        convertOptions,
        convertTokens,
        destBalance,
        destinationChain,
        destToken,
        destTokenAmount,
        details,
        error,
        loadingDestBalance,
        loadingSourceBalance,
        needsApproval,
        needsTokenForFee,
        selectedNetwork,
        sending,
        setDestTokenAmount,
        setError,
        selectBothNetworks,
        setSourceTokenAmount,
        setTx,
        setWarning,
        sourceBalance,
        sourceChain,
        sourceToken,
        sourceTokenAmount,
        switchDirection,
        tx,
        unsupportedAsset,
        validFormFields,
        warning,
      }}
    >
      {children}
    </ConvertContext.Provider>
  )
}

export function useConvert() {
  const ctx = useContext(ConvertContext)
  if (ctx === undefined) {
    throw new Error('useConvert must be used within ConvertProvider')
  }
  return ctx
}

export default ConvertProvider
