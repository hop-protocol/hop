import Bridge, { CanonicalTokenConvertOptions, EventCb, EventsBatchOptions } from './Bridge'
import Token from './Token'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import l1Erc20BridgeAbi from '@hop-protocol/core/abi/generated/L1_ERC20_Bridge.json'
import wallets from 'src/wallets'
import { BigNumber, Contract, constants, providers } from 'ethers'
import { Chain, GasCostTransactionType, Network, RelayableChains, Token as TokenEnum } from 'src/constants'
import { ERC20 } from '@hop-protocol/core/contracts/generated/ERC20'
import { Hop } from '@hop-protocol/sdk'
import { L1_Bridge as L1BridgeContract, TransferBondChallengedEvent, TransferRootBondedEvent, TransferRootConfirmedEvent, TransferSentToL2Event } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L1_ERC20_Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/generated/L1_ERC20_Bridge'
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
    return this.l1BridgeContract.transferBonds(transferRootId)
  }

  getTransferRootBondedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return this.l1BridgeContract.queryFilter(
      this.l1BridgeContract.filters.TransferRootBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  getTransferBondChallengedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return this.l1BridgeContract.queryFilter(
      this.l1BridgeContract.filters.TransferBondChallenged(),
      startBlockNumber,
      endBlockNumber
    )
  }

  getTransferSentToL2Events = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return this.l1BridgeContract.queryFilter(
      this.l1BridgeContract.filters.TransferSentToL2(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferRootBondedEvents<R> (
    cb: EventCb<TransferRootBondedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferRootBondedEvents, cb, options)
  }

  async mapTransferBondChallengedEvents<R> (
    cb: EventCb<TransferBondChallengedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferBondChallengedEvents, cb, options)
  }

  async mapTransferSentToL2Events<R> (
    cb: EventCb<TransferSentToL2Event, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferSentToL2Events, cb, options)
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
    return this.l1BridgeContract.queryFilter(
      this.l1BridgeContract.filters.TransferRootConfirmed(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferRootConfirmedEvents<R> (
    cb: EventCb<TransferRootConfirmedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferRootConfirmedEvents, cb, options)
  }

  async isTransferRootIdConfirmed (destChainId: number, transferRootId: string): Promise<boolean> {
    const committedAt = await this.getTransferRootCommittedAt(destChainId, transferRootId)
    return committedAt > 0
  }

  getTransferRootCommittedAt = async (destChainId: number, transferRootId: string): Promise<number> => {
    let committedAt
    if (this.tokenSymbol === TokenEnum.USDC && globalConfig.network === Network.Mainnet) {
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
    const txOverrides = await this.txOverrides()

    // Hardcode a gasLimit for chains that have variable gas costs in their messengers
    if (
      chainId === this.chainSlugToId(Chain.Optimism) ||
      chainId === this.chainSlugToId(Chain.Base)
    ) {
      txOverrides.gasLimit = 1_000_000
    }

    const payload = [
      transferRootHash,
      chainId,
      totalAmount,
      txOverrides
    ] as const
    const tx = await this.l1BridgeContract.bondTransferRoot(...payload)

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
    recipient: string,
    options?: Partial<CanonicalTokenConvertOptions>
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    let nearestItemToTransferSent
    const destinationChain = chainIdToSlug(destinationChainId)
    if (RelayableChains.L1_TO_L2.includes(destinationChain) && !options?.shouldSkipNearestCheck) {
      const transactionType = GasCostTransactionType.BondWithdrawal
      const now = Math.floor(Date.now() / 1000)
      nearestItemToTransferSent = await this.db.gasCost.getNearest(destinationChain, this.tokenSymbol, transactionType, now)
      if (!nearestItemToTransferSent) {
        throw new Error('nearestItemToTransferSent not found')
      }
    }

    const relayer = await this.getBonderAddress()
    const relayerFee: BigNumber = nearestItemToTransferSent?.gasCostInToken ?? BigNumber.from('0')
    const deadline = '0' // must be 0
    const amountOutMin = '0' // must be 0

    const txOverrides = await this.txOverrides()
    if (
      this.chainSlug === Chain.Ethereum &&
      this.tokenSymbol === 'ETH'
    ) {
      txOverrides.value = amount
    }

    if (!this.isValidRelayerAndRelayerFee(relayer, relayerFee)) {
      throw new Error(`relayer "${relayer}" and relayerFee "${relayerFee}" are invalid`)
    }

    return this.l1BridgeContract.sendToL2(
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
    recipient: string,
    options?: Partial<CanonicalTokenConvertOptions>
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    let nearestItemToTransferSent
    const destinationChain = chainIdToSlug(destinationChainId)
    if (RelayableChains.L1_TO_L2.includes(destinationChain) && !options?.shouldSkipNearestCheck) {
      const transactionType = GasCostTransactionType.BondWithdrawal
      const now = Math.floor(Date.now() / 1000)
      nearestItemToTransferSent = await this.db.gasCost.getNearest(destinationChain, this.tokenSymbol, transactionType, now)
      if (!nearestItemToTransferSent) {
        throw new Error('nearestItemToTransferSent not found')
      }
    }

    const sdk = new Hop(globalConfig.network)
    const bridge = sdk.bridge(this.tokenSymbol)
    const relayer = await this.getBonderAddress()
    const relayerFee: BigNumber = nearestItemToTransferSent?.gasCostInToken ?? BigNumber.from('0')
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

    if (!this.isValidRelayerAndRelayerFee(relayer, relayerFee)) {
      throw new Error(`relayer "${relayer}" and relayerFee "${relayerFee}" are invalid`)
    }
    return this.l1BridgeContract.sendToL2(
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
    return this.l1BridgeContract.getBondForTransferAmount(amount)
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

  private isValidRelayerAndRelayerFee (relayer: string, relayerFee: BigNumber): boolean {
    return (
      relayer !== constants.AddressZero ||
      relayerFee.eq(0)
    )
  }
}
