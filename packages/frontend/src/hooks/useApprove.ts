import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { BigNumber, constants } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { Token, Chain as ChainModel, HopBridge } from '@hop-protocol/sdk'
import Chain from 'src/models/Chain'
import Transaction from 'src/models/Transaction'
import { amountToBN, toTokenDisplay } from 'src/utils'
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

const useApprove = (
  token?: Token,
  sourceChain?: Chain,
  amountOut?: BigNumber,
  destinationChain?: Chain,
  setApproving?: any
) => {
  const { provider, checkConnectedNetworkId } = useWeb3Context()
  const { txConfirm, sdk } = useApp()
  const { waitForTransaction, addTransaction } = useTransactionReplacement()
  const [tokenAllowance, setTokenAllowance] = useState<BigNumber>()

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

        const approved = await token.allowance(spender)
        if (approved.gte(amount)) {
          return false
        }

        return true
      } catch (err: any) {
        return false
      }
    },
    [provider]
  )

  const { data: needsApproval } = useQuery(
    [
      `needsApproval:${token?.symbol}:${sourceChain?.slug}:${amountOut?.toString()}`,
      token?.symbol,
      sourceChain?.slug,
      amountOut?.toString(),
    ],
    async () => {
      if (!(token && sdk && sourceChain && amountOut)) {
        return false
      }

      try {
        const bridge = sdk.bridge(token.symbol)

        const parsedAmount = amountToBN(amountOut.toString(), token.decimals)
        if (token.isNativeToken) {
          return false
        }

        const spender = await getSpender(sourceChain, bridge)
        return checkApproval(parsedAmount, token, spender)

        // const spender = bridge.getSendApprovalAddress(sourceChain.slug, false)

        // const ta = await getTokenAllowance(token, spender, address?.address)
        // setTokenAllowance(ta)
        // return ta.lte(parsedAmount)
      } catch (error) {
        logger.error(error)
        return false
      }
    },
    {
      enabled: !!token?.symbol && !!sourceChain?.slug && !!amountOut?.toString(),
      refetchInterval: 10e3,
    }
  )

  const approve = useCallback(
    async (amount: BigNumber, token: Token, spender: string) => {
      const signer = provider?.getSigner()
      if (!signer) {
        throw new Error('Wallet not connected')
      }

      if (token.isNativeToken) {
        return
      }

      const approved = await token.allowance(spender)
      if (approved.gte(amount)) {
        return
      }

      const formattedAmount = toTokenDisplay(amount, token.decimals)
      const chain = ChainModel.fromSlug(token.chain.slug)
      const tx = await txConfirm?.show({
        kind: 'approval',
        inputProps: {
          tagline: `Allow Hop to spend your ${token.symbol} on ${chain.name}`,
          amount: token.symbol === 'USDT' ? undefined : formattedAmount,
          token,
          tokenSymbol: token.symbol,
          source: {
            network: {
              slug: token.chain?.slug,
              networkId: token.chain?.chainId,
            },
          },
        },
        onConfirm: async (approveAll: boolean) => {
          setApproving(true)
          const approveAmount = approveAll ? constants.MaxUint256 : amount
          return token.approve(spender, approveAmount)
        },
      })

      if (tx?.hash) {
        setApproving(false)
        addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: token.chain.slug,
            token,
          })
        )

        const res = await waitForTransaction(tx, { networkName: token.chain.slug, token })
        if (res && 'replacementTx' in res) {
          return res.replacementTx
        }
      }

      return tx
    },
    [provider, token, sourceChain, amountOut]
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

  return { approve, checkApproval, needsApproval, tokenAllowance, approveSourceToken }
}

export default useApprove
