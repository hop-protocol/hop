import { providers, Contract, ethers, BigNumber } from 'ethers'
import { l1BridgeAbi, erc20Abi } from '@hop-protocol/abi'
import { parseUnits } from 'ethers/lib/utils'
import Bridge from './Bridge'
import queue from 'src/decorators/queue'
import Token from './Token'
import { Chain } from 'src/constants'
import wallets from 'src/wallets'
import rateLimitRetry from 'src/decorators/rateLimitRetry'

export default class L1Bridge extends Bridge {
  l1BridgeContract: Contract
  TransferRootBonded: string = 'TransferRootBonded'
  TransferRootConfirmed: string = 'TransferRootConfirmed'
  TransferBondChallenged: string = 'TransferBondChallenged'
  ChallengeResolved: string = 'ChallengeResolved'

  constructor (l1BridgeContract: Contract) {
    super(l1BridgeContract)
    this.l1BridgeContract = l1BridgeContract
    this.l1StartListeners()
  }

  static fromAddress (address: string): L1Bridge {
    const contract = new Contract(
      address,
      l1BridgeAbi,
      wallets.get(Chain.Ethereum)
    )

    return new L1Bridge(contract)
  }

  l1StartListeners (): void {
    this.l1BridgeContract
      .on(
        this.l1BridgeContract.filters.TransferRootBonded(),
        (...args: any[]) => this.emit(this.TransferRootBonded, ...args)
      )
      .on(
        this.l1BridgeContract.filters.TransferRootConfirmed(),
        (...args: any[]) => this.emit(this.TransferRootConfirmed, ...args)
      )
      .on(
        this.l1BridgeContract.filters.TransferBondChallenged(),
        (...args: any[]) => this.emit(this.TransferBondChallenged, ...args)
      )
      .on(this.l1BridgeContract.filters.ChallengeResolved(), (...args: any[]) =>
        this.emit(this.ChallengeResolved, ...args)
      )
      .on('error', err => {
        this.emit('error', err)
      })
  }

  @rateLimitRetry
  async decodeBondTransferRootData (data: string): Promise<any> {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = await this.l1BridgeContract.interface.decodeFunctionData(
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

  @rateLimitRetry
  async decodeConfirmTransferRootData (data: string): Promise<any> {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = await this.l1BridgeContract.interface.decodeFunctionData(
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

  @rateLimitRetry
  async getTransferBond (transferRootId: string): Promise<any> {
    return this.l1BridgeContract.transferBonds(transferRootId)
  }

  @rateLimitRetry
  async getTransferRootBondedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getLastTransferRootBondedEvent (): Promise<any> {
    let match: any = null
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransferRootBondedEvents(start, end)
      if (events.length) {
        match = events[events.length - 1]
        return false
      }
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

  @rateLimitRetry
  async getTransferRootConfirmedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootConfirmed(),
      startBlockNumber,
      endBlockNumber
    )
  }

  @rateLimitRetry
  async getTransferRootIdCommitedAt (transferRootId: string): Promise<number> {
    const commitedAt = await this.bridgeContract.transferRootCommittedAt(
      transferRootId
    )
    return Number(commitedAt.toString())
  }

  async isTransferRootIdConfirmed (transferRootId: string): Promise<boolean> {
    const committedAt = await this.getTransferRootCommittedAt(transferRootId)
    return committedAt > 0
  }

  @rateLimitRetry
  async getTransferRootCommittedAt (transferRootId: string): Promise<number> {
    const committedAt = await this.bridgeContract.transferRootCommittedAt(
      transferRootId
    )
    return Number(committedAt.toString())
  }

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

  @rateLimitRetry
  @queue
  async bondTransferRoot (
    transferRootHash: string,
    chainId: number,
    totalAmount: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      totalAmount,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }

  @rateLimitRetry
  @queue
  async challengeTransferRootBond (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.l1BridgeContract.challengeTransferBond(
      transferRootHash,
      totalAmount,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }

  @rateLimitRetry
  @queue
  async resolveChallenge (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.l1BridgeContract.resolveChallenge(
      transferRootHash,
      totalAmount,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }

  @rateLimitRetry
  @queue
  async convertCanonicalTokenToHopToken (
    destChainId: number,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> {
    const recipient = await this.getBonderAddress()
    const relayer = ethers.constants.AddressZero
    const relayerFee = '0'
    const deadline = '0' // must be 0
    const amountOutMin = '0' // must be 0

    const isSupportedChainId = await this.isSupportedChainId(destChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destChainId}" is not supported`)
    }

    return this.l1BridgeContract.sendToL2(
      destChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      await this.txOverrides()
    )
  }

  @rateLimitRetry
  async isSupportedChainId (chainId: number): Promise<boolean> {
    const address = await this.l1BridgeContract.crossDomainMessengerWrappers(
      chainId
    )
    return address !== ethers.constants.AddressZero
  }
}
