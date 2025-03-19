// src/hooks/useSendV2Intermediary.ts

import { useSend } from '#hooks/useSend.js'
import { useV2Send } from '#hooks/useV2Send.js'
import { ReactNode, useMemo, useEffect } from 'react'
import { BigNumber } from 'ethers'

// Importing types from their respective model files
import { Address } from '#models/Address.js'
import { HopBridge } from '@hop-protocol/sdk' // Ensure both are imported from the same SDK
import { Network } from '#models/Network.js'
import { DisabledRoute } from '#config/disabled.js'
import { v2Enabled } from '#config/index.js'
import { Transaction } from '#models/Transaction.js'
import { GnosisSafeWarning } from '#hooks/index.js' // Corrected import path

import { ChangeEvent } from 'react'

// mainnet chains mapped to sepolia chains
const chains :any = {
  1: '11155111',
  10: '11155420',
  8453: '84532',
}

// Helper function to check if chain is supported
function isChainSupported(chainId: string | number): boolean {
  return Object.keys(chains).includes(chainId.toString())
}

// Helper function to get Sepolia chain ID
function getSepoliaChainId(chainId: string | number): string {
  return chains[chainId.toString()]
}

// Helper function to check if token is eligible for v2 and get chain mappings
function isTokenEligibleWithChains(params: {
  symbol: string,
  sourceChainId: string | number,
  destinationChainId: string | number
}) {
  const { symbol, sourceChainId, destinationChainId } = params

  // Only USDC is supported for now
  if (symbol !== 'USDC') return false

  // Both chains must be supported
  if (!isChainSupported(sourceChainId) || !isChainSupported(destinationChainId)) return false

  // Don't allow same chain transfers
  if (sourceChainId.toString() === destinationChainId.toString()) return false

  return {
    symbol,
    sourceChainId: sourceChainId.toString(),
    destinationChainId: destinationChainId.toString(),
    sepolia: {
      sourceChainId: getSepoliaChainId(sourceChainId),
      destinationChainId: getSepoliaChainId(destinationChainId)
    }
  }
}

// Define the list of tokens eligible for v2
// This is now a function instead of a static array
function getV2EligibleToken(params: {
  symbol: string,
  sourceChainId: string | number,
  destinationChainId: string | number
}) {
  return isTokenEligibleWithChains(params)
}

interface TokenInterface {
  address: string
  decimals: number
  symbol: string
  isNativeToken?: boolean
}

// Define the return type for useSendV2Intermediary
export type UseSendV2IntermediaryProps = {
  v2Enabled: boolean
  accountAddress: Address | undefined
  amountOutMinDisplay: string
  amountOutMinUsdDisplay: string
  bonderFeeDisplay: string
  bonderFeeUsdDisplay: string
  bridges: HopBridge[]
  customRecipient: string
  deadline: () => number
  destinationTxFeeDisplay: string
  destinationTxFeeUsdDisplay: string
  disabledTx: DisabledRoute | undefined
  error: string
  estimatedReceivedDisplay: string
  estimatedReceivedUsdDisplay: string
  feeRefundDisplay: string
  feeRefundTokenSymbol: string
  fromAmountInputChangeHandler: (value: string) => void
  fromBalance: BigNumber
  fromNetwork: Network | undefined
  fromToken: TokenInterface
  fromTokenAmount: string
  gnosisSafeWarning: GnosisSafeWarning
  handleApprove: () => void
  handleBridgeChange: (event: ChangeEvent<{ value: unknown }>) => void
  handleCustomRecipientInput: (event: ChangeEvent<HTMLInputElement>) => void
  handleFromNetworkChange: (network: Network | undefined) => void
  handleSwitchDirection: () => void
  handleToNetworkChange: (network: Network | undefined) => void
  info: string
  isApproveButtonActive: boolean
  isApproving: boolean
  isDestinationChainPaused: boolean
  isLoadingFromBalance: boolean
  isLoadingSendData: boolean
  isLoadingToBalance: boolean
  isSendButtonActive: boolean
  isSmartContractWallet: boolean
  isSpecificRouteDeprecated: boolean
  manualError: string
  manualWarning: string
  maxButtonFixedAmountToSubtract: BigNumber
  needsApproval: boolean
  networks: Network[]
  placeholderToken: TokenInterface | undefined
  priceImpact: number
  rate: number
  relayFeeEthDisplay: string
  relayFeeUsdDisplay: string
  selectedBridge: HopBridge | undefined
  send: () => void
  setError: (error: string) => void
  setInfo: (info: string) => void
  setTx: (tx: Transaction | undefined) => void
  setWarning: (warning: string) => void
  showFeeRefund: boolean
  slippageTolerance: number
  toBalance: BigNumber
  toNetwork: Network | undefined
  toToken: TokenInterface
  toTokenAmount: string
  totalFeeDisplay: string
  totalFeeUsdDisplay: string
  transferTimeDisplay: string
  tx: Transaction | undefined
  warning: string | ReactNode
  isV2: boolean
  estimatedReceivedComparison: any
}

