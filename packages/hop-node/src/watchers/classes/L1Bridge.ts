import Bridge, { EventCb, EventsBatchOptions } from './Bridge'
import Token from './Token'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import wallets from 'src/wallets'
import { BigNumber, Contract, constants, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Event } from 'src/types'
import { Hop } from '@hop-protocol/sdk'
import { erc20Abi, l1Erc20BridgeAbi } from '@hop-protocol/core/abi'
import { config as globalConfig } from 'src/config'

export default class L1Bridge extends Bridge {
  TransferRootBonded: string = 'TransferRootBonded'
  TransferRootConfirmed: string = 'TransferRootConfirmed'
  TransferBondChallenged: string = 'TransferBondChallenged'
  TransferSentToL2: string = 'TransferSentToL2'
  ChallengeResolved: string = 'ChallengeResolved'

  static fromAddress (address: string): L1Bridge {
    const contract = new Contract(
      address,
      l1Erc20BridgeAbi,
      wallets.get(Chain.Ethereum)
    )

    return new L1Bridge(contract)
  }

  decodeBondTransferRootData (data: string): any {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = this.bridgeContract.interface.decodeFunctionData(
      'bondTransferRoot',
      data
    )
    const transferRootHash = decoded.rootHash.toString()
    const destinationChainId = decoded.destinationChainId.toString()
    const totalAmount = decoded.totalAmount.toString()
    return {
      transferRootHash,
      destinationChainId,
      totalAmount
    }
  }

  decodeConfirmTransferRootData (data: string): any {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = this.bridgeContract.interface.decodeFunctionData(
      'confirmTransferRoot',
      data
    )

    return {
      originChainId: Number(decoded.originChainId.toString()),
      rootHash: decoded.rootHash,
      destinationChainId: Number(decoded.destinationChainId.toString()),
      totalAmount: decoded.totalAmount,
      rootCommittedAt: Number(decoded.rootCommittedAt.toString())
    }
  }

  getTransferBond = rateLimitRetry((transferRootId: string): Promise<any> => {
    return this.bridgeContract.transferBonds(transferRootId)
  })

  getTransferRootBondedEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootBonded(),
      startBlockNumber,
      endBlockNumber
    )
  })

  getTransferBondChallengedEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferBondChallenged(),
      startBlockNumber,
      endBlockNumber
    )
  })

  async mapTransferRootBondedEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferRootBondedEvents, cb, options)
  }

  async mapTransferBondChallengedEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferBondChallengedEvents, cb, options)
  }

  async getLastTransferRootBondedEvent (): Promise<any> {
    let match: Event = null
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransferRootBondedEvents(start, end)
      if (events.length) {
        match = events[events.length - 1]
        return false
      }
    })

    return match
  }

  async getTransferRootBondedEvent (
    transferRootHash: string
  ): Promise<Event> {
    let match: Event = null
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransferRootBondedEvents(start, end)
      for (const event of events) {
        if (transferRootHash === event.args.root) {
          match = event
          return false
        }
      }
      return true
    })

    return match
  }

  async isTransferRootHashBonded (
    transferRootHash: string,
    amount: BigNumber
  ): Promise<boolean> {
    const transferRootId = await this.getTransferRootId(
      transferRootHash,
      amount
    )
    return this.isTransferRootIdBonded(transferRootId)
  }

  async isTransferRootIdBonded (transferRootId: string): Promise<boolean> {
    const transferBondStruct = await this.getTransferBond(transferRootId)
    if (!transferBondStruct) {
      throw new Error('transfer bond struct not found')
    }
    const createdAt = Number(transferBondStruct.createdAt?.toString())
    return createdAt > 0
  }

  getTransferRootConfirmedEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootConfirmed(),
      startBlockNumber,
      endBlockNumber
    )
  })

  async mapTransferRootConfirmedEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferRootConfirmedEvents, cb, options)
  }

  async isTransferRootIdConfirmed (destChainId: number, transferRootId: string): Promise<boolean> {
    const committedAt = await this.getTransferRootCommittedAt(destChainId, transferRootId)
    return committedAt > 0
  }

  getTransferRootCommittedAt = rateLimitRetry(async (destChainId: number, transferRootId: string): Promise<number> => {
    let params: any[] = []
    if (this.tokenSymbol === 'USDC') {
      params = [transferRootId]
    } else {
      params = [destChainId, transferRootId]
    }
    const committedAt = await this.bridgeContract.transferRootCommittedAt(
      ...params
    )
    return Number(committedAt.toString())
  })

  async getMinTransferRootBondDelaySeconds (): Promise<number> {
    // MIN_TRANSFER_ROOT_BOND_DELAY
    return 15 * 60
  }

  async l1CanonicalToken (): Promise<Token> {
    const tokenAddress = await this.bridgeContract.l1CanonicalToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.bridgeContract.signer
    )
    return new Token(tokenContract)
  }

  bondTransferRoot = rateLimitRetry(async (
    transferRootHash: string,
    chainId: number,
    totalAmount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      totalAmount,
      await this.txOverrides()
    )

    return tx
  })

  challengeTransferRootBond = rateLimitRetry(async (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeContract.challengeTransferBond(
      transferRootHash,
      totalAmount,
      await this.txOverrides()
    )

    return tx
  })

  resolveChallenge = rateLimitRetry(async (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeContract.resolveChallenge(
      transferRootHash,
      totalAmount,
      await this.txOverrides()
    )

    return tx
  })

  convertCanonicalTokenToHopToken = rateLimitRetry(async (
    destinationChainId: number,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    const recipient = await this.getBonderAddress()
    const relayer = recipient
    const relayerFee = '0'
    const deadline = '0' // must be 0
    const amountOutMin = '0' // must be 0

    const txOverrides = await this.txOverrides()
    const isEthSend = this.chainSlug === Chain.Ethereum
    if (isEthSend) {
      txOverrides.value = amount
    }

    return this.bridgeContract.sendToL2(
      destinationChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      txOverrides
    )
  })

  sendCanonicalTokensToL2 = rateLimitRetry(async (
    destinationChainId: number,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    const sdk = new Hop(globalConfig.network)
    const bridge = sdk.bridge(this.tokenSymbol)
    const recipient = await this.getBonderAddress()
    const relayer = recipient
    const relayerFee = '0'
    const deadline = bridge.defaultDeadlineSeconds
    const { amountOut } = await bridge.getSendData(amount, this.chainSlug, this.chainIdToSlug(destinationChainId))
    const slippageTolerance = 0.1
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const amountOutMin = amountOut.mul(minBps).div(10000)

    const txOverrides = await this.txOverrides()
    const isEthSend = this.chainSlug === Chain.Ethereum
    if (isEthSend) {
      txOverrides.value = amount
    }

    return this.bridgeContract.sendToL2(
      destinationChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      txOverrides
    )
  })

  isSupportedChainId = rateLimitRetry(async (chainId: number): Promise<boolean> => {
    const address = await this.bridgeContract.crossDomainMessengerWrappers(
      chainId
    )
    return address !== constants.AddressZero
  })

  getChallengePeriod = rateLimitRetry(async (): Promise<number> => {
    const challengePeriod = await this.bridgeContract.challengePeriod()
    return Number(challengePeriod.toString())
  })

  getBondForTransferAmount = rateLimitRetry((amount: BigNumber): Promise<BigNumber> => {
    return this.bridgeContract.getBondForTransferAmount(amount)
  })
}
