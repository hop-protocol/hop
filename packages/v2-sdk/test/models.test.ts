import { getToken, getGateway, getPath } from '#models/index.js'
import { setUpRails } from './fixture.js'

describe('Models', () => {

  const { rails, chains } = setUpRails()

  test('getToken() should return a token by symbol', () => {
    const token = getToken('ETH')

    expect(token).toBeDefined()
    expect(token.symbol).toBe('ETH')
    expect(token.name).toBe('Ethereum')
    expect(token.decimals).toBe(18)
    expect(token.isStableCoin).toBe(false)
  })

  test('The Gateway model should return the calculated path address', async () => {
    const gateway = getGateway(chains[0].chainId)
    const path = getPath('0xf2562f695ac4ba9361f3c5f05041d5f53ec86062b47561fe0d9f29e1675b5ace')
    const calculatedPathAddress = gateway.getPathContractAddress(path.pathId)

    const pathAddress = await rails.getRailsPathAddress(path, chains[0])

    expect(calculatedPathAddress).toBe(pathAddress)
  })
})
