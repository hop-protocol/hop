import { providers, Contract, ethers, BigNumber } from 'ethers'
import { erc20Abi } from '@hop-protocol/abi'
import { parseUnits } from 'ethers/lib/utils'
import Bridge from './Bridge'
import queue from 'src/decorators/queue'
import Token from './Token'

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

  async decodeBondTransferRootData (data: string): Promise<any> {
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

  async getTransferBond (transferRootId: string): Promise<any> {
    return this.l1BridgeContract.transferBonds(transferRootId)
  }

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

  async isSupportedChainId (chainId: number): Promise<boolean> {
    const address = await this.l1BridgeContract.crossDomainMessengerWrappers(
      chainId
    )
    return address !== ethers.constants.AddressZero
  }
}
