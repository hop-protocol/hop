import balancerVaultAbi from '@hop-protocol/core/abi/static/BalancerVault.json'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import { BigNumber, Contract, Signer, constants } from 'ethers'
import { Chain } from 'src/constants'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { getLimitsForSlippage } from '@balancer-labs/sdk'

const vaultAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'
const daiTokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const balancerDaiTokenAddress = '0x804CdB9116a10bB78768D3252355a1b18067bF8f'
const balancerStablePool = '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2'

export class BalancerVault {
  chain: Chain
  token: string
  signer: any
  decimals: number
  contract: Contract

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
    this.contract = new Contract(vaultAddress, balancerVaultAbi, signer)
  }

  async getBalance (account?: string): Promise<BigNumber> {
    if (!account) {
      account = await this.signer.getAddress()
    }
    const contract = this.getErc20(balancerStablePool)
    return contract.balanceOf(account)
  }

  async deposit (amount: BigNumber): Promise<any> {
    // example tx: https://etherscan.io/tx/0xdeb59a631aa87cb932141b0bc7c993ba908b7fa0191abdca72eb1a42b8929973

    const account = await this.signer.getAddress()
    console.log('account:', account)
    const contract = this.getErc20(daiTokenAddress)
    const balance = await contract.balanceOf(account)

    if (balance.lt(amount)) {
      throw new Error(`not enough balance. have ${this.formatUnits(balance)}, need ${this.formatUnits(amount)}`)
    }

    const needsApproval = await this.needsDepositApproval(amount)
    if (needsApproval) {
      console.log('needs approval; sending approval tx')
      const tx = await this.approveDeposit()
      console.log('approval tx:', tx.hash)
      await tx.wait()
    }

    const kind = 0 // SwapExactIn
    const poolId1 = '0x804cdb9116a10bb78768d3252355a1b18067bf8f0000000000000000000000fb' // dai
    const poolId2 = '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe' // stable pool
    const userData = '0x'

    const swaps = [
      [
        poolId1,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        poolId2,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      daiTokenAddress,
      balancerDaiTokenAddress,
      balancerStablePool
    ]

    const funds = [
      account, // sender
      false, // fromInternalBalance
      account, // recipient
      false // toInternalBalance
    ]

    const deadline = constants.MaxUint256
    const deltas = await this.getDepositOutcome(amount)

    // ie 5%=50000000000000000.
    // const slippage = '10000000000000000' // 0.1% (0.01)
    const slippage = '1000000000000000' // 0.01% (0.001)
    const limits = getLimitsForSlippage(
      [daiTokenAddress], // tokensIn
      [balancerStablePool], // tokensOut
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

  async getDepositOutcome (amount: BigNumber): Promise<any> {
    const account = await this.signer.getAddress()
    const kind = 0
    const poolId1 = '0x804cdb9116a10bb78768d3252355a1b18067bf8f0000000000000000000000fb'
    const poolId2 = '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe'
    const userData = '0x'

    const swaps = [
      [
        poolId1,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        poolId2,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      daiTokenAddress,
      balancerDaiTokenAddress,
      balancerStablePool
    ]

    const funds = [
      account, // sender
      false, // fromInternalBalance
      account, // recipient
      false // toInternalBalance
    ]

    const deltas = await this.contract.callStatic.queryBatchSwap(
      kind,
      swaps,
      assets,
      funds
    )

    return deltas
  }

  async withdraw (amount: BigNumber): Promise<any> {
    // example tx: https://etherscan.io/tx/0x3b1c960139e8527f9b2155ee47ae4059c084cfa47377593c2130ae21c1903a17

    const account = await this.signer.getAddress()
    console.log('account:', account)
    const contract = this.getErc20(daiTokenAddress)
    const balance = await contract.balanceOf(account)

    if (balance.lt(amount)) {
      throw new Error(`not enough balance. have ${this.formatUnits(balance)}, need ${this.formatUnits(amount)}`)
    }

    const kind = 0 // SwapExactIn
    const poolId1 = '0x804cdb9116a10bb78768d3252355a1b18067bf8f0000000000000000000000fb' // dai
    const poolId2 = '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe' // stable pool
    const userData = '0x'

    const swaps = [
      [
        poolId2,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        poolId1,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      balancerStablePool,
      balancerDaiTokenAddress,
      daiTokenAddress
    ]

    const funds = [
      account, // sender
      false, // fromInternalBalance
      account, // recipient
      false // toInternalBalance
    ]

    const deadline = constants.MaxUint256
    const deltas = await this.getWithdrawOutcome(amount)

    // ie 5%=50000000000000000.
    // const slippage = '10000000000000000' // 0.1% (0.01)
    const slippage = '1000000000000000' // 0.01% (0.001)
    const limits = getLimitsForSlippage(
      [balancerStablePool], // tokensIn
      [daiTokenAddress], // tokensOut
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
    const account = await this.signer.getAddress()
    const kind = 0
    const poolId1 = '0x804cdb9116a10bb78768d3252355a1b18067bf8f0000000000000000000000fb'
    const poolId2 = '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe'
    const userData = '0x'

    const swaps = [
      [
        poolId2,
        0, // assetInIndex
        1, // assetOutIndex
        amount,
        userData
      ],
      [
        poolId1,
        1, // assetInIndex
        2, // assetOutIndex
        0, // amount
        userData
      ]
    ]

    const assets = [
      balancerStablePool,
      balancerDaiTokenAddress,
      daiTokenAddress
    ]

    const funds = [
      account, // sender
      false, // fromInternalBalance
      account, // recipient
      false // toInternalBalance
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
    const contract = this.getErc20(daiTokenAddress)
    return contract.approve(vaultAddress, amount)
  }

  async needsDepositApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    const contract = this.getErc20(daiTokenAddress)
    const allowance = await contract.allowance(account, vaultAddress)
    const needsApproval = allowance.lt(amount)
    return needsApproval
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
