import chainSlugToId from 'src/utils/chainSlugToId'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import getRpcUrl from 'src/utils/getRpcUrl'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import { BigNumber, Contract, constants, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Provider as EthersProvider } from '@ethersproject/abstract-provider'
import { Yearn } from '@yfi/sdk'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

const addresses: Record<string, any> = {
  USDC: {
    token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
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
    token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    vault: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c'
  },
  zapIn: '0x92Be6ADB6a12Da0CA607F9d87DB2F9978cD6ec3E',
  zapOut: '0xd6b88257e91e4E4D4E990B3A858c849EF2DFdE8c'
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

export class Vault {
  token: string
  signer: any
  slippage = 0.5
  yearn: any
  decimals: number

  constructor (token: string, signer: any) {
    this.token = token
    const chain = Chain.Ethereum
    const chainId: any = chainSlugToId(chain)
    const url: any = getRpcUrl(chain)
    const provider: any = new Provider(url, signer)
    this.signer = signer
    this.decimals = getTokenDecimals(token) as any
    this.yearn = new Yearn(chainId, {
      provider: {
        write: provider,
        read: provider
      }
    })
  }

  getErc20 (address: string) {
    return new Contract(address, erc20Abi, this.signer)
  }

  async getBalance () {
    const account = await this.signer.getAddress()
    const { vault } = addresses[this.token]
    const contract = this.getErc20(vault)
    return contract.balanceOf(account)
  }

  async getDepositOutcome (amount: BigNumber) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const outcome = await this.yearn.simulation.deposit(account, token, amount.toString(), vault, {
      slippage: this.slippage
    })

    if (!(outcome instanceof Object)) {
      console.error(outcome)
      throw new Error('expected object')
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

  async getWithdrawOutcome (amount: BigNumber) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const outcome = await this.yearn.simulation.withdraw(account, vault, amount.toString(), token, {
      slippage: this.slippage
    })

    if (!(outcome instanceof Object)) {
      console.error(outcome)
      throw new Error('expected object')
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

  async deposit (amount: BigNumber) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const needsApproval = await this.needsDepositApproval(amount)
    if (needsApproval) {
      console.log('needs approval; sending approval tx')
      const tx = await this.approveDeposit()
      console.log('approval tx:', tx.hash)
      await tx.wait()
    }
    console.log('attempting to deposit')
    const tx = await this.yearn.vaults.deposit(vault, token, amount.toString(), account, {
      slippage: this.slippage
    })
    return tx
  }

  async withdraw (amount: BigNumber) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    console.log('attempting to withdraw')
    const tx = await this.yearn.vaults.withdraw(vault, token, amount.toString(), account, {
      slippage: this.slippage
    })
    return tx
  }

  async approveDeposit (amount: BigNumber = constants.MaxUint256) {
    const { token, vault } = addresses[this.token]
    const contract = this.getErc20(token)
    return contract.approve(vault, amount)
  }

  async approveWithdrawal (amount: BigNumber = constants.MaxUint256) {
    const { vault } = addresses[this.token]
    const contract = this.getErc20(vault)
    const zapAddress = addresses.zapOut
    return contract.approve(zapAddress, amount)
  }

  async needsDepositApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const contract = this.getErc20(token)
    const allowance = await contract.allowance(account, vault)
    const needsApproval = allowance.lt(amount)
    return needsApproval
  }

  async needsWithdrawalApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    const contract = this.getErc20(vault)
    const zapAddress = addresses.zapOut
    const allowance = await contract.allowance(account, zapAddress)
    const needsApproval = allowance.lt(amount)
    return needsApproval
  }

  async availableLiquidity () {
    return this.getBalance()
  }

  async getList () {
    const list = await this.yearn.vaults.getStatic()
    return list
  }

  formatUnits (amount: BigNumber) {
    return Number(formatUnits(amount.toString(), this.decimals))
  }

  parseUnits (amount: string | number) {
    return parseUnits(amount.toString(), this.decimals)
  }
}
