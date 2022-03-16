import Logger from 'src/logger'
import balancerVaultAbi from '@hop-protocol/core/abi/static/BalancerVault.json'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import { BigNumber, Contract, Signer, constants } from 'ethers'
import { Chain } from 'src/constants'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { getLimitsForSlippage } from '@balancer-labs/sdk'

const addresses: Record<string, any> = {
  balancerVault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  DAI: {
    token: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    balancerBoostedTokenPool: '0x804CdB9116a10bB78768D3252355a1b18067bF8f',
    balancerStablePool: '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2',
    balancerBoostedTokenPoolId: '0x804cdb9116a10bb78768d3252355a1b18067bf8f0000000000000000000000fb',
    balancerStablePoolId: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe'
  }
}

const swapExactIn = 0

export class BalancerVault {
  chain: Chain
  token: string
  signer: Signer
  decimals: number
  contract: Contract
  logger: Logger

  constructor (chain: Chain, token: string, signer: Signer) {
    if (chain !== Chain.Ethereum) {
      throw new Error('currently only ethereum is supported')
    }
    if (token !== 'DAI') {
      throw new Error('currently only DAI is supported')
    }

    this.chain = chain
    this.token = token
    this.signer = signer
    this.decimals = getTokenDecimals(token)
    this.contract = new Contract(addresses.balancerVault, balancerVaultAbi, signer)
    this.logger = new Logger('BalancerVault')
  }

  async getBalance (account?: string): Promise<BigNumber> {
    if (!account) {
      account = await this.signer.getAddress()
    }
    const { balancerStablePool } = addresses[this.token]
    const contract = this.getErc20(balancerStablePool)
    return contract.balanceOf(account)
  }

  // example deposit tx: https://etherscan.io/tx/0xdeb59a631aa87cb932141b0bc7c993ba908b7fa0191abdca72eb1a42b8929973
  async deposit (amount: BigNumber): Promise<any> {
    const { token, balancerBoostedTokenPool, balancerStablePool, balancerBoostedTokenPoolId, balancerStablePoolId } = addresses[this.token]
    const account = await this.signer.getAddress()
    const contract = this.getErc20(token)
    const balance = await contract.balanceOf(account)
    const kind = swapExactIn
    const userData = '0x'
    const sender = account
    const recipient = account
    const fromInternalBalance = false
    const toInternalBalance = false
    const deadline = constants.MaxUint256
    const slippage = this.getSlippage()
    this.logger.debug('account:', account)

    if (balance.lt(amount)) {
      throw new Error(`not enough balance. have ${this.formatUnits(balance)}, need ${this.formatUnits(amount)}`)
    }

    const needsApproval = await this.needsDepositApproval(amount)
    if (needsApproval) {
      this.logger.debug('needs approval; sending approval tx')
      const tx = await this.approveDeposit()
      this.logger.debug('approval tx:', tx.hash)
      await tx.wait()
    }

    const swaps = [
      [
        balancerBoostedTokenPoolId,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        balancerStablePoolId,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      token,
      balancerBoostedTokenPool,
      balancerStablePool
    ]

    const funds = [
      sender,
      fromInternalBalance,
      recipient,
      toInternalBalance
    ]

    const tokensIn = [token]
    const tokensOut = [balancerStablePool]
    const deltas = await this.getDepositOutcome(amount)

    const limits = getLimitsForSlippage(
      tokensIn,
      tokensOut,
      kind,
      deltas,
      assets,
      slippage
    )

    const tx = await this.contract.batchSwap(
      kind,
      swaps,
      assets,
      funds,
      limits,
      deadline
    )

    return tx
  }

  async getDepositOutcome (amount: BigNumber): Promise<any> {
    const { token, balancerBoostedTokenPool, balancerStablePool, balancerBoostedTokenPoolId, balancerStablePoolId } = addresses[this.token]
    const account = await this.signer.getAddress()
    const kind = swapExactIn
    const userData = '0x'
    const sender = account
    const recipient = account
    const fromInternalBalance = false
    const toInternalBalance = false

    const swaps = [
      [
        balancerBoostedTokenPoolId,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        balancerStablePoolId,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      token,
      balancerBoostedTokenPool,
      balancerStablePool
    ]

    const funds = [
      sender,
      fromInternalBalance,
      recipient,
      toInternalBalance
    ]

    const deltas = await this.contract.callStatic.queryBatchSwap(
      kind,
      swaps,
      assets,
      funds
    )

    return deltas
  }

  // example withdraw tx: https://etherscan.io/tx/0x3b1c960139e8527f9b2155ee47ae4059c084cfa47377593c2130ae21c1903a17
  async withdraw (amount: BigNumber): Promise<any> {
    const { token, balancerBoostedTokenPool, balancerStablePool, balancerBoostedTokenPoolId, balancerStablePoolId } = addresses[this.token]
    const account = await this.signer.getAddress()
    const contract = this.getErc20(token)
    const balance = await contract.balanceOf(account)
    const kind = swapExactIn
    const userData = '0x'
    const sender = account
    const recipient = account
    const fromInternalBalance = false
    const toInternalBalance = false
    const deadline = constants.MaxUint256
    const slippage = this.getSlippage()
    this.logger.debug('account:', account)

    if (balance.lt(amount)) {
      throw new Error(`not enough balance. have ${this.formatUnits(balance)}, need ${this.formatUnits(amount)}`)
    }

    const swaps = [
      [
        balancerStablePoolId,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        balancerBoostedTokenPoolId,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      balancerStablePool,
      balancerBoostedTokenPool,
      token
    ]

    const funds = [
      sender,
      fromInternalBalance,
      recipient,
      toInternalBalance
    ]

    const deltas = await this.getWithdrawOutcome(amount)

    const limits = getLimitsForSlippage(
      [balancerStablePool], // tokensIn
      [token], // tokensOut
      0, // SwapExactIn
      deltas,
      assets,
      slippage
    )

    const tx = await this.contract.batchSwap(
      kind,
      swaps,
      assets,
      funds,
      limits,
      deadline
    )

    return tx
  }

  async getWithdrawOutcome (amount: BigNumber): Promise<any> {
    const { token, balancerBoostedTokenPool, balancerStablePool, balancerBoostedTokenPoolId, balancerStablePoolId } = addresses[this.token]
    const account = await this.signer.getAddress()
    const kind = swapExactIn
    const userData = '0x'
    const sender = account
    const recipient = account
    const fromInternalBalance = false
    const toInternalBalance = false

    const swaps = [
      [
        balancerStablePoolId,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        balancerBoostedTokenPoolId,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      balancerStablePool,
      balancerBoostedTokenPool,
      token
    ]

    const funds = [
      sender,
      fromInternalBalance,
      recipient,
      toInternalBalance
    ]

    const deltas = await this.contract.callStatic.queryBatchSwap(
      kind,
      swaps,
      assets,
      funds
    )

    return deltas
  }

  async approveDeposit (amount: BigNumber = constants.MaxUint256) {
    const { token } = addresses[this.token]
    const contract = this.getErc20(token)
    return contract.approve(addresses.balancerVault, amount)
  }

  async needsDepositApproval (amount: BigNumber = constants.MaxUint256) {
    const { token } = addresses[this.token]
    const account = await this.signer.getAddress()
    const contract = this.getErc20(token)
    const allowance = await contract.allowance(account, addresses.balancerVault)
    const needsApproval = allowance.lt(amount)
    return needsApproval
  }

  // slippage example: 5%=50000000000000000
  getSlippage () {
    return this.parseUnits('0.001') // 0.01% (0.001) (1000000000000000)
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
