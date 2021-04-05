import Hop from 'src/Hop'
import { Wallet, providers } from 'ethers'
import { Chain, Route, Token, TokenAmount, Transfer } from 'src/models'
import { privateKey } from './config'
import pkg from '../package.json'

describe('sdk', () => {
  it('version', () => {
    const hop = new Hop()
    expect(hop.version).toBe(pkg.version)
  })
  it.skip('send', async () => {
    const hop = new Hop()

    const kovanProvider = new providers.StaticJsonRpcProvider(
      'https://kovan.rcp.hop.exchange'
    )
    const optimismProvider = new providers.StaticJsonRpcProvider(
      'https://kovan.optimism.io'
    )
    const signer = new Wallet(privateKey)
    const sourceChain = new Chain(42, 'Kovan', kovanProvider)
    const destChain = new Chain(69, 'Optimism Testnet', optimismProvider)
    const token = new Token(
      42,
      '0x7326510Cf9Ae0397dbBaF37FABba54f0A7b8D100',
      18,
      'USDC',
      'USD Coin'
    )
    const tokenAmount = new TokenAmount(token, '1000000')
    const route = new Route(sourceChain, destChain)
    const transfer = new Transfer(route, tokenAmount)
    const tx = await hop.connect(signer).send(transfer)
    expect(tx.hash).toBeTruthy()
  })
})
