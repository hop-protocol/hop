import { BigNumber, constants } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { Token, Chain } from '@hop-protocol/sdk'
import Transaction from 'src/models/Transaction'
import { toTokenDisplay } from 'src/utils'
import { useTransactionReplacement } from './useTransactionReplacement'
import { useQuery } from 'react-query'
import Network from 'src/models/Network'
import CanonicalBridge from 'src/models/CanonicalBridge'

async function getSpender(network, bridge) {
  if (network.isLayer1) {
    const l1Bridge = await bridge.getL1Bridge()
    return l1Bridge.address
  }

  const ammWrapper = await bridge.getAmmWrapper(network.slug)
  return ammWrapper.address
}

async function getTokenAllowance(token: Token, spender: string) {
  return token.allowance(spender)
}

const useApprove = (token?: Token, sourceNetwork?: Network, amountOut?: BigNumber) => {
  const { provider } = useWeb3Context()
  const { txConfirm, sdk } = useApp()
  const { waitForTransaction, addTransaction } = useTransactionReplacement()

  const { data: needsApproval } = useQuery(
    [
      `needsApproval:${token?.symbol}:${sourceNetwork?.slug}:${amountOut?.toString()}`,
      token?.symbol,
      sourceNetwork?.slug,
      amountOut?.toString(),
    ],
    async () => {
      if (!(token && sdk && sourceNetwork && amountOut)) {
        return
      }
      const signer = provider?.getSigner()
      const bridge = sdk.bridge(token.symbol)

      if (token.isNativeToken) {
        return false
      }

      const spender = await getSpender(sourceNetwork, bridge)
      const tokenAllowance = await getTokenAllowance(token, spender)
      return tokenAllowance.lte(amountOut.toString())
    },
    {
      enabled: !!token?.symbol && !!sourceNetwork?.slug && !!amountOut?.toString(),
      refetchInterval: 10e3,
    }
  )

  async function needsNativeBridgeApproval(
    l1CanonicalBridge: CanonicalBridge,
    sourceToken: Token,
    sourceTokenAmount: BigNumber
  ) {
    if (sourceToken.isNativeToken) {
      return
    }

    const allowance = await l1CanonicalBridge.getL1CanonicalAllowance()
    return allowance.lt(sourceTokenAmount)
  }

  const checkApproval = async (amount: BigNumber, token: Token, spender: string) => {
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
  }

  const approve = async (amount: BigNumber, token: Token, spender: string) => {
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
    const chain = Chain.fromSlug(token.chain.slug)
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
        const approveAmount = approveAll ? constants.MaxUint256 : amount
        return token.approve(spender, approveAmount)
      },
    })

    if (tx?.hash) {
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
  }

  return { approve, checkApproval, needsApproval, needsNativeBridgeApproval }
}

export default useApprove
