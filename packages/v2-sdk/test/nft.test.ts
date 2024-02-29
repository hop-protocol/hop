import { Nft } from '../src/Nft.js'
require('dotenv').config()

describe('Nft', () => {
  it('should get populated mintNft transaction', async () => {
    const nft = new Nft('goerli')
    const txData = await nft.populateTransaction.mintNft({
      contractAddress: '0xEe2B218b9cB28389fABcf8EA1E656C06ECe519Ed',
      fromChainId: 5,
      tokenId: 1337,
      recipient: '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    })

    console.log(txData)

    expect(txData.data).toContain('0x')
  })
})
