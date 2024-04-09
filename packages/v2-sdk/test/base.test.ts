import { Base } from '#common/Base.js'
import { getAddress } from 'ethers/lib/utils.js'
import { providers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

describe.only('Base', () => {
  it('should get default providers', async () => {
    const base = new Base({
      network: 'mainnet'
    })
    const providers = base.chainProviders
    // console.log(providers)
    expect(providers).toBeDefined()
  })
})
