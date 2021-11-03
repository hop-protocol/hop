import erc20Abi from '@hop-protocol/core/abi/generated/MockERC20.json'
import { Contract, Wallet, providers } from 'ethers'
import { expectDefined } from './helpers'
import { privateKey } from './config'

test('debug', async () => {
  const provider = new providers.StaticJsonRpcProvider(
    'https://sokol.poa.network'
  )
  expectDefined(privateKey)
  const wallet = new Wallet(privateKey, provider)
  const tokenAddress = '0x452AED3fdB2E83A1352624321629180aB1489Dd0'
  const token = new Contract(tokenAddress, erc20Abi, wallet)
  console.log(wallet.address)
  const balance = await token.balanceOf(wallet.address)
  console.log(balance.toString())
})
