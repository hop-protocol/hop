import { constants } from 'ethers'
import {
  ethereumRpc,
  gnosisRpc,
  polygonRpc,
  optimismRpc,
  arbitrumRpc
} from './config'
import { Hop } from '@hop-protocol/sdk'
import wait from 'wait'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

type PoolData = {
  apr: number
}

type Data = { [token: string]: { [chain: string]: PoolData } }

type Response = {
  timestamp: number
  data: Data
}

class AprStats {
  sdk = new Hop('mainnet')

  constructor () {
    this.sdk.setChainProviderUrls({
      ethereum: ethereumRpc,
      gnosis: gnosisRpc,
      polygon: polygonRpc,
      optimism: optimismRpc,
      arbitrum: arbitrumRpc
    })

    console.log(
      'provider urls:',
      JSON.stringify(this.sdk.getChainProviderUrls())
    )
  }

  async getAllAprs () {
    const timestamp = (Date.now() / 1000) | 0
    const data: Data = {}
    const bridges: any = mainnetAddresses.bridges
    const promises: Promise<any>[] = []
    for (let token in bridges) {
      for (let chain in bridges[token]) {
        if (chain === 'ethereum') {
          continue
        }
        if (!bridges[token][chain]) {
          continue
        }
        if (bridges[token][chain].l2CanonicalToken === constants.AddressZero) {
          continue
        }
        if (!data[token]) {
          data[token] = {}
        }
        if (!data[token][chain]) {
          data[token][chain] = {
            apr: 0
          }
        }
        promises.push(
          this.getApr(token, chain)
            .then(apr => {
              console.log(`${chain}.${token} got apr`)
              data[token][chain].apr = apr
            })
            .catch(err => console.error(err))
        )
      }
    }

    await Promise.all(promises)
    console.log(JSON.stringify(data, null, 2))
    const response: Response = {
      timestamp,
      data
    }

    return response
  }

  async getApr (token: string, chain: string) {
    const bridge = this.sdk.bridge(token)
    const amm = bridge.getAmm(chain)
    const apr = await amm.getApr()
    return apr
  }
}

export default AprStats
