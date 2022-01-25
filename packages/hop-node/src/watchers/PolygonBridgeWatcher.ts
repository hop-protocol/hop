import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import Web3 from 'web3'
import chainSlugToId from 'src/utils/chainSlugToId'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import fetch from 'node-fetch'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, Wallet, constants, providers } from 'ethers'
import { Event } from 'src/types'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { MaticPOSClient } from '@maticnetwork/maticjs'
import { config as globalConfig } from 'src/config'
type Config = {
  chainSlug: string
  tokenSymbol: string
  label?: string
  bridgeContract?: L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract
  isL1?: boolean
  dryMode?: boolean
}

class PolygonBridgeWatcher extends BaseWatcher {
  l1Provider: any
  l2Provider: any
  l1Wallet: Wallet
  l2Wallet: Wallet
  chainId: number
  apiUrl: string
  polygonMainnetChainId: number = 137
  maticPOSClient: any

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'PolygonBridgeWatcher',
      prefix: config.label,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      isL1: config.isL1,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Polygon)
    this.l1Provider = this.l1Wallet.provider
    this.l2Provider = this.l2Wallet.provider

    this.chainId = chainSlugToId(config.chainSlug)! // eslint-disable-line
    this.apiUrl = `https://apis.matic.network/api/v1/${
      this.chainId === this.polygonMainnetChainId ? 'matic' : 'mumbai'
    }/block-included`

    this.maticPOSClient = new MaticPOSClient({
      network: this.chainId === this.polygonMainnetChainId ? 'mainnet' : 'testnet',
      version: this.chainId === this.polygonMainnetChainId ? 'v1' : 'mumbai',
      maticProvider: new Web3.providers.HttpProvider(
        this.l2Provider.connection.url
      ),
      parentProvider: new Web3.providers.HttpProvider(
        this.l1Provider.connection.url
      )
    })
  }

  async start () {
    this.logger.debug(`polygon ${this.tokenSymbol} bridge watcher started`)
    this.started = true
    try {
      const l2TokenAddress =
        globalConfig.addresses[this.tokenSymbol][Chain.Polygon]?.l2CanonicalToken
      if (!l2TokenAddress) {
        throw new Error(
          `no token address found for ${this.tokenSymbol} on ${Chain.Polygon}`
        )
      }
      const l2Token = new Contract(l2TokenAddress, erc20Abi, this.l2Wallet)

      const transactionHashes: any = {}
      l2Token
        .on(
          'Transfer',
          (sender: string, to: string, data: string, event: Event) => {
            const { transactionHash } = event
            if (to === constants.AddressZero) {
              this.logger.debug(
                'received transfer event. tx hash:',
                transactionHash
              )
              transactionHashes[transactionHash] = event
            }
          }
        )
        .on('error', this.logger.error)

      while (true) {
        if (!this.started) {
          return
        }

        try {
          for (const transactionHash in transactionHashes) {
            const { blockNumber: l2BlockNumber } = transactionHashes[
              transactionHash
            ]
            const isCheckpointed = await this.isCheckpointed(l2BlockNumber)
            if (!isCheckpointed) {
              continue
            }

            delete transactionHashes[transactionHash]
            this.logger.info('sending polygon canonical bridge exit tx')
            const tx = await this.sendTransaction(transactionHash, this.tokenSymbol)
            this.logger.info(`polygon canonical bridge exit tx: ${tx.hash}`)
          }
        } catch (err) {
          this.logger.error('poll error:', err.message)
        }

        await wait(10 * 1000)
      }
    } catch (err) {
      this.logger.error('polygon bridge watcher error:', err.message)
      this.quit()
    }
  }

  async isCheckpointed (l2BlockNumber: number) {
    const url = `${this.apiUrl}/${l2BlockNumber}`
    const res = await fetch(url)
    const json = await res.json()
    return json.message === 'success'
  }

  async relayXDomainMessage (txHash: string): Promise<providers.TransactionResponse> {
    const tokenSymbol: string = this.tokenSymbol
    const recipient = await this.l1Wallet.getAddress()

    const rootTunnel =
      globalConfig.addresses[tokenSymbol][Chain.Polygon].l1FxBaseRootTunnel
    const tx = await (this.maticPOSClient).posRootChainManager.processReceivedMessage(
      rootTunnel,
      txHash,
      {
        from: recipient,
        encodeAbi: true
      }
    )

    return await this.l1Wallet.sendTransaction({
      to: rootTunnel,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  async sendTransaction (txHash: string, tokenSymbol: string) {
    const recipient = await this.l1Wallet.getAddress()
    const tx = await this.maticPOSClient.exitERC20(txHash, {
      from: recipient,
      encodeAbi: true
    })

    return await this.l1Wallet.sendTransaction({
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    const commitTx: any = await this.bridge.getTransaction(commitTxHash)
    const isCheckpointed = await this.isCheckpointed(commitTx.blockNumber)
    if (!isCheckpointed) {
      logger.warn(`transaction ${commitTxHash} not checkpointed`)
      return
    }

    logger.debug(
      `attempting to send relay message on polygon for commit tx hash ${commitTxHash}`
    )
    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping relayXDomainMessage`)
      return
    }
    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })
    try {
      const tx = await this.relayXDomainMessage(commitTxHash)
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
