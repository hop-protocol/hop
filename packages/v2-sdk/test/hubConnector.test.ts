import { HubConnector } from '#hubConnector/index.js'
import dotenv from 'dotenv'

dotenv.config()

describe('HubConnector', () => {
  const hubConnector = new HubConnector({
    chainProviders: HubConnector.getDefaultChainRpcProviders('mainnet')
  })
  it.skip('should populate the connectTargets transaction', async () => {
    const hubChainId = 1
    const spokeChainId = 10
    const target1 = '0xTODO'
    const target2 = '0xTODO'
    const txData = await hubConnector.populateTransaction.connectTargets({
      hubChainId,
      spokeChainId,
      target1,
      target2
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
})
