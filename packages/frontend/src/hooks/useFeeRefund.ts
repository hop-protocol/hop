import { useState, useEffect, useRef } from 'react'
import { BigNumber } from 'ethers'
import { ChainSlug } from '@hop-protocol/sdk'
import { isMainnet, showRewards } from '#config/index.js'

type UseFeeRefundProps = {
  fromNetwork: any
  toNetwork: any
  fromToken: any
  fromTokenAmountBN: BigNumber | null
  totalBonderFee: BigNumber | null
  estimatedGasCost: BigNumber | null
  version?: 'v1' | 'v2'
}

type UseFeeRefundResult = {
  showFeeRefund: boolean
  feeRefundTokenSymbol: string
  feeRefundDisplay: string
  feeRefund: string
  feeRefundUsd: string
}

export function useFeeRefund({
  fromNetwork,
  toNetwork,
  fromToken,
  fromTokenAmountBN,
  totalBonderFee,
  estimatedGasCost,
  version = 'v1'
}: UseFeeRefundProps): UseFeeRefundResult {
  const [feeRefund, setFeeRefund] = useState<string>('')
  const [feeRefundUsd, setFeeRefundUsd] = useState<string>('')
  const [feeRefundTokenSymbol, setFeeRefundTokenSymbol] = useState<string>('')
  const feeRefundEnabled = showRewards
  
  // Add debounce mechanism
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousParamsRef = useRef<string>('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Create a string representation of all the parameters to compare
    const currentParams = JSON.stringify({
      fromNetworkSlug: fromNetwork?.slug,
      toNetworkSlug: toNetwork?.slug,
      fromTokenSymbol: fromToken?.symbol,
      fromTokenAmountBN: fromTokenAmountBN?.toString(),
      totalBonderFee: totalBonderFee?.toString(),
      estimatedGasCost: estimatedGasCost?.toString()
    })

    // Skip if parameters haven't changed
    if (currentParams === previousParamsRef.current && !isFirstRender.current) {
      return
    }
    
    isFirstRender.current = false
    previousParamsRef.current = currentParams

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set a new timeout to debounce the API call
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log(`[${version}] Fee refund checking conditions:`, {
          isMainnet,
          feeRefundEnabled,
          fromNetwork: fromNetwork?.slug,
          toNetwork: toNetwork?.slug,
          fromToken: fromToken?.symbol,
          hasFromTokenAmountBN: !!fromTokenAmountBN,
          hasTotalBonderFee: !!totalBonderFee,
          hasEstimatedGasCost: !!estimatedGasCost,
          isOptimism: toNetwork?.slug === ChainSlug.Optimism
        })

        if (
          !(
            isMainnet &&
            feeRefundEnabled &&
            fromNetwork &&
            toNetwork &&
            fromToken &&
            fromTokenAmountBN &&
            fromTokenAmountBN.gt(0) &&
            totalBonderFee &&
            estimatedGasCost &&
            [ChainSlug.Optimism].includes(toNetwork?.slug as ChainSlug)
          )
        ) {
          setFeeRefund('')
          setFeeRefundUsd('')
          return
        }

        let gasCost = estimatedGasCost?.toString()

        // reduce estimated gas cost for fee refund display due to hardcoded gas limit in sdk being too high.
        // this can be removed once the sdk txOverrides is fixed.
        if (fromNetwork?.slug === 'ethereum' || fromNetwork?.isL1) {
          if (toNetwork.slug === ChainSlug.Optimism) {
            gasCost = BigNumber.from(gasCost).div(2).toString()
          }
          if (toNetwork.slug === ChainSlug.Arbitrum) {
            gasCost = BigNumber.from(gasCost).div(6).toString()
          }
        }

        let tokenSymbol = fromToken?.symbol
        if (tokenSymbol === 'USDC.e') {
          tokenSymbol = 'USDC'
        }

        const payload: Record<string, string> = {
          gasCost,
          amount: fromTokenAmountBN?.toString(),
          token: tokenSymbol,
          bonderFee: totalBonderFee.toString(),
          fromChain: fromNetwork?.slug
        }

        // Add version parameter only for v2
        if (version === 'v2') {
          payload.version = 'v2'
        }

        console.log(`[${version}] Making fee refund API call with:`, payload)

        const query = new URLSearchParams(payload).toString()
        const apiBaseUrl = `https://${toNetwork.slug}-fee-refund-api.hop.exchange`
        // const apiBaseUrl = 'http://localhost:8000'
        const url = `${apiBaseUrl}/v1/refund-amount?${query}`
        const res = await fetch(url)
        const json = await res.json()
        
        if (json.error) {
          throw new Error(json.error)
        }
        
        console.log(`[${version}] Fee refund response:`, json)
        const { refundAmountInRefundToken, refundAmountInUsd, refundTokenSymbol } = json.data.refund
        setFeeRefundTokenSymbol(refundTokenSymbol)
        
        if (refundAmountInUsd > 0) {
          setFeeRefund(refundAmountInRefundToken.toFixed(4))
          setFeeRefundUsd(refundAmountInUsd.toFixed(2))
        } else {
          setFeeRefund('')
          setFeeRefundUsd('')
        }
      } catch (err) {
        console.error(`[${version}] Fee refund fetch error:`, err)
        setFeeRefund('')
        setFeeRefundUsd('')
      }
    }, 500) // 500ms debounce

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [feeRefundEnabled, fromNetwork, toNetwork, fromToken, fromTokenAmountBN, totalBonderFee, estimatedGasCost, version])

  const showFeeRefund = feeRefundEnabled && 
    [ChainSlug.Optimism, ChainSlug.Arbitrum].includes(toNetwork?.slug as ChainSlug) && 
    !!feeRefund && 
    !!feeRefundUsd && 
    !!feeRefundTokenSymbol
  
  const feeRefundDisplay = feeRefund && feeRefundUsd && feeRefundTokenSymbol ? 
    `${feeRefund} ($${feeRefundUsd})` : ''

  return {
    showFeeRefund,
    feeRefundTokenSymbol,
    feeRefundDisplay,
    feeRefund,
    feeRefundUsd
  }
} 