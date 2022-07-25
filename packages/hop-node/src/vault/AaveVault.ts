import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import { BigNumber, Contract, constants } from 'ethers'
import { Chain } from 'src/constants'
import { Pool } from '@aave/contract-helpers'
import { Vault } from './Vault'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

const NativeTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

// https://github.com/aave/interface/blob/9aa7bc269e58e452def540f5b76f194373b5c61b/src/ui-config/marketsConfig.tsx
const aaveAddresses: Record<string, any> = {
  arbitrum: {
    LENDING_POOL: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    WETH_GATEWAY: '0xC09e69E79106861dF5d289dA88349f10e2dc6b5C'
  },
  ethereum: {
    LENDING_POOL: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
    WETH_GATEWAY: '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04'
  },
  polygon: {
    LENDING_POOL: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    WETH_GATEWAY: '0x9BdB5fcc80A49640c7872ac089Cc0e00A98451B6'
  }
}

// note: aave v3 on arbitirum, aave v2 on ethereum (v3 not available on ethereum)
const tokenAddresses: Record<string, any> = {
  USDC: {
    arbitrum: {
      token: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      aToken: '0x625e7708f30ca75bfd92586e17077590c60eb4cd'
    },
    ethereum: {
      token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      aToken: '0xbcca60bb61934080951369a648fb03df4f96263c'
    }
  },
  USDT: {
    arbitrum: {
      token: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      aToken: '0x6ab707aca953edaefbc4fd23ba73294241490620'
    },
    ethereum: {
      token: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      aToken: '0x3ed3b47dd13ec9a98b44e6204a523e766b225811'
    }
  },
  DAI: {
    arbitrum: {
      token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      aToken: '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee'
    },
    ethereum: {
      token: '0x6b175474e89094c44da98b954eedeac495271d0f',
      aToken: '0x028171bca77440897b824ca71d1c56cac55b68a3'
    }
  },
  ETH: {
    arbitrum: {
      token: NativeTokenAddress,
      aToken: '0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8'
    },
    ethereum: {
      token: NativeTokenAddress,
      aToken: '0x030ba81f1c18d280636f32af80b9aad02cf0854e'
    }
  },
  MATIC: {
    polygon: {
      token: NativeTokenAddress,
      aToken: '0x6d80113e533a2c0fe82eabd35f1875dcea89ea97'
    }
  }
}

export class AaveVault implements Vault {
  chain: Chain
  token: string
  signer: any
  provider: any
  decimals: number
  tokenAddress: string
  aTokenAddress: string
  pool: Pool

  constructor (chain: Chain, token: string, signer: any) {
    if (!tokenAddresses[token]) {
      throw new Error('token is not supported')
    }
    if (!tokenAddresses[token][chain]) {
      throw new Error('chain is not supported')
    }
    if (!aaveAddresses[chain]) {
      throw new Error('chain is not supported')
    }
    this.chain = chain
    this.token = token
    this.tokenAddress = tokenAddresses[token][chain].token
    this.aTokenAddress = tokenAddresses[token][chain].aToken
    this.provider = getRpcProvider(chain)!
    this.signer = signer.connect(this.provider)
    this.decimals = getTokenDecimals(token)

    this.pool = new Pool(this.provider, {
      POOL: aaveAddresses[chain].LENDING_POOL,
      WETH_GATEWAY: aaveAddresses[chain].WETH_GATEWAY
    })
  }

  async getBalance (account?: string): Promise<BigNumber> {
    if (!account) {
      account = await this.signer.getAddress()
    }
    const contract = this.getErc20(this.aTokenAddress)
    return contract.balanceOf(account)
  }

  async deposit (amount: BigNumber) {
    const account = await this.signer.getAddress()
    console.log('account:', account)

    const needsApproval = await this.needsDepositApproval(amount)
    if (needsApproval) {
      console.log('needs approval; sending approval tx')
      const tx = await this.approveDeposit()
      console.log('approval tx:', tx.hash)
      await tx.wait()
    }

    const deadline = Math.floor(Date.now() / 1000) + (60 * 60)
    let txs: any[] = []

    // available on aave v3 and doesn't work with DAI
    const canSupplyWithPermit = this.chain === 'arbitrum' && ['USDC', 'USDT'].includes(this.token)
    if (canSupplyWithPermit) {
      const dataToSign = await this.pool.signERC20Approval({
        user: account,
        reserve: this.tokenAddress,
        amount: this.formatUnits(amount).toString(),
        deadline: deadline.toString()
      })

      const parsedData = JSON.parse(dataToSign)
      const { domain, types, message: value } = parsedData
      delete types.EIP712Domain
      const signature = await this.signer._signTypedData(domain, types, value)

      txs = await this.pool.supplyWithPermit({
        user: account,
        reserve: this.tokenAddress,
        amount: this.formatUnits(amount).toString(),
        signature,
        deadline: deadline.toString()
      })
    } else {
      if (this.chain === Chain.Ethereum) {
        // aave v2
        txs = await this.pool.deposit({
          user: account,
          reserve: this.tokenAddress,
          amount: this.formatUnits(amount).toString()
        })
      } else {
        // aave v3
        txs = await this.pool.supply({
          user: account,
          reserve: this.tokenAddress,
          amount: this.formatUnits(amount).toString()
        })
      }
    }

    console.log('aave txs:', txs)
    console.log('attempting to deposit')

    let tx: any
    for (const item of txs) {
      console.log(await item.gas())
      const txPayload = await item.tx()
      if (txPayload.value) {
        txPayload.value = BigNumber.from(txPayload.value).toHexString()
      }
      tx = await this.signer.sendTransaction(txPayload)
      console.log(tx)
      await tx.wait()
    }

    return tx
  }

  async withdraw (amount: BigNumber) {
    const account = await this.signer.getAddress()
    console.log('account:', account)

    const needsApproval = await this.needsWithdrawalApproval(amount)
    if (needsApproval) {
      console.log('needs approval; sending approval tx')
      const tx = await this.approveWithdrawal()
      console.log('approval tx:', tx.hash)
      await tx.wait()
    }

    // aave v2 and v3
    const txs = await this.pool.withdraw({
      user: account,
      reserve: this.tokenAddress,
      amount: this.formatUnits(amount).toString(),
      aTokenAddress: this.aTokenAddress
    })

    console.log('aave txs:', txs)
    console.log('attempting to withdraw')

    let tx: any
    for (const item of txs) {
      console.log(await item.gas())
      const txPayload = await item.tx()
      tx = await this.signer.sendTransaction(txPayload)
      console.log(tx)
      await tx.wait()
    }
    return tx
  }

  async approveDeposit (amount: BigNumber = constants.MaxUint256) {
    const contract = this.getErc20(this.tokenAddress)
    const spender = aaveAddresses[this.chain].LENDING_POOL
    return contract.approve(spender, amount)
  }

  async approveWithdrawal (amount: BigNumber = constants.MaxUint256) {
    const contract = this.getErc20(this.aTokenAddress)
    const spender = aaveAddresses[this.chain].LENDING_POOL
    return contract.approve(spender, amount)
  }

  async needsDepositApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    if (this.tokenAddress === NativeTokenAddress) {
      return false
    }
    const contract = this.getErc20(this.tokenAddress)
    const spender = aaveAddresses[this.chain].LENDING_POOL
    const allowance = await contract.allowance(account, spender)
    const needsApproval = allowance.lt(amount)
    return needsApproval
  }

  async needsWithdrawalApproval (amount: BigNumber = constants.MaxUint256) {
    const account = await this.signer.getAddress()
    if (this.tokenAddress === NativeTokenAddress) {
      return false
    }
    const contract = this.getErc20(this.aTokenAddress)
    const spender = aaveAddresses[this.chain].LENDING_POOL
    const allowance = await contract.allowance(account, spender)
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
