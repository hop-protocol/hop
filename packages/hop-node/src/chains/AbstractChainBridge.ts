import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { IAbstractChainBridge } from './IAbstractChainBridge'
import { Signer, providers } from 'ethers'
import { getEnabledNetworks } from 'src/config'

abstract class AbstractChainBridge<T, U, V = null> implements IAbstractChainBridge {
  logger: Logger
  chainSlug: string
  chainId: number
  l1Wallet: Signer
  l2Wallet: Signer
  protected abstract getMessage (txHash: string, opts: V | null): Promise<T>
  protected abstract getMessageStatus (message: T, opts: V | null): Promise<U>
  protected abstract sendRelayTransaction (message: T, opts: V | null): Promise<providers.TransactionResponse>
  protected abstract isMessageInFlight (messageStatus: U): Promise<boolean> | boolean
  protected abstract isMessageCheckpointed (messageStatus: U): Promise<boolean> | boolean
  protected abstract isMessageRelayed (messageStatus: U): Promise<boolean> | boolean

  constructor (chainSlug: string) {
    const enabledNetworks = getEnabledNetworks()
    if (!enabledNetworks.includes(chainSlug)) {
      throw new Error(`Chain ${chainSlug} is not enabled`)
    }

    // Set up config
    this.chainSlug = chainSlug
    this.chainId = chainSlugToId(chainSlug)
    const prefix = `${this.chainSlug}`
    const tag = this.constructor.name
    this.logger = new Logger({
      tag,
      prefix,
      color: 'blue'
    })

    // Set up signers
    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(chainSlug)
  }

  getLogger (): Logger {
    return this.logger
  }

  // Call a private method so the validation is guaranteed to run in order
  protected async validateMessageAndSendTransaction (txHash: string, relayOpts: V | null = null): Promise<providers.TransactionResponse> {
    return this._validateMessageAndSendTransaction(txHash, relayOpts)
  }

  private async _validateMessageAndSendTransaction (txHash: string, relayOpts: V | null): Promise<providers.TransactionResponse> {
    const message: T = await this.getMessage(txHash, relayOpts)
    const messageStatus: U = await this.getMessageStatus(message, relayOpts)
    await this.validateMessageStatus(messageStatus)
    return this.sendRelayTransaction(message, relayOpts)
  }

  private async validateMessageStatus (messageStatus: U): Promise<void> {
    if (!messageStatus) {
      throw new Error('expected message status')
    }

    if (await this.isMessageInFlight(messageStatus)) {
      throw new Error('expected deposit to be claimable')
    }

    if (await this.isMessageRelayed(messageStatus)) {
      throw new Error('expected deposit to be claimable')
    }

    if (!(await this.isMessageCheckpointed(messageStatus))) {
      throw new Error('expected deposit to be relayable')
    }
  }
}

export default AbstractChainBridge
