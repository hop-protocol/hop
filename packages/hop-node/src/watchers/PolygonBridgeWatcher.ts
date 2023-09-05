import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import fetch from 'node-fetch'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { FxPortalClient } from '@fxportal/maticjs-fxportal'
import { IChainWatcher } from './classes/IChainWatcher'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Signer, providers, utils } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { config as globalConfig } from 'src/config'
import { setProofApi, use } from '@maticnetwork/maticjs'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class PolygonBridgeWatcher extends BaseWatcher implements IChainWatcher {
  ready: boolean = false
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
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

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Polygon)
    this.l1Provider = this.l1Wallet.provider
    this.l2Provider = this.l2Wallet.provider

    this.chainId = chainSlugToId(config.chainSlug)
    this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${
      this.chainId === this.polygonMainnetChainId ? 'matic' : 'mumbai'
    }/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.maticClient = new FxPortalClient()

    this.init()
      .catch((err: any) => {
        this.logger.error('matic client initialize error:', err)
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
    this.ready = true
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  async isCheckpointed (l2BlockNumber: number) {
    const url = `${this.apiUrl}/${l2BlockNumber}`
    const res = await fetch(url)
    const json = await res.json()
    return json.message === 'success'
  }

  async relayXDomainMessage (l2TxHash: string): Promise<providers.TransactionResponse> {
    await this.tilReady()

    // As of Jun 2023, the maticjs-fxportal client errors out with an underflow error
    // To resolve the issue, this logic just rips out the payload generation and sends the tx manually

    // Generate payload
    const logEventSig = '0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036'
    const payload = await this.maticClient.exitUtil.buildPayloadForExit(l2TxHash, logEventSig, true)

    // Create tx data
    const abi = ['function receiveMessage(bytes)']
    const iface = new utils.Interface(abi)
    const data = iface.encodeFunctionData('receiveMessage', [payload])

    // Generate tx and send
    const rootTunnel = globalConfig.addresses[this.tokenSymbol][Chain.Polygon].l1FxBaseRootTunnel
    return this.l1Wallet.sendTransaction({
      to: rootTunnel,
      data
    })
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger): Promise<void> {
    const commitTx: any = await this.bridge.getTransaction(commitTxHash)
    const isCheckpointed = await this.isCheckpointed(commitTx.blockNumber)
    if (!isCheckpointed) {
      logger.warn(`transaction ${commitTxHash} not checkpointed`)
      return
    }

    logger.debug(
      `attempting to send relay message on polygon for commit tx hash ${commitTxHash}`
    )

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping relayXDomainMessage`)
      return
    }
    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    let tx
    try {
      tx = await this.relayXDomainMessage(commitTxHash)
      if (!tx) {
        logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
        return
      }
    } catch (err) {
      logger.error(`relayXDomainMessage error: ${err.message}`)
      return
    }
    const msg = `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx ${tx.hash}`
    logger.info(msg)
    this.notifier.info(msg)
  }
}
export default PolygonBridgeWatcher
