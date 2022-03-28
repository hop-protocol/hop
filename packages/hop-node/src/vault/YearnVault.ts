import chainSlugToId from 'src/utils/chainSlugToId'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import getRpcUrl from 'src/utils/getRpcUrl'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import { BigNumber, Contract, constants, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Provider as EthersProvider } from '@ethersproject/abstract-provider'
import { Vault } from './Vault'
import { Yearn } from '@yfi/sdk'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

// make sure these addresses are always checksumed required by yearn-sdk
const EthAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
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
    token: EthAddress,
    vault: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
    zapIn: '0x92Be6ADB6a12Da0CA607F9d87DB2F9978cD6ec3E',
    zapOut: '0xd6b88257e91e4E4D4E990B3A858c849EF2DFdE8c'
  }
}

const instanceCache: Record<string, any> = {}

// the yearn sdk requires a provider with a 'getSigner' method
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

type ChainId = 1 | 42161

export class YearnVault implements Vault {
  chain: Chain
  token: string
  signer: any
  slippage = 0.01 // needed for zapIn/zapOut
  yearn: Yearn<any>
  decimals: number

  constructor (chain: Chain, token: string, signer: any) {
    if (!addresses[token]) {
      throw new Error('token is not supported')
    }
    this.chain = chain
    this.token = token
    const chainId = chainSlugToId(chain) as ChainId
    const url = getRpcUrl(chain)
    const provider = new Provider(url!, signer)
    this.signer = signer
    this.decimals = getTokenDecimals(token)
    if (!instanceCache[chain]) {
      instanceCache[chain] = new Yearn(chainId, {
        provider: {
          write: provider,
          read: provider
        } as any
      })
    }
    this.yearn = instanceCache[chain]
  }

  async getBalance (account?: string): Promise<BigNumber> {
    if (!account) {
      account = await this.signer.getAddress()
    }
    const { vault } = addresses[this.token]
    const contract = this.getErc20(vault)
    return contract.balanceOf(account)
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
    const needsApproval = await this.needsWithdrawalApproval(amount)
    if (needsApproval) {
      console.log('needs approval; sending approval tx')
      const tx = await this.approveWithdrawal()
      console.log('approval tx:', tx.hash)
      await tx.wait()
    }
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
    const { vault, zapOut } = addresses[this.token]
    const contract = this.getErc20(vault)
    return contract.approve(zapOut, amount)
  }

  async needsDepositApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const { token, vault } = addresses[this.token]
    if (token === EthAddress) {
      return false
    }
    const contract = this.getErc20(token)
    const allowance = await contract.allowance(account, vault)
    const needsApproval = allowance.lt(amount)
    return needsApproval
  }

  async needsWithdrawalApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const { token, vault, zapOut } = addresses[this.token]
    // the ETH vault token contract needs to approve zapOut contract as spender
    if (token !== EthAddress) {
      return false
    }
    const contract = this.getErc20(vault)
    const allowance = await contract.allowance(account, zapOut)
    const needsApproval = allowance.lt(amount)
    return needsApproval
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

  async getList () {
    const list = await this.yearn.vaults.getStatic()
    return list
  }

  private getErc20 (address: string) {
    return new Contract(address, erc20Abi, this.signer)
  }

  formatUnits (amount: BigNumber): number {
    return Number(formatUnits(amount.toString(), this.decimals))
  }

  parseUnits (amount: string | number): BigNumber {
    return parseUnits(amount.toString(), this.decimals)
  }
}
