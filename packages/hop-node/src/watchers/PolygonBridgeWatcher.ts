import BaseWatcher from './classes/BaseWatcher'
import chainSlugToId from 'src/utils/chainSlugToId'
import fetch from 'node-fetch'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { FxPortalClient } from '@fxportal/maticjs-fxportal'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Wallet, constants, providers } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { config as globalConfig } from 'src/config'
import { setProofApi, use } from '@maticnetwork/maticjs'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class PolygonBridgeWatcher extends BaseWatcher {
  ready: boolean = false
  l1Provider: any
  l2Provider: any
  l1Wallet: Wallet
  l2Wallet: Wallet
  chainId: number
  apiUrl: string
  polygonMainnetChainId: number = 137
  maticClient: any

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.lowPriority.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Polygon)
    this.l1Provider = this.l1Wallet.provider
    this.l2Provider = this.l2Wallet.provider

    this.chainId = chainSlugToId(config.chainSlug)
    this.apiUrl = `https://apis.matic.network/api/v1/${
      this.chainId === this.polygonMainnetChainId ? 'matic' : 'mumbai'
    }/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://apis.matic.network')

    this.maticClient = new FxPortalClient()

    this.init()
      .then(() => {
        this.ready = true
      })
      .catch((err: any) => {
        this.logger.error('matic client initialize error:', err)
        this.quit()
      })
  }

  async init () {
    const from = await this.l1Wallet.getAddress()
    const rootTunnel = globalConfig.addresses[this.tokenSymbol][Chain.Polygon].l1FxBaseRootTunnel
    await this.maticClient.init({
      network: this.chainId === this.polygonMainnetChainId ? 'mainnet' : 'testnet',
      version: this.chainId === this.polygonMainnetChainId ? 'v1' : 'mumbai',
      parent: {
        provider: this.l1Wallet,
        defaultConfig: {
          from
        }
      },
      child: {
        provider: this.l2Wallet,
        defaultConfig: {
          from
        }
      },
      erc20: {
        rootTunnel
      }
    })
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  async relayXDomainMessage (txHash: string): Promise<providers.TransactionResponse> {
    await this.tilReady()

    const commitTx: any = await this.bridge.getTransaction(txHash)
    const isCheckpointed = await this.isCheckpointed(commitTx.blockNumber)
    if (!isCheckpointed) {
      throw new Error('too early to exit')
    }

    const tx = await this.maticClient.erc20(constants.AddressZero, true).withdrawExitFaster(txHash)
    return tx.promise
  }

  private async isCheckpointed (l2BlockNumber: number) {
    const url = `${this.apiUrl}/${l2BlockNumber}`
    const res = await fetch(url)
    const json = await res.json()
    return json.message === 'success'
  }
}
export default PolygonBridgeWatcher
