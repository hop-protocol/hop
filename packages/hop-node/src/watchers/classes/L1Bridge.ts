import Bridge, { EventCb, EventsBatchOptions } from './Bridge'
import Token from './Token'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import l1Erc20BridgeAbi from '@hop-protocol/core/abi/generated/L1_ERC20_Bridge.json'
import wallets from 'src/wallets'
import { BigNumber, Contract, constants, providers } from 'ethers'
import { Chain, DefaultRelayerAddress } from 'src/constants'
import { ERC20 } from '@hop-protocol/core/contracts'
import { Hop } from '@hop-protocol/sdk'
import { L1Bridge as L1BridgeContract, TransferBondChallengedEvent, TransferRootBondedEvent, TransferRootConfirmedEvent } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { config as globalConfig } from 'src/config'

export default class L1Bridge extends Bridge {
  TransferRootBonded: string = 'TransferRootBonded'
  TransferRootConfirmed: string = 'TransferRootConfirmed'
  TransferBondChallenged: string = 'TransferBondChallenged'
  TransferSentToL2: string = 'TransferSentToL2'
  ChallengeResolved: string = 'ChallengeResolved'

  constructor (private readonly l1BridgeContract: L1BridgeContract | L1ERC20BridgeContract) {
    super(l1BridgeContract)
  }

  static fromAddress (address: string): L1Bridge {
    const contract = new Contract(
      address,
      l1Erc20BridgeAbi,
      wallets.get(Chain.Ethereum)
    )

    return new L1Bridge(contract as L1BridgeContract)
  }

  getTransferBond = async (transferRootId: string) => {
    return await this.l1BridgeContract.transferBonds(transferRootId)
  }

  getTransferRootBondedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.l1BridgeContract.queryFilter(
      this.l1BridgeContract.filters.TransferRootBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  getTransferBondChallengedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.l1BridgeContract.queryFilter(
      this.l1BridgeContract.filters.TransferBondChallenged(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferRootBondedEvents<R> (
    cb: EventCb<TransferRootBondedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getTransferRootBondedEvents, cb, options)
  }

  async mapTransferBondChallengedEvents<R> (
    cb: EventCb<TransferBondChallengedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getTransferBondChallengedEvents, cb, options)
  }

  async getTransferRootBondedEvent (
    transferRootHash: string
  ) {
    let match: TransferRootBondedEvent | undefined
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

  async isTransferRootIdBonded (transferRootId: string): Promise<boolean> {
    const transferBondStruct = await this.getTransferBond(transferRootId)
    if (!transferBondStruct) {
      throw new Error('transfer bond struct not found')
    }
    const createdAt = Number(transferBondStruct.createdAt?.toString())
    return createdAt > 0
  }

  getTransferRootConfirmedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<TransferRootConfirmedEvent[]> => {
    return await this.l1BridgeContract.queryFilter(
      this.l1BridgeContract.filters.TransferRootConfirmed(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferRootConfirmedEvents<R> (
    cb: EventCb<TransferRootConfirmedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getTransferRootConfirmedEvents, cb, options)
  }

  async isTransferRootIdConfirmed (destChainId: number, transferRootId: string): Promise<boolean> {
    const committedAt = await this.getTransferRootCommittedAt(destChainId, transferRootId)
    return committedAt > 0
  }

  getTransferRootCommittedAt = async (destChainId: number, transferRootId: string): Promise<number> => {
    let committedAt
    if (this.tokenSymbol === 'USDC') {
      committedAt = await (this.l1BridgeContract as L1BridgeContract).transferRootCommittedAt(transferRootId)
    } else {
      committedAt = await (this.l1BridgeContract as L1ERC20BridgeContract).transferRootCommittedAt(destChainId, transferRootId)
    }
    return committedAt.toNumber()
  }

  async getMinTransferRootBondDelaySeconds (): Promise<number> {
    // MIN_TRANSFER_ROOT_BOND_DELAY
    return 15 * 60
  }

  async l1CanonicalToken (): Promise<Token> {
    const tokenAddress = await (this.l1BridgeContract as L1ERC20BridgeContract).l1CanonicalToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.l1BridgeContract.signer
    ) as ERC20
    return new Token(tokenContract)
  }

  bondTransferRoot = async (
    transferRootHash: string,
    chainId: number,
    totalAmount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      totalAmount,
      await this.txOverrides()
    )

    return tx
  }

  challengeTransferRootBond = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    destinationChainId: number
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.l1BridgeContract.challengeTransferBond(
      transferRootHash,
      totalAmount,
      destinationChainId,
      await this.txOverrides()
    )

    return tx
  }

  resolveChallenge = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    destinationChainId: number
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.l1BridgeContract.resolveChallenge(
      transferRootHash,
      totalAmount,
      destinationChainId,
      await this.txOverrides()
    )

    return tx
  }

  convertCanonicalTokenToHopToken = async (
    destinationChainId: number,
    amount: BigNumber,
    recipient: string
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    const relayer = DefaultRelayerAddress
    const relayerFee = '0'
    const deadline = '0' // must be 0
    const amountOutMin = '0' // must be 0

    const txOverrides = await this.txOverrides()
    if (
      this.chainSlug === Chain.Ethereum &&
      this.tokenSymbol === 'ETH'
    ) {
      txOverrides.value = amount
    }

    return await this.l1BridgeContract.sendToL2(
      destinationChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      txOverrides
    )
  }

  sendCanonicalTokensToL2 = async (
    destinationChainId: number,
    amount: BigNumber,
    recipient: string
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    const sdk = new Hop(globalConfig.network)
    const bridge = sdk.bridge(this.tokenSymbol)
    const relayer = DefaultRelayerAddress
    const relayerFee = '0'
    const deadline = bridge.defaultDeadlineSeconds
    const { amountOut } = await bridge.getSendData(amount, this.chainSlug, this.chainIdToSlug(destinationChainId))
    const slippageTolerance = 0.1
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const amountOutMin = amountOut.mul(minBps).div(10000)

    const txOverrides = await this.txOverrides()
    if (
      this.chainSlug === Chain.Ethereum &&
      this.tokenSymbol === 'ETH'
    ) {
      txOverrides.value = amount
    }

    return await this.l1BridgeContract.sendToL2(
      destinationChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      txOverrides
    )
  }

  isSupportedChainId = async (chainId: number): Promise<boolean> => {
    const address = await this.l1BridgeContract.crossDomainMessengerWrappers(
      chainId
    )
    return address !== constants.AddressZero
  }

  getBondForTransferAmount = async (amount: BigNumber): Promise<BigNumber> => {
    return await this.l1BridgeContract.getBondForTransferAmount(amount)
  }

  async decodeBondTransferRootCalldata (data: string): Promise<any> {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = this.l1BridgeContract.interface.decodeFunctionData(
      'bondTransferRoot',
      data
    )
    const transferRootHash = decoded.rootHash
    const totalAmount = decoded.totalAmount
    const destinationChainId = Number(decoded.destinationChainId.toString())
    return {
      transferRootHash,
      totalAmount,
      destinationChainId
    }
  }
}
