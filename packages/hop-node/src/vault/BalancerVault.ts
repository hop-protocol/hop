import balancerVaultAbi from '@hop-protocol/core/abi/static/BalancerVault.json'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import { BigNumber, Contract, Signer, constants } from 'ethers'
import { Chain } from 'src/constants'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

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
    /*
    const config : BalancerSdkConfig = {
      network: Network.MAINNET,
      rpcUrl: getRpcUrl(Chain.Ethereum)!
    }

    const balancer = new BalancerSDK(config)

    console.log(balancer.vault.batchSwap)
    */
    // const provider = getRpcProvider(Chain.Ethereum)
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
    const contract = this.getErc20(vaultAddress)
    return contract.balanceOf(account)
  }

  async deposit (amount: BigNumber): Promise<any> {
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
    const limits = [
      amount,
      0,
      0 // TODO
    ]
    const deadline = constants.MaxUint256

    const tx = await this.contract.callStatic.queryBatchSwap(
      kind,
      swaps,
      assets,
      funds
      // limits,
      // deadline
    )
    return tx
  }

  async withdraw (amount: BigNumber): Promise<any> {
    return BigNumber.from(0)
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
