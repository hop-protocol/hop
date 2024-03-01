import { wait } from '../utils/wait.js'
import { FxPortalClient } from '@fxportal/maticjs-fxportal'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { constants, providers } from 'ethers'
import { setProofApi, use } from '@maticnetwork/maticjs'

export class PolygonRelayer {
  network: string
  l1Provider: any
  l2Provider: any
  apiUrl: string
  maticClient: any
  ready: boolean = false

  constructor (network: string = 'goerli', l1Provider: providers.Provider, l2Provider: providers.Provider) {
    this.network = network
    this.l1Provider = l1Provider
    this.l2Provider = l2Provider
    this.apiUrl = `https://apis.matic.network/api/v1/${
      this.network === 'mainnet' ? 'matic' : 'mumbai'
    }/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://apis.matic.network')
    this.maticClient = new FxPortalClient()

    this.init()
      .catch((err: any) => {
        console.error('matic client initialize error:', err)
      })
  }

  async init () {
    const from = '' // sender address
    const rootTunnel = '' // l1FxBaseRootTunnel address
    await this.maticClient.init({
      network: this.network === 'mainnet' ? 'mainnet' : 'testnet',
      version: this.network === 'mainnet' ? 'v1' : 'mumbai',
      parent: {
        provider: this.l1Provider,
        defaultConfig: {
          from
        }
      },
      child: {
        provider: this.l2Provider,
        defaultConfig: {
          from
        }
      },
      erc20: {
        rootTunnel
      }
    })

    this.ready = true
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return this.tilReady()
  }

  async getExitPopulatedTx (l2TxHash: string): Promise<any> {
    await this.tilReady()

    const commitTx: any = await this.l2Provider.getTransaction(l2TxHash)
    const isCheckpointed = await this.isCheckpointed(commitTx.blockNumber)
    if (!isCheckpointed) {
      throw new Error('tx not checkpointed')
    }

    // TODO: get populated tx only
    const tx = await this.maticClient.erc20(constants.AddressZero, true).withdrawExitFaster(l2TxHash)
    const p = tx.promise
    if (!p) {
      throw new Error('no tx exists')
    }

    return p
  }

  async isCheckpointed (l2BlockNumber: number) {
    const url = `${this.apiUrl}/${l2BlockNumber}`
    const res = await fetch(url)
    const json = await res.json()
    return json.message === 'success'
  }
}
