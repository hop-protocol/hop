import BaseWatcher from './classes/BaseWatcher'
import Web3 from 'web3'
import chalk from 'chalk'
import fetch from 'node-fetch'
import queue from 'src/decorators/queue'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, Wallet, constants, providers } from 'ethers'
import { Event } from 'src/types'
import { MaticPOSClient } from '@maticnetwork/maticjs'
import { chainSlugToId, getRpcUrls, wait } from 'src/utils'
import { erc20Abi } from '@hop-protocol/core/abi'
import { config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  label?: string
  bridgeContract?: Contract
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

    this.l1Provider = new providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Ethereum)[0]
    )
    this.l2Provider = new providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Polygon)[0]
    )
    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Polygon)

    this.chainId = chainSlugToId(config.chainSlug)
    this.apiUrl = `https://apis.matic.network/api/v1/${
      this.chainId === this.polygonMainnetChainId ? 'matic' : 'mumbai'
    }/block-included`
  }

  async start () {
    this.logger.debug(`polygon ${this.tokenSymbol} bridge watcher started`)
    this.started = true
    try {
      // const l1Wallet = wallets.get(Chain.Ethereum)
      // const tokenAddress = addresses.DAI.polygon.l2CanonicalToken

      // const l1RootChainAddress = addresses[token][Chain.Polygon].l1PosRootChainManager
      // const l2TokenAddress = '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1' // dummy erc20
      const l2TokenAddress =
        globalConfig.tokens[this.tokenSymbol][Chain.Polygon]?.l2CanonicalToken
      if (!l2TokenAddress) {
        throw new Error(
          `no token address found for ${this.tokenSymbol} on ${Chain.Polygon}`
        )
      }
      const l2Token = new Contract(l2TokenAddress, erc20Abi, this.l2Wallet)
      /*
      const l1RootChain = new Contract(
        l1RootChainAddress,
        l1PolygonPosRootChainManagerAbi,
        this.l2Wallet
      )
      */

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

        // const transactionHash= '0x3f5997c83acf26d8628c6ba5b410271834a3aa71ca7f1f60a2b2bfb83127db41'
        // const event = await l2Token.provider.getTransaction(transactionHash)
        // transactionHashes[transactionHash] = event

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
            this.logger.info(
              'polygon canonical bridge exit tx:',
              chalk.bgYellow.black.bold(tx.hash)
            )
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

  async relayMessage (txHash: string, tokenSymbol: string) {
    const recipient = await this.l1Wallet.getAddress()
    const maticPOSClient = new MaticPOSClient({
      network: this.chainId === this.polygonMainnetChainId ? 'mainnet' : 'testnet',
      version: this.chainId === this.polygonMainnetChainId ? 'v1' : 'mumbai',
      maticProvider: new Web3.providers.HttpProvider(
        this.l2Provider.connection.url
      ),
      parentProvider: new Web3.providers.HttpProvider(
        this.l1Provider.connection.url
      ),
      posRootChainManager:
        globalConfig.tokens[tokenSymbol][Chain.Polygon].l1PosRootChainManager,
      posERC20Predicate:
        globalConfig.tokens[tokenSymbol][Chain.Polygon].l1PosPredicate
    })

    // signature source: https://github.com/maticnetwork/pos-portal/blob/d06271188412a91ab9e4bdea4bbbfeb6cb9d7669/contracts/tunnel/BaseRootTunnel.sol#L21
    const sig =
      '0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036'
    const rootTunnel =
      globalConfig.tokens[tokenSymbol][Chain.Polygon].l1FxBaseRootTunnel
    const tx = await (maticPOSClient as any).posRootChainManager.processReceivedMessage(
      rootTunnel,
      txHash,
      {
        from: recipient,
        // gasLimit: 500_000,
        encodeAbi: true
      }
    )

    return this.l1Wallet.sendTransaction({
      to: rootTunnel,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  @queue
  async sendTransaction (txHash: string, tokenSymbol: string) {
    const recipient = await this.l1Wallet.getAddress()
    const maticPOSClient = new MaticPOSClient({
      network: this.chainId === 1 ? 'mainnet' : 'testnet',
      version: this.chainId === 1 ? 'v1' : 'mumbai',
      maticProvider: new Web3.providers.HttpProvider(
        this.l2Provider.connection.url
      ),
      parentProvider: new Web3.providers.HttpProvider(
        this.l1Provider.connection.url
      ),
      posRootChainManager:
        globalConfig.tokens[tokenSymbol][Chain.Polygon].l1PosRootChainManager,
      posERC20Predicate:
        globalConfig.tokens[tokenSymbol][Chain.Polygon].l1PosPredicate
    })
    const tx = await maticPOSClient.exitERC20(txHash, {
      from: recipient,
      encodeAbi: true
    })

    return this.l1Wallet.sendTransaction({
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gas
    })
  }

  async handleCommitTxHash (commitTxHash: string, transferRootHash: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const destinationChainId = dbTransferRoot?.destinationChainId
    const commitTx: any = await this.bridge.getTransaction(commitTxHash)
    const isCheckpointed = await this.isCheckpointed(commitTx.blockNumber)
    if (!isCheckpointed) {
      return
    }

    this.logger.debug(
        `attempting to send relay message on polygon for commit tx hash ${commitTxHash}`
    )
    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      this.logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping relayMessage`)
      return
    }
    const tx = await this.relayMessage(commitTxHash, this.tokenSymbol)
    await this.db.transferRoots.update(transferRootHash, {
      sentConfirmTxAt: Date.now()
    })
    tx?.wait()
      .then(async (receipt: providers.TransactionReceipt) => {
        if (receipt.status !== 1) {
          await this.db.transferRoots.update(transferRootHash, {
            sentConfirmTxAt: 0
          })
          throw new Error('status=0')
        }

        if (destinationChainId) {
          this.emit('transferRootConfirmed', {
            transferRootHash,
            destinationChainId
          })
        }
      })
      .catch(async (err: Error) => {
        this.db.transferRoots.update(transferRootHash, {
          sentConfirmTxAt: 0
        })

        throw err
      })
    this.logger.info(
        `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx`,
        chalk.bgYellow.black.bold(tx.hash)
    )
    this.notifier.info(
        `chainId: ${this.bridge.chainId} confirmTransferRoot L1 exit tx: ${tx.hash}`
    )
  }
}
export default PolygonBridgeWatcher
