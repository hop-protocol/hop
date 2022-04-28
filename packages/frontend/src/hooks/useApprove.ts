import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { BigNumber, constants } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { Token, HopBridge, CanonicalToken } from '@hop-protocol/sdk'
import Chain from 'src/models/Chain'
import Transaction from 'src/models/Transaction'
import { amountToBN, defaultRefetchInterval, toTokenDisplay } from 'src/utils'
import { useTransactionReplacement } from './useTransactionReplacement'
import logger from 'src/logger'

async function getSpender(network: Chain, bridge: HopBridge) {
  if (network.isLayer1) {
    const l1Bridge = await bridge.getL1Bridge()
    return l1Bridge.address
  }

  const ammWrapper = await bridge.getAmmWrapper(network.slug)
  return ammWrapper.address
}

export function useApprove(
  token?: Token,
  sourceChain?: Chain,
  amountOut?: BigNumber,
  setApproving?: any,
  approving?: boolean,
  usingNativeBridge?: boolean,
  destinationChain?: Chain
) {
  const { provider, checkConnectedNetworkId } = useWeb3Context()
  const { txConfirm, sdk } = useApp()
  const { waitForTransaction, addTransaction } = useTransactionReplacement()

  const checkApproval = useCallback(
    async (amount: BigNumber, token: Token, spender: string) => {
      try {
        const signer = provider?.getSigner()
        if (!signer) {
          throw new Error('Wallet not connected')
        }

        if (token.isNativeToken) {
          return false
        }

        const allowance = await token.allowance(spender)
        console.log(`check approval: allowance:`, allowance)
        if (allowance.gte(amount)) {
          return false
        }

        return true
      } catch (err: any) {
        return false
      }
    },
    [provider, usingNativeBridge]
  )

  const { data: needsApproval } = useQuery(
    [
      `needsApproval:${token?.address}:${
        sourceChain?.slug
      }:${amountOut?.toString()}:${usingNativeBridge}`,
      token?.address,
      sourceChain?.slug,
      amountOut?.toString(),
      usingNativeBridge,
    ],
    async () => {
      if (!(token && sdk && sourceChain && amountOut)) {
        return
      }

      if (token.isNativeToken) {
        return false
      }

      try {
        const bridge = sdk.bridge(token.symbol)
        const parsedAmount = amountToBN(amountOut.toString(), token.decimals)
        const spender = await getSpender(sourceChain, bridge)
        return checkApproval(parsedAmount, token, spender)
      } catch (error) {
        logger.error(error)
        return false
      }
    },
    {
      enabled:
        usingNativeBridge === false &&
        !!token?.symbol &&
        !!sourceChain?.slug &&
        !!amountOut?.toString(),
    }
  )

  const approve = useCallback(
    async (amount: BigNumber, token: Token, spender: string) => {
      const signer = provider?.getSigner()
      if (!signer) {
        throw new Error('Wallet not connected')
      }
      if (!sourceChain) {
        return
      }
      if (token.isNativeToken) {
        return
      }

      const allowance = await token.allowance(spender)
      if (allowance.gte(amount)) {
        // console.log(`allowance > amount:`, allowance.toString(), amount.toString())
        return
      }

      const isNetworkConnected = await checkConnectedNetworkId(sourceChain.chainId)
      if (!isNetworkConnected) return

      const displayedAmount = toTokenDisplay(amount, token.decimals)

      const tx = await txConfirm?.show({
        kind: 'approval',
        inputProps: {
          tagline: `Allow Hop to spend your ${token.symbol} on ${sourceChain.name}`,
          amount: token.symbol === CanonicalToken.USDT ? undefined : displayedAmount,
          token,
          tokenSymbol: token.symbol,
          source: {
            network: {
              slug: sourceChain.slug,
              networkId: sourceChain.chainId,
            },
          },
        },
        onConfirm: async (approveAll: boolean) => {
          const approveAmount = approveAll ? constants.MaxUint256 : amount
          setApproving(true)
          return await token.approve(spender, approveAmount)
        },
      })

      if (tx?.hash) {
        setApproving(false)
        addTransaction(
          new Transaction({
            hash: tx.hash,
            networkName: sourceChain.slug,
            token,
          })
        )

        const res = await waitForTransaction(tx, { networkName: sourceChain.slug, token })
        if (res && 'replacementTx' in res) {
          return res.replacementTx
        }
      }
      setApproving(false)
      return tx
    },
    [provider, sourceChain, txConfirm, checkConnectedNetworkId, toTokenDisplay, approving]
  )

  const approveSourceToken = useCallback(async () => {
    if (!sourceChain) {
      throw new Error('No sourceChain selected')
    }

    if (!token) {
      throw new Error('No from token selected')
    }

    if (!amountOut) {
      throw new Error('No amount to approve')
    }

    const isNetworkConnected = await checkConnectedNetworkId(sourceChain.chainId)
    if (!isNetworkConnected) return

    const parsedAmount = amountToBN(amountOut.toString(), token.decimals)
    const bridge = sdk.bridge(token.symbol)

    let spender: string
    if (sourceChain.isLayer1) {
      const l1Bridge = await bridge.getL1Bridge()
      spender = l1Bridge.address
    } else {
      const ammWrapper = await bridge.getAmmWrapper(sourceChain.slug)
      spender = ammWrapper.address
    }

    const tx = await approve(parsedAmount, token, spender)

    await tx?.wait()
    setApproving(false)
  }, [sdk, token, sourceChain, amountOut])

  return { approve, checkApproval, needsApproval, approveSourceToken }
}
