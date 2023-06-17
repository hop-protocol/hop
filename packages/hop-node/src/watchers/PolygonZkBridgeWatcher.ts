import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Signer, providers, utils } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'
import { config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class PolygonZkBridgeWatcher extends BaseWatcher {
  ready: boolean = false
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
  chainId: number
  apiUrl: string
  polygonzkMainnetChainId: number = 1101
  zkEvmClient: ZkEvmClient
  messengerAddress: string

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.PolygonZk)
    this.l1Provider = this.l1Wallet.provider
    this.l2Provider = this.l2Wallet.provider

    this.chainId = chainSlugToId(config.chainSlug)
    this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${
      this.chainId === this.polygonzkMainnetChainId ? 'matic' : 'mumbai'
    }/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()
    this.messengerAddress = this.chainId === this.polygonzkMainnetChainId ? '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe' : '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7'

    this.init()
      .catch((err: any) => {
        this.logger.error('zkEvmClient initialize error:', err)
      })
  }

  async init () {
    const from = await this.l1Wallet.getAddress()
    await this.zkEvmClient.init({
      network: this.chainId === this.polygonzkMainnetChainId ? 'mainnet' : 'testnet',
      version: this.chainId === this.polygonzkMainnetChainId ? 'v1' : 'blueberry',
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

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    await this.tilReady()

    logger.debug(
      `attempting to send relay message on polygonzk for commit tx hash ${commitTxHash}`
    )

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping relayXDomainMessage`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    try {
      const networkId = 1
      const signer = this.l1Wallet
      const tx = await this._relayXDomainMessage(commitTxHash, networkId, signer)
      if (!tx) {
        logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
        return
      }

      const msg = `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx ${tx.hash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      this.logger.error('relayXDomainMessage error:', err.message)

      const {
        unrelayableErrors
      } = this.getErrorType(err.message)

      // This error occurs if a poll happened while a message was not yet published
      if (unrelayableErrors) {
        throw new Error('unrelayable, try again later')
      }

      throw err
    }
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    await this.tilReady()

    try {
      const networkId = 0
      const signer = this.l2Wallet
      return await this._relayXDomainMessage(l1TxHash, networkId, signer)
    } catch (err) {
      throw new Error(`relayL1ToL2Message error: ${err.message}`)
    }
  }

  async relayXDomainMessage (commitTxHash: string): Promise<providers.TransactionResponse> {
    await this.tilReady()

    return this._relayXDomainMessage(commitTxHash)
  }

  async _relayXDomainMessage (commitTxHash: string, networkId: number = 1, wallet: Signer = this.l2Wallet): Promise<providers.TransactionResponse> {
    let isRelayable
    if (networkId === 0) {
      isRelayable = await this.zkEvmClient.isDepositClaimable(commitTxHash)
    } else {
      isRelayable = await this.zkEvmClient.isWithdrawExitable(commitTxHash)
    }
    if (!isRelayable) {
      throw new Error('expected deposit to be claimable')
    }

    // As of Jun 2023, the SDK does not provide a claimMessage convenience function.
    // To resolve the issue, this logic just rips out the payload generation and sends the tx manually
    const isParent = networkId === 0
    const claimPayload = await this.zkEvmClient.bridgeUtil.buildPayloadForClaim(commitTxHash, isParent, networkId)

    const abi = ['function claimMessage(bytes32[32],uint32,bytes32,bytes32,uint32,address,uint32,address,uint256,bytes)']
    const iface = new utils.Interface(abi)
    const data = iface.encodeFunctionData('claimMessage', [
      claimPayload.smtProof,
      claimPayload.index,
      claimPayload.mainnetExitRoot,
      claimPayload.rollupExitRoot,
      claimPayload.originNetwork,
      claimPayload.originTokenAddress,
      claimPayload.destinationNetwork,
      claimPayload.destinationAddress,
      claimPayload.amount,
      claimPayload.metadata
    ])

    return wallet.sendTransaction({
      to: this.messengerAddress,
      data
    })
  }

  getErrorType (errMessage: string) {
    const unrelayableErrors = errMessage.includes('expected deposit to be claimable')

    return {
      unrelayableErrors
    }
  }
}
export default PolygonZkBridgeWatcher