// Helper function to safely access properties with default values
const getValue = <T, K extends keyof T>(
  source: T | undefined | null,
  key: K,
  defaultValue: T[K]
): T[K] => {
  return source && source[key] !== undefined ? source[key] : defaultValue
}

export function useSendV2Intermediary(): UseSendV2IntermediaryProps {
  // Unconditionally call both hooks
  const sendV1 = useSend()
  const sendV2 = useV2Send()

  useEffect(() => {
    // for testing
    async function update() {
      const hash = ''
      const chainId = ''

      // const hash = '0xe0ff8a31f0b2c7cba9f3250481e009f621451905d20175ce4885d8a220827234'
      // const chainId = '11155111'

      // const hash = '0xb10cf2887fecb5e6a7ae0cdba32d270bfc6f1fa07823f7c912b90e9ad452d70c'
      // const chainId = '84532'

      if (hash) {
        const provider = sendV2.v2Sdk?.getProvider(chainId)
        const _tx = await provider.getTransaction(hash)
        sendV2.setSendTx(_tx)
      }
    }

    update().catch(console.error)
  }, [sendV2.v2Sdk])

  // Update the isTokenEligibleForV2 check in useSendV2Intermediary
  const isTokenEligibleForV2 = useMemo(() => {
    // return true // for testing
    if (!v2Enabled) {
      return false
    }
    if (!sendV1.fromToken || !sendV1.fromNetwork || !sendV1.toNetwork) {
      return false
    }

    return !!getV2EligibleToken({
      symbol: sendV1.fromToken.symbol,
      sourceChainId: sendV1.fromNetwork.chainId,
      destinationChainId: sendV1.toNetwork.chainId
    })
  }, [sendV1.fromToken, sendV1.fromNetwork, sendV1.toNetwork])

  // Determine which version has the best rate
  const useV2ForBestRate = useMemo(() => {
    // return true // for testing
    if (
      isTokenEligibleForV2 &&
      sendV1.estimatedReceived &&
      sendV2.estimatedReceived
    ) {
      const useV2 = sendV2.estimatedReceived.gt(sendV1.estimatedReceived)
      return useV2
    }
    return false
  }, [isTokenEligibleForV2, sendV1.estimatedReceivedUsd, sendV2.estimatedReceivedUsd])

  // Select the appropriate source based on eligibility and best rate
  const selectedSource = isTokenEligibleForV2
    ? useV2ForBestRate
      ? sendV2
      : sendV1
    : sendV1

  // Update the synchronization effect
  useEffect(() => {
    if (isTokenEligibleForV2) {
      // Synchronize fromChainId
      if (sendV1.fromNetwork && sendV2.setFromChainId) {
        const eligibleToken = getV2EligibleToken({
          symbol: sendV1.fromToken?.symbol || '',
          sourceChainId: sendV1.fromNetwork.chainId,
          destinationChainId: sendV1.toNetwork?.chainId || ''
        })

        if (eligibleToken) {
          sendV2.setFromChainId(eligibleToken.sepolia.sourceChainId)
        }
      }

      // Synchronize toChainId
      if (sendV1.toNetwork && sendV2.setToChainId) {
        const eligibleToken = getV2EligibleToken({
          symbol: sendV1.fromToken?.symbol || '',
          sourceChainId: sendV1.fromNetwork?.chainId || '',
          destinationChainId: sendV1.toNetwork.chainId
        })

        if (eligibleToken) {
          sendV2.setToChainId(eligibleToken.sepolia.destinationChainId)
        }
      }

      // Synchronize fromToken.symbol
      if (sendV1.fromToken && sendV1.fromToken.symbol && sendV2.setTokenSymbol) {
        sendV2.setTokenSymbol(sendV1.fromToken.symbol === 'ETH' ? 'MOCK' : sendV1.fromToken.symbol) // for testing
      }

      // Synchronize fromTokenAmount to amountIn
      if (sendV2.setAmountIn && sendV1.fromToken) {
        sendV2.setAmountIn(sendV1.fromTokenAmount)
        sendV2.setFromTokenDecimals(sendV1.fromToken.decimals)
      }

      // Synchronize customRecipient to recipient
      if (sendV1.customRecipient && sendV2.setRecipient) {
        sendV2.setRecipient(sendV1.customRecipient)
      }
    }
    // Dependencies ensure this runs when relevant v1 properties change
  }, [
    isTokenEligibleForV2,
    sendV1,
    sendV2,
    sendV1.fromNetwork,
    sendV1.toNetwork,
    sendV1.fromToken,
    sendV1.fromTokenAmount,
    sendV1.customRecipient,
    sendV2.setFromChainId,
    sendV2.setToChainId,
    sendV2.setTokenSymbol,
    sendV2.setAmountIn,
    sendV2.setRecipient,
  ])

  const v2Tx = useMemo(() => {
    if (!sendV2.sendTx) {
      return undefined
    }
    return new Transaction({
      v2Sdk: sendV2.v2Sdk,
      ...sendV2.sendTx,
      fromChainId: sendV2.fromChainId,
      networkName: sendV2.fromChain?.slug,
      destNetworkName: sendV2.toChain?.slug,
      destChainId: sendV2.toChainId,
      // destTxHash:
      token: sendV2.fromToken,
    } as any)
  }, [sendV2.sendTx])

  // Map variables to match useSend interface
  const mappedProps: UseSendV2IntermediaryProps = {
    v2Enabled,

    // **Common Variables**
    accountAddress: isTokenEligibleForV2
      ? useV2ForBestRate
        ? (getValue(sendV2, 'accountAddress', '') ? Address.from(getValue(sendV2, 'accountAddress', '')) : undefined)
        : getValue(sendV1, 'accountAddress', undefined)
      : getValue(sendV1, 'accountAddress', undefined),

    error: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'error', '')
        : getValue(sendV1, 'error', '')
      : getValue(sendV1, 'error', ''),

    isApproving: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'isApproving', false)
        : getValue(sendV1, 'isApproving', false)
      : getValue(sendV1, 'isApproving', false),

    needsApproval: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'needsApproval', false)
        : getValue(sendV1, 'needsApproval', false)
      : getValue(sendV1, 'needsApproval', false),

    // **v1 Specific Variables or Mapped from v2**
    amountOutMinDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder as v2 does not provide this
        : getValue(sendV1, 'amountOutMinDisplay', '')
      : getValue(sendV1, 'amountOutMinDisplay', ''),

    amountOutMinUsdDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder
        : getValue(sendV1, 'amountOutMinUsdDisplay', '')
      : getValue(sendV1, 'amountOutMinUsdDisplay', ''),

    bonderFeeDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'maxBonderFeeDisplay', '')
        : getValue(sendV1, 'bonderFeeDisplay', '')
      : getValue(sendV1, 'bonderFeeDisplay', ''),

    bonderFeeUsdDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'maxBonderFeeUsdDisplay', '')
        : getValue(sendV1, 'bonderFeeUsdDisplay', '')
      : getValue(sendV1, 'bonderFeeUsdDisplay', ''),

    bridges: getValue(sendV1, 'bridges', []),

    customRecipient: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'recipient', '')
        : getValue(sendV1, 'customRecipient', '')
      : getValue(sendV1, 'customRecipient', ''),

    deadline: isTokenEligibleForV2
      ? useV2ForBestRate
        ? () => Math.floor(Date.now() / 1000) + 600 // Placeholder: Define appropriately based on v2
        : getValue(sendV1, 'deadline', () => 0)
      : getValue(sendV1, 'deadline', () => 0),

    destinationTxFeeDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder as v2 does not provide
        : getValue(sendV1, 'destinationTxFeeDisplay', '')
      : getValue(sendV1, 'destinationTxFeeDisplay', ''),

    destinationTxFeeUsdDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder as v2 does not provide
        : getValue(sendV1, 'destinationTxFeeUsdDisplay', '')
      : getValue(sendV1, 'destinationTxFeeUsdDisplay', ''),

    disabledTx: isTokenEligibleForV2
      ? useV2ForBestRate
        ? undefined // Assuming v2 does not provide this
        : getValue(sendV1, 'disabledTx', undefined)
      : getValue(sendV1, 'disabledTx', undefined),

    estimatedReceivedDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'estimatedReceivedDisplay', '')
        : getValue(sendV1, 'estimatedReceivedDisplay', '')
      : getValue(sendV1, 'estimatedReceivedDisplay', ''),

    estimatedReceivedUsdDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'estimatedReceivedUsdDisplay', '')
        : getValue(sendV1, 'estimatedReceivedUsdDisplay', '')
      : getValue(sendV1, 'estimatedReceivedUsdDisplay', ''),

    feeRefundDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder as v2 may not provide this
        : getValue(sendV1, 'feeRefundDisplay', '')
      : getValue(sendV1, 'feeRefundDisplay', ''),

    feeRefundTokenSymbol: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder as v2 may not provide this
        : getValue(sendV1, 'feeRefundTokenSymbol', '')
      : getValue(sendV1, 'feeRefundTokenSymbol', ''),

    fromAmountInputChangeHandler: getValue(sendV1, 'fromAmountInputChangeHandler', () => {}),
    
    fromBalance: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'fromTokenBalance', BigNumber.from(0))
        : getValue(sendV1, 'fromBalance', BigNumber.from(0))
      : getValue(sendV1, 'fromBalance', BigNumber.from(0)),

    fromNetwork: getValue(sendV1, 'fromNetwork', undefined),

    fromToken: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'fromToken', null) as TokenInterface
        : getValue(sendV1, 'fromToken', null) as TokenInterface
      : getValue(sendV1, 'fromToken', null) as TokenInterface,

    fromTokenAmount: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'amountIn', '')
        : getValue(sendV1, 'fromTokenAmount', '')
      : getValue(sendV1, 'fromTokenAmount', ''),

    gnosisSafeWarning: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' as unknown as GnosisSafeWarning
        : getValue(sendV1, 'gnosisSafeWarning', '' as unknown as GnosisSafeWarning)
      : getValue(sendV1, 'gnosisSafeWarning', '' as unknown as GnosisSafeWarning),

    handleApprove: isTokenEligibleForV2
      ? useV2ForBestRate
        ? sendV2.handleApprove
        : sendV1.handleApprove
      : sendV1.handleApprove,

    handleBridgeChange: sendV1.handleBridgeChange,

    handleCustomRecipientInput: isTokenEligibleForV2
      ? useV2ForBestRate
        ? sendV2.handleRecipientInput
        : sendV1.handleCustomRecipientInput
      : sendV1.handleCustomRecipientInput,

    handleFromNetworkChange: sendV1.handleFromNetworkChange,

    handleSwitchDirection: sendV1.handleSwitchDirection,

    handleToNetworkChange: sendV1.handleToNetworkChange,

    info: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'info', '')
        : getValue(sendV1, 'info', '')
      : getValue(sendV1, 'info', ''),

    isApproveButtonActive: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'approveReady', false)
        : getValue(sendV1, 'isApproveButtonActive', false)
      : getValue(sendV1, 'isApproveButtonActive', false),

    isDestinationChainPaused: isTokenEligibleForV2
      ? useV2ForBestRate
        ? false // Placeholder as v2 may not have this
        : getValue(sendV1, 'isDestinationChainPaused', false)
      : getValue(sendV1, 'isDestinationChainPaused', false),

    isLoadingFromBalance: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'isLoadingFromTokenBalance', false)
        : getValue(sendV1, 'isLoadingFromBalance', false)
      : getValue(sendV1, 'isLoadingFromBalance', false),

    isLoadingSendData: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'isFetchingGetSendData', false)
        : getValue(sendV1, 'isLoadingSendData', false)
      : getValue(sendV1, 'isLoadingSendData', false),

    isLoadingToBalance: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'isLoadingToTokenBalance', false)
        : getValue(sendV1, 'isLoadingToBalance', false)
      : getValue(sendV1, 'isLoadingToBalance', false),

    isSendButtonActive: isTokenEligibleForV2
      ? useV2ForBestRate
        ? sendV2.sendReady
        : sendV1.isSendButtonActive
      : sendV1.isSendButtonActive,

    isSmartContractWallet: isTokenEligibleForV2
      ? useV2ForBestRate
        ? false // Placeholder as v2 may not have this
        : getValue(sendV1, 'isSmartContractWallet', false)
      : getValue(sendV1, 'isSmartContractWallet', false),

    isSpecificRouteDeprecated: isTokenEligibleForV2
      ? useV2ForBestRate
        ? false // Placeholder as v2 may not have this
        : getValue(sendV1, 'isSpecificRouteDeprecated', false)
      : getValue(sendV1, 'isSpecificRouteDeprecated', false),

    manualError: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder or map to v2 equivalent if exists
        : getValue(sendV1, 'manualError', '')
      : getValue(sendV1, 'manualError', ''),

    manualWarning: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder or map to v2 equivalent if exists
        : getValue(sendV1, 'manualWarning', '')
      : getValue(sendV1, 'manualWarning', ''),

    maxButtonFixedAmountToSubtract: isTokenEligibleForV2
      ? useV2ForBestRate
        ? BigNumber.from(0) // Placeholder or map to v2 equivalent if exists
        : getValue(sendV1, 'maxButtonFixedAmountToSubtract', BigNumber.from(0))
      : getValue(sendV1, 'maxButtonFixedAmountToSubtract', BigNumber.from(0)),

    slippageTolerance: isTokenEligibleForV2
      ? useV2ForBestRate
        ? 0.01
        : getValue(sendV1, 'slippageTolerance', 0)
      : getValue(sendV1, 'slippageTolerance', 0),

    networks: getValue(sendV1, 'networks', []),

    placeholderToken: isTokenEligibleForV2
      ? useV2ForBestRate
        ? undefined // Placeholder or map to v2 equivalent if exists
        : getValue(sendV1, 'placeholderToken', undefined)
      : getValue(sendV1, 'placeholderToken', undefined),

    priceImpact: isTokenEligibleForV2
      ? useV2ForBestRate
        ? 0
        : getValue(sendV1, 'priceImpact', 0)
      : getValue(sendV1, 'priceImpact', 0),

    rate: isTokenEligibleForV2
      ? useV2ForBestRate
        ? 1
        : getValue(sendV1, 'rate', 0)
      : getValue(sendV1, 'rate', 0),

    relayFeeEthDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'sendFeeDisplay', '')
        : getValue(sendV1, 'relayFeeEthDisplay', '')
      : getValue(sendV1, 'relayFeeEthDisplay', ''),

    relayFeeUsdDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'sendFeeUsdDisplay', '')
        : getValue(sendV1, 'relayFeeUsdDisplay', '')
      : getValue(sendV1, 'relayFeeUsdDisplay', ''),

    selectedBridge: getValue(sendV1, 'selectedBridge', undefined),

    send: isTokenEligibleForV2
      ? useV2ForBestRate
        ? sendV2.sendTokens
        : sendV1.send
      : sendV1.send,

    setError: isTokenEligibleForV2
      ? useV2ForBestRate
        ? sendV2.setError
        : sendV1.setError
      : sendV1.setError,

    setInfo: isTokenEligibleForV2
      ? useV2ForBestRate
        ? () => {} // Placeholder or map to v2 equivalent if exists
        : sendV1.setInfo
      : sendV1.setInfo,

    setTx: isTokenEligibleForV2
      ? useV2ForBestRate
        ? (tx: any) => sendV2.setSendTx(tx)
        : sendV1.setTx
      : sendV1.setTx,

    setWarning: isTokenEligibleForV2
      ? useV2ForBestRate
        ? sendV2.setWarning
        : sendV1.setWarning
      : sendV1.setWarning,

    showFeeRefund: isTokenEligibleForV2
      ? useV2ForBestRate
        ? false // Placeholder as v2 may not have this
        : getValue(sendV1, 'showFeeRefund', false)
      : getValue(sendV1, 'showFeeRefund', false),

    toBalance: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'toTokenBalance', BigNumber.from(0))
        : getValue(sendV1, 'toBalance', BigNumber.from(0))
      : getValue(sendV1, 'toBalance', BigNumber.from(0)),

    toNetwork: getValue(sendV1, 'toNetwork', undefined),

    toToken: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'toToken', null) as TokenInterface
        : getValue(sendV1, 'toToken', null) as TokenInterface
      : getValue(sendV1, 'toToken', null) as TokenInterface,

    toTokenAmount: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'toTokenAmount', '')
        : getValue(sendV1, 'toTokenAmount', '')
      : getValue(sendV1, 'toTokenAmount', ''),

    totalFeeDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'totalFeeDisplay', '')
        : getValue(sendV1, 'totalFeeDisplay', '')
      : getValue(sendV1, 'totalFeeDisplay', ''),

    totalFeeUsdDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'totalFeeUsdDisplay', '')
        : getValue(sendV1, 'totalFeeUsdDisplay', '')
      : getValue(sendV1, 'totalFeeUsdDisplay', ''),

    transferTimeDisplay: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder as v2 may not provide
        : getValue(sendV1, 'transferTimeDisplay', '')
      : getValue(sendV1, 'transferTimeDisplay', ''),

    tx: isTokenEligibleForV2
      ? useV2ForBestRate
        ? getValue(sendV2, 'sendTx', undefined) ? v2Tx : undefined
        : getValue(sendV1, 'tx', undefined)
      : getValue(sendV1, 'tx', undefined),

    warning: isTokenEligibleForV2
      ? useV2ForBestRate
        ? '' // Placeholder as per updated type
        : getValue(sendV1, 'warning', '')
      : getValue(sendV1, 'warning', ''),

      isV2: useV2ForBestRate,

      estimatedReceivedComparison: {
        v1: sendV1.estimatedReceivedDisplay,
        v2: sendV2.estimatedReceivedDisplay
      }
  }

  return mappedProps
}
