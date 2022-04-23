import { BigNumber, constants } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { Token, Chain } from '@hop-protocol/sdk'
import Transaction from 'src/models/Transaction'
import { toTokenDisplay } from 'src/utils'
import { useTransactionReplacement } from './useTransactionReplacement'

const useApprove = token => {
  const { provider } = useWeb3Context()
  const { txConfirm } = useApp()
  const { waitForTransaction, addTransaction } = useTransactionReplacement()

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

  return { approve, checkApproval }
}

export default useApprove
