import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { toTokenDisplay } from 'src/utils'

export function useSufficientBalance(
  token?: Token,
  amount?: BigNumber,
  estimatedGasCost?: BigNumber,
  tokenBalance: BigNumber = BigNumber.from(0)
) {
  const [sufficientBalance, setSufficientBalance] = useState(false)
  const [warning, setWarning] = useState('')
  const [addressIsContract, setAddressIsContract] = useState<boolean>()
  const { address } = useWeb3Context()

  useEffect(() => {
    const chainProvider = token?.getChainProvider(token.chain.slug)
    if (address?.address) {
      chainProvider?.getCode(address.address).then(code => {
        if (code !== '0x') {
          setAddressIsContract(true)
        } else {
          setAddressIsContract(false)
        }
      })
    }
  }, [token, address])

  useEffect(() => {
    async function checkEnoughBalance() {
      if (!(token && amount)) {
        setWarning('')
        return setSufficientBalance(false)
      }

      let totalCost: BigNumber
      let enoughFeeBalance: boolean
      let enoughTokenBalance: boolean
      let message: string = ''

      const ntb = await token.getNativeTokenBalance()

      if (!estimatedGasCost) {
        const gasPrice = await token.signer.getGasPrice()
        estimatedGasCost = BigNumber.from(200e3).mul(gasPrice || 1e9)
      }

      if (token.isNativeToken) {
        totalCost = estimatedGasCost.add(amount)
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = enoughFeeBalance
      } else {
        totalCost = estimatedGasCost
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = tokenBalance.gte(amount)
      }

      if (enoughFeeBalance && enoughTokenBalance) {
        setWarning('')
        return setSufficientBalance(true)
      }

      if (!enoughFeeBalance) {
        const diff = totalCost.sub(ntb)
        message = `Insufficient balance to cover the cost of tx. Please add ${
          token.symbol
        } to pay for tx fees or reduce the amount by approximately ${toTokenDisplay(diff)} ${
          token.symbol
        }`

        if (!token.isNativeToken) {
          message = `Insufficient balance to cover the cost of tx. Please add ${token.nativeTokenSymbol} to pay for tx fees.`
        }
      } else if (!enoughTokenBalance) {
        message = `Insufficient ${token.symbol} balance.`
      }

      setWarning(message)
      setSufficientBalance(false)
    }

    // NOTE: For now, no accomodations are made for the tx sender
    // if they do not have enough funds to pay for the relay tx.
    // This can be addressed later.
    if (!addressIsContract) {
      checkEnoughBalance()
    } else {
      setWarning(
        `The connected account is detected to be a contract. Please execute relay transactions with caution.`
      )
    }
  }, [
    addressIsContract,
    token,
    amount?.toString(),
    estimatedGasCost?.toString(),
    tokenBalance.toString(),
  ])

  return {
    sufficientBalance,
    warning,
  }
}
