import chainSlugToId from 'src/utils/chainSlugToId'
import getRpcUrl from 'src/utils/getRpcUrl'
import { BigNumber, constants, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Provider as EthersProvider } from '@ethersproject/abstract-provider'
import { Yearn } from '@yfi/sdk'

const addresses: Record<string, any> = {
  USDC: {
    token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    vault: '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE'
  },
  USDT: {
    token: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    vault: '0x7Da96a3891Add058AdA2E826306D812C638D87a7'
  },
  DAI: {
    token: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    vault: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95'
  },
  ETH: {
    token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    vault: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c'
  }
}

class Provider extends providers.StaticJsonRpcProvider implements EthersProvider {
  signer: any
  constructor (url: string, signer: any) {
    super(url)
    this.signer = signer
  }

  getSigner (accountOrIndex?: string | number) {
    return this.signer
  }
}

export class Strategy {
  token: string
  signer: any
  slippage = 0.5
  yearn: any

  constructor (token: string, signer: any) {
    this.token = token
    const chain = Chain.Ethereum
    const chainId: any = chainSlugToId(chain)
    const url: any = getRpcUrl(chain)
    const provider: any = new Provider(url, signer)
    this.signer = signer
    this.yearn = new Yearn(chainId, {
      provider: {
        write: provider,
        read: provider
      }
    })
  }

  async simulateDeposit (amount: BigNumber) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const outcome = await this.yearn.simulation.deposit(account, token, amount.toString(), vault, {
      slippage: this.slippage
    })

    if (typeof outcome !== 'object') {
      return outcome
    }

    return {
      sourceTokenAddress: outcome.sourceTokenAddress,
      sourceTokenAmount: BigNumber.from(outcome.sourceTokenAmount),
      targetTokenAddress: outcome.targetTokenAddress,
      targetTokenAmount: BigNumber.from(outcome.targetTokenAmount),
      targetTokenAmountUsd: BigNumber.from(outcome.targetTokenAmountUsdc),
      targetUnderlyingTokenAddress: outcome.targetUnderlyingTokenAddress,
      targetUnderlyingTokenAmount: BigNumber.from(outcome.targetUnderlyingTokenAmount),
      conversionRate: outcome.conversionRate,
      slippage: outcome.slippage
    }
  }

  async simulateWithdraw (amount: BigNumber) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const outcome = await this.yearn.simulation.withdraw(account, vault, amount.toString(), token, {
      slippage: this.slippage
    })

    return outcome
  }

  async deposit (amount: BigNumber) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const needsApproval = await this.needsApproval(amount)
    if (needsApproval) {
      console.log('needs approval; sending approval tx')
      const tx = await this.approve()
      console.log('tx', tx)
      await tx.wait()
    }
    const outcome = await this.yearn.vaults.deposit(vault, token, amount.toString(), account, {
      slippage: this.slippage
    })
    return outcome
  }

  async withdraw (amount: BigNumber) {
  }

  async simulateApprove (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const responseId = await this.yearn.simulation.approve(account, token, amount.toString(), vault, {} as any)
    return responseId
  }

  async approve (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const tx = await this.yearn.vaults.approve(vault, token, amount.toString(), account)
    return tx
  }

  async needsApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const needsApproval = await this.yearn.simulation.depositNeedsApproving(account, token, vault, amount.toString(), this.signer)
    return needsApproval
  }

  async availableLiquidity () {
  }
}
