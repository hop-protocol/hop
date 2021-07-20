import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import Web3 from 'web3'
import chalk from 'chalk'
import fetch from 'node-fetch'
import queue from 'src/decorators/queue'
import { BigNumber, Contract, ethers } from 'ethers'
import { Chain } from 'src/constants'
import { Event } from 'src/types'
import { MaticPOSClient } from '@maticnetwork/maticjs'
import { erc20Abi } from '@hop-protocol/abi'
import { config as globalConfig } from 'src/config'
import { wait } from 'src/utils'

type Config = {
  chainSlug: string
  tokenSymbol: string
}

class PolygonBridgeWatcher extends BaseWatcherWithEventHandlers {
  l1Provider: any
  l2Provider: any
  l1Wallet: any
  l2Wallet: any
  chainId: number
  apiUrl: string

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'polygonBridgeWatcher',
      logColor: 'yellow'
    })

    this.l1Provider = new ethers.providers.StaticJsonRpcProvider(
      'https://goerli.rpc.hop.exchange'
    )
    this.l2Provider = new ethers.providers.StaticJsonRpcProvider(
      'https://rpc-mumbai.maticvigil.com'
    )
    const privateKey =
      globalConfig.relayerPrivateKey || globalConfig.bonderPrivateKey
    this.l1Wallet = new ethers.Wallet(privateKey, this.l1Provider)
    this.l2Wallet = new ethers.Wallet(privateKey, this.l2Provider)
    this.chainId = 5
    this.apiUrl = `https://apis.matic.network/api/v1/${
      this.chainId === 1 ? 'matic' : 'mumbai'
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
            if (to === ethers.constants.AddressZero) {
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
      gasLimit: tx.gas,
      gasPrice: this.getBumpedGasPrice(1.5, this.l1Wallet)
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
      gasLimit: tx.gas,
      gasPrice: this.getBumpedGasPrice(1.5, this.l1Wallet)
    })
  }

  protected async getBumpedGasPrice (
    percent: number,
    wallet: ethers.Wallet
  ): Promise<BigNumber> {
    const gasPrice = await wallet.provider.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }
}
export default PolygonBridgeWatcher
