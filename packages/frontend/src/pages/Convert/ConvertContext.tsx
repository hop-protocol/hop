import Address from '#models/Address.js'
import AmmConvertOption from '#pages/Convert/ConvertOption/AmmConvertOption.js'
import ConvertOption from '#pages/Convert/ConvertOption/ConvertOption.js'
import HopConvertOption from '#pages/Convert/ConvertOption/HopConvertOption.js'
import Link from '@mui/material/Link'
import Network from '#models/Network.js'
import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Transaction from '#models/Transaction.js'
import find from 'lodash/find'
import logger from '#logger/index.js'
import useAsyncMemo from '#hooks/useAsyncMemo.js'
import { BigNumber } from 'ethers'
import { SelectChangeEvent } from '@mui/material/Select'
import { Token } from '@hop-protocol/sdk'
import { amountToBN, formatError } from '#utils/format.js'
import { commafy, toTokenDisplay } from '#utils/index.js'
import { defaultL2Network, l1Network } from '#config/networks.js'
import { useApp } from '#contexts/AppContext/index.js'
import {
  useApprove,
  useAssets,
  useBalance,
  useNeedsTokenForFee,
  useSelectedNetwork,
  useTransactionReplacement,
} from '#hooks/index.js'
import { useCheckPoolDeprecated } from '#hooks/useCheckPoolDeprecated.js'
import { useLocation, useParams } from 'react-router-dom'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { TokenSymbol } from '@hop-protocol/sdk'

type ConvertContextProps = {
  address: Address | undefined
  approveTokens: () => void
  approving: boolean
  convertOptions: ConvertOption[]
  convertTokens: (customRecipient?: string) => void
  destBalance?: BigNumber
  destNetwork?: Network
  destToken?: Token
  destTokenAmount?: string
  details?: ReactNode
  error?: string
  loadingDestBalance: boolean
  loadingSourceBalance: boolean
  needsApproval?: boolean
  needsTokenForFee?: boolean
  selectBothNetworks: (event: SelectChangeEvent<unknown>) => void
  selectedNetwork?: Network
  sending: boolean
  setDestTokenAmount: (value: string) => void
  setError: (error?: string) => void
  setSourceTokenAmount: (value: string) => void
  setTx: (tx?: Transaction) => void
  setViaParamValue: (viaParamValue: string) => void
  setWarning: (warning?: string) => void
  sourceBalance?: BigNumber
  sourceNetwork?: Network
  sourceToken?: Token
  sourceTokenAmount?: string
  switchDirection: () => void
  tx?: Transaction
  unsupportedAsset: any
  assetWithoutAmm: any
  validFormFields: boolean
  viaParamValue: string
  warning?: ReactNode
  info?: ReactNode
  convertOption: ConvertOption
  destinationChainPaused: boolean
}

const ConvertContext = createContext<ConvertContextProps | undefined>(undefined)

const ConvertProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { provider, checkConnectedNetworkId, address } = useWeb3Context()
  const { selectedBridge, txConfirm, sdk, settings } = useApp()
  const { slippageTolerance, deadline } = settings
  const { pathname, search } = useLocation()
  const { selectedNetwork, selectBothNetworks } = useSelectedNetwork()
  const queryParams = new URLSearchParams(search)
  const [isConvertingToHToken, setIsConvertingToHToken] = useState<boolean>(queryParams.get('fromHToken') !== 'true')
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
  const [info, setInfo] = useState<ReactNode>()
  const [bonderFee, setBonderFee] = useState<BigNumber>()
  const [error, setError] = useState<string | undefined>(undefined)
  const [tx, setTx] = useState<Transaction | undefined>()
  const debouncer = useRef(0)
  const { waitForTransaction, addTransaction } = useTransactionReplacement()
  const [destinationChainPaused, setDestinationChainPaused] = useState<boolean>(false)

  const { assetWithoutAmm, unsupportedAsset } = useAssets(selectedBridge, selectedNetwork)

  const { via } = useParams<{via: string}>()
  const [viaParamValue, setViaParamValue] = useState<string>(via ?? 'amm')

  useEffect(() => {
    setViaParamValue(via ?? 'amm')
  }, [via])

  const convertOptions = [new AmmConvertOption(), new HopConvertOption()]
  const convertOption = useMemo(
    () => find(
      convertOptions,
      option => pathname.includes(option.path) || option.path.includes(viaParamValue)
    ) ?? convertOptions[0],
    [pathname, viaParamValue]
  )

  const sourceNetwork = useMemo<Network | undefined>(() => {
    if (convertOption instanceof AmmConvertOption || !isConvertingToHToken) {
      if (selectedNetwork?.isLayer1) {
        return defaultL2Network
      }
      return selectedNetwork
    } else {
      return l1Network
    }
  }, [isConvertingToHToken, selectedNetwork, l1Network, convertOption])

  const destNetwork = useMemo<Network | undefined>(() => {
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

  const isTokenDeprecated = useCheckPoolDeprecated(sourceToken?._symbol)

  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else if (assetWithoutAmm && convertOption instanceof AmmConvertOption) {
      const { chain, tokenSymbol } = assetWithoutAmm
      setError(`${tokenSymbol} does not use an AMM on ${chain}`)
    } else if (assetWithoutAmm && convertOption instanceof HopConvertOption) {
      const { chain, tokenSymbol } = assetWithoutAmm
      setError(`${tokenSymbol} does not use hTokens on ${chain}`)
    } else if (isTokenDeprecated && convertOption instanceof HopConvertOption && sourceNetwork?.isLayer1) {
      setError(`The ${sourceToken?._symbol} bridge is deprecated. Only transfers from L2 to L1 are supported.`)
    } else {
      setError('')
    }
  }, [isTokenDeprecated, unsupportedAsset, assetWithoutAmm, convertOption, sourceNetwork, sourceToken])

  const needsTokenForFee = useNeedsTokenForFee(sourceNetwork)

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
        isConvertingToHToken,
        selectedBridge.getTokenSymbol() as TokenSymbol,
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
      if (!(selectedBridge && sourceToken && destNetwork && !unsupportedAsset?.chain)) {
        return false
      }

      const targetAddress = await convertOption.getTargetAddress(
        sdk,
        selectedBridge?.getTokenSymbol() as TokenSymbol,
        sourceNetwork,
        destNetwork
      )

      const isApprovalOk = await checkApproval(parsedSourceTokenAmount, sourceToken, targetAddress)
      return isApprovalOk
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
      if (!isNetworkConnected) {
        throw new Error('wrong network connected')
      }
      setError(undefined)
      setApproving(true)
      if (!sourceToken) {
        throw new Error('No source token selected')
      }

      const targetAddress = await convertOption.getTargetAddress(
        sdk,
        selectedBridge?.getTokenSymbol() as TokenSymbol,
        sourceNetwork,
        destNetwork
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

  const convertTokens = async (customRecipient?: string) => {
    try {
      setTx(undefined)
      const networkId = Number(sourceNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) {
        throw new Error('wrong network connected')
      }

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
      const isCanonicalTransfer = false

      const tx = await txConfirm?.show({
        kind: 'convert',
        inputProps: {
          source: {
            amount: sourceTokenAmount,
            token: sourceToken,
            network: sourceNetwork
          },
          dest: {
            amount: destTokenAmount,
            token: destToken,
            network: destNetwork
          },
          customRecipient: convertOption?.slug === 'hop-bridge' ? customRecipient : ''
        },
        onConfirm: async () => {
          await approveTokens()

          if (!selectedBridge || !signer || !sourceToken || !amountOutMin) {
            throw new Error('Missing convert param')
          }

          const tx = await convertOption.convert(
            sdk,
            signer,
            sourceNetwork,
            destNetwork,
            isConvertingToHToken,
            selectedBridge.getTokenSymbol() as TokenSymbol,
            value,
            amountOutMin,
            deadline(),
            bonderFee,
            customRecipient
          )

          await tx?.wait()
          return tx
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

  useEffect(() => {
    if (sourceBalance !== undefined && !enoughBalance) {
      setWarning('Insufficient funds')
    } else if (needsTokenForFee && sourceNetwork) {
      setWarning(
        `Add ${sourceNetwork.nativeTokenSymbol} to your account on ${sourceNetwork.name} for the transaction fee.`
      )
    }
  }, [sourceBalance, enoughBalance, needsTokenForFee, sourceNetwork])

  useEffect(() => {
    const update = async () => {
      if (sourceNetwork?.isL1 && destNetwork && sourceToken) {
        const bridge = sdk.bridge(sourceToken.symbol)
        const isPaused = await bridge.isDestinationChainPaused(destNetwork?.slug)
        setDestinationChainPaused(isPaused)
      } else {
        setDestinationChainPaused(false)
      }
    }

    update().catch(console.error)
  }, [sdk, sourceToken, sourceNetwork, destNetwork])

  useEffect(() => {
    const isUSDCe = sourceToken?.symbol === 'hUSDC.e' || destToken?.symbol === 'USDC.e'
    const isMagic = sourceToken?.symbol === 'hMAGIC'
    if (isUSDCe && destNetwork?.isL1) {
      setInfo(<>Notice: The USDC.e bonder was <Link target="_blank" rel="noopener noreferrer" href="https://twitter.com/HopProtocol/status/1765455840700694902">deprecated</Link> on March 20th, 2024. To transfer hUSDC.e to L1, <strong>you will need to wait for the full exit process (7+ days after root commit)</strong> before withdrawing. After you have intiated the withdrawal on this page, you must commit the transfer root hash on the <Link href="/#/commit-transfers">Commit Transfers Page</Link> here. Please reach out on <Link target="_blank" rel="noopener noreferrer" href="https://discord.gg/PwCF88emV4">Discord</Link> if you have any questions.</>)
    } else if (isMagic && destNetwork?.isL1) {
      setInfo(<>Notice: The MAGIC bonder was deprecated on December 2024. To transfer hMAGIC to L1, <strong>you will need to wait for the full exit process (7+ days after root commit)</strong> before withdrawing. After you have intiated the withdrawal on this page, you must commit the transfer root hash on the <Link href="/#/commit-transfers">Commit Transfers Page</Link> here. Please reach out on <Link target="_blank" rel="noopener noreferrer" href="https://discord.gg/PwCF88emV4">Discord</Link> if you have any questions.</>)
    } else {
      setInfo(null)
    }
  }, [sourceToken, destToken, destNetwork])

  return (
    <ConvertContext.Provider
      value={{
        address,
        approveTokens,
        approving,
        assetWithoutAmm,
        convertOption,
        convertOptions,
        convertTokens,
        destBalance,
        destinationChainPaused,
        destNetwork,
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
        setViaParamValue,
        setWarning,
        sourceBalance,
        sourceNetwork,
        sourceToken,
        sourceTokenAmount,
        switchDirection,
        tx,
        unsupportedAsset,
        validFormFields,
        viaParamValue,
        warning,
        info
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
