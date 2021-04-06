import Hop from 'src/Hop'
import { Wallet, providers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Chain, Route, Token, TokenAmount, Transfer } from 'src/models'
import { privateKey } from './config'
import pkg from '../package.json'

describe('sdk', () => {
  const hop = new Hop()
  const signer = new Wallet(privateKey)
  it('version', () => {
    expect(hop.version).toBe(pkg.version)
  })
  it('send - using preconfigured token', async () => {
    const tokenAmount = parseUnits('0.1', 18)
    const tx = await hop
      .connect(signer)
      .bridge(Token.USDC)
      .send(tokenAmount, Chain.Kovan, Chain.Optimism)

    console.log('tx hash:', tx?.hash)

    expect(tx.hash).toBeTruthy()
  })
  it('send - using pre-onfigured token and bridge routes', async () => {
    const tokenAmount = parseUnits('0.1', 18)
    const tx = await hop
      .connect(signer)
      .bridge(Token.USDC, Chain.Kovan, Chain.Optimism)
      .send(tokenAmount)

    console.log('tx hash:', tx?.hash)

    expect(tx.hash).toBeTruthy()
  })
})
