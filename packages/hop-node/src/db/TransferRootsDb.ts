import BaseDb, { KV, KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { Chain, ChallengePeriodMs, OneHourMs, OneWeekMs, RootSetSettleDelayMs, TxRetryDelayMs } from 'src/constants'
import { normalizeDbItem } from './utils'
import { oruChains } from 'src/config'

interface BaseTransferRoot {
  allSettled?: boolean
  bondBlockNumber?: number
  bonded?: boolean
  bondedAt?: number
  bonder?: string
  bondTxHash?: string
  challenged?: boolean
  committed?: boolean
  committedAt?: number
  commitTxBlockNumber?: number
  commitTxHash?: string
  confirmed?: boolean
  confirmedAt?: number
  confirmTxHash?: string
  destinationChainId?: number
  isNotFound?: boolean
  rootSetBlockNumber?: number
  rootSetTimestamp?: number
  rootSetTxHash?: string
  sentBondTxAt?: number
  sentCommitTxAt?: number
  sentConfirmTxAt?: number
  settleAttemptedAt?: number
  shouldBondTransferRoot?: boolean
  sourceChainId?: number
  totalAmount?: BigNumber
  transferIds?: string[]
  transferRootHash?: string
  withdrawalBondSettleTxSentAt?: number
}

export interface TransferRoot extends BaseTransferRoot {
  transferRootId: string
}

interface UpdateTransferRoot extends BaseTransferRoot {
  transferRootId?: string
}

type TransferRootsDateFilter = {
  fromUnix?: number
  toUnix?: number
}

type GetItemsFilter = Partial<TransferRoot> & {
  destinationChainIds?: number[]
}

interface MultipleWithdrawalsSettled {
  transferRootHash: string
  transferRootId: string
  bonder: string
  totalBondsSettled: BigNumber
  txHash: string
  blockNumber: number
  txIndex: number
  logIndex: number
}

type UnsettledTransferRoot = {
  transferRootId: string
  transferRootHash: string
  totalAmount: BigNumber
  transferIds: string[]
  destinationChainId: number
  rootSetTxHash: string
  committed: boolean
  committedAt: number
  allSettled: boolean
}

type UnbondedTransferRoot = {
  bonded: boolean
  bondedAt: number
  confirmed: boolean
  transferRootHash: string
  transferRootId: string
  committedAt: number
  commitTxHash: string
  commitTxBlockNumber: number
  destinationChainId: number
  sourceChainId: number
  totalAmount: BigNumber
  transferIds: string[]
}

export type ExitableTransferRoot = {
  commitTxHash: string
  confirmed: boolean
  transferRootHash: string
  transferRootId: string
  totalAmount: BigNumber
  destinationChainId: number
  committed: boolean
  committedAt: number
}

export type ChallengeableTransferRoot = {
  transferRootId: string
  transferRootHash: string
  committed: boolean
  totalAmount: BigNumber
  bonded: boolean
  challenged: boolean
}

// structure:
// key: `transferRoot:<committedAt>:<transferRootId>`
// value: `{ transferRootId: <transferRootId> }`
// note: the "transferRoot" prefix is not required but requires a migration to remove
class SubDbTimestamps extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:timestampedKeys`, _namespace)
  }

  getTimestampedKey (transferRoot: TransferRoot) {
    if (transferRoot.committedAt && transferRoot.transferRootId) {
      return `transferRoot:${transferRoot.committedAt}:${transferRoot.transferRootId}`
    }
  }

  async insertItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const key = this.getTimestampedKey(transferRoot)
    if (!key) {
      return
    }
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug(`storing db transferRoot timestamped key item. key: ${key}`)
      await this._update(key, { transferRootId })
      logger.debug(`updated db transferRoot timestamped key item. key: ${key}`)
    }
  }

  async getFilteredKeyValues (dateFilter?: TransferRootsDateFilter) {
    // return only transfer-root keys that are within specified range (filter by timestamped keys)
    const filter: KeyFilter = {
      gte: 'transferRoot:',
      lte: 'transferRoot:~'
    }

    if (dateFilter != null) {
      if (dateFilter.fromUnix) {
        filter.gte = `transferRoot:${dateFilter.fromUnix}`
      }
      if (dateFilter.toUnix) {
        filter.lte = `transferRoot:${dateFilter.toUnix}~` // tilde is intentional
      }
    }

    return this.getKeyValues(filter)
  }
}

// structure:
// key: `<transferRootId>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbIncompletes extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:incompleteItems`, _namespace)
  }

  async upsertItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const isIncomplete = this.isItemIncomplete(transferRoot)
    const exists = await this.getById(transferRootId)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      logger.debug('updating db transferRoot incomplete key item')
      await this._update(transferRootId, { transferRootId })
      logger.debug('updated db transferRoot incomplete key item')
    } else if (shouldDelete) {
      logger.debug('deleting db transferRoot incomplete key item')
      await this.deleteById(transferRootId)
      logger.debug('deleted db transferRoot incomplete key item')
    }
  }

  isItemIncomplete (item: TransferRoot) {
    if (item.isNotFound) {
      return false
    }

    return (
      /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
      !item.sourceChainId ||
      !item.destinationChainId ||
      !item.commitTxBlockNumber ||
      (item.commitTxHash && !item.committedAt) ||
      (item.bondTxHash && (!item.bonder || !item.bondedAt)) ||
      (item.rootSetBlockNumber && !item.rootSetTimestamp) ||
      (item.sourceChainId && item.destinationChainId && item.commitTxBlockNumber && item.totalAmount && !item.transferIds)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
  }
}

// structure:
// key: `<transferRootHash>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbRootHashes extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:rootHashes`, _namespace)
  }

  async insertItem (transferRoot: TransferRoot) {
    const { transferRootId, transferRootHash } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const key = transferRoot.transferRootHash
    if (!key) {
      return
    }
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug(`storing db transferRoot rootHash key item. key: ${key}`)
      await this._update(key, { transferRootId })
      logger.debug(`updated db transferRoot rootHash key item. key: ${key}`)
    }
  }

  async getByTransferRootHash (transferRootHash: string) {
    const item = await this.getById(transferRootHash)
    return item?.transferRootId
  }
}

// structure:
// key: `<bondedAt>:<transferRootId>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbBondedAt extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:rootBondedAt`, _namespace)
  }

  async insertItem (transferRoot: TransferRoot) {
    const { transferRootId, bondedAt } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    if (!bondedAt) {
      return
    }
    const key = `${bondedAt}:${transferRootId}`
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug('inserting db transferRoot bondedAt key item')
      await this._update(key, { transferRootId })
    }
  }

  async getFilteredKeyValues (dateFilter: TransferRootsDateFilter) {
    const filter: KeyFilter = {
      gte: `${dateFilter.fromUnix}`
    }
    return this.getKeyValues(filter)
  }
}

// structure:
// key: `<transferRootId>:<txHash>`
// value: `{ ...MultipleWithdrawalsSettled }`
class SubDbMultipleWithdrawalsSettleds extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:multipleWithdrawalsSettleds`, _namespace)
  }

  getInsertKey (event: MultipleWithdrawalsSettled) {
    if (event.transferRootId && event.txHash) {
      return `${event.transferRootId}:${event.txHash}`
    }
  }

  async insertItem (event: MultipleWithdrawalsSettled) {
    const { transferRootId } = event
    const logger = this.logger.create({ id: transferRootId })
    const key = this.getInsertKey(event)
    if (!key) {
      return
    }
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug(`storing db MultipleWithdrawalsSettled item. key: ${key}`)
      await this._update(key, event)
      logger.debug(`updated db MultipleWithdrawalsSettled item. key: ${key}`)
    }
  }

  async getEvents (transferRootId: string): Promise<MultipleWithdrawalsSettled[]> {
    const filter: KeyFilter = {
      gte: `${transferRootId}:`,
      lte: `${transferRootId}:~`
    }

    return this.getValues(filter)
  }
}

// structure:
// key: `<transferRootId>`
// value: `{ ...TransferRoot }`
class TransferRootsDb extends BaseDb {
  subDbTimestamps: SubDbTimestamps
  subDbIncompletes: SubDbIncompletes
  subDbRootHashes: SubDbRootHashes
  subDbBondedAt: SubDbBondedAt
  subDbMultipleWithdrawalsSettleds: SubDbMultipleWithdrawalsSettleds

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDbTimestamps = new SubDbTimestamps(prefix, _namespace)
    this.subDbIncompletes = new SubDbIncompletes(prefix, _namespace)
    this.subDbRootHashes = new SubDbRootHashes(prefix, _namespace)
    this.subDbBondedAt = new SubDbBondedAt(prefix, _namespace)
    this.subDbMultipleWithdrawalsSettleds = new SubDbMultipleWithdrawalsSettleds(prefix, _namespace)
    this.logger.debug('TransferRootsDb initialized')
  }

  async migration () {
    this.logger.debug('TransferRootsDb migration started')
    const entries = await this.getKeyValues()
    this.logger.debug(`TransferRootsDb migration: ${entries.length} entries`)
    for (const entry of entries) {
      await this.subDbBondedAt.insertItem(entry.value)
    }
  }

  private isRouteOk (filter: GetItemsFilter = {}, item: TransferRoot) {
    if (filter.sourceChainId) {
      if (!item.sourceChainId || filter.sourceChainId !== item.sourceChainId) {
        return false
      }
    }

    if (filter.destinationChainIds) {
      if (!item.destinationChainId || !filter.destinationChainIds.includes(item.destinationChainId)) {
        return false
      }
    }

    return true
  }

  private async upsertTransferRootItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    await this._update(transferRootId, transferRoot)
    const entry = await this.getById(transferRootId)
    logger.debug(`updated db transferRoot item. ${JSON.stringify(entry)}`)
    await this.subDbIncompletes.upsertItem(entry)
  }

  private normalizeItem (item: TransferRoot) {
    return normalizeDbItem(item)
  }

  async update (transferRootId: string, transferRoot: UpdateTransferRoot) {
    await this.tilReady()
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('update called')
    transferRoot.transferRootId = transferRootId

    await Promise.all([
      this.subDbTimestamps.insertItem(transferRoot as TransferRoot),
      this.subDbRootHashes.insertItem(transferRoot as TransferRoot),
      this.subDbBondedAt.insertItem(transferRoot as TransferRoot),
      this.upsertTransferRootItem(transferRoot as TransferRoot)
    ])
  }

  async getByTransferRootId (
    transferRootId: string
  ): Promise<TransferRoot> {
    await this.tilReady()
    const item: TransferRoot = await this.getById(transferRootId)
    return this.normalizeItem(item)
  }

  private readonly filterTimestampedKeyValues = (x: any) => {
    return x?.value?.transferRootId
  }

  private readonly sortItems = (a: any, b: any) => {
    return a?.committedAt - b?.committedAt
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot | null> {
    await this.tilReady()
    const transferRootId = await this.subDbRootHashes.getByTransferRootHash(transferRootHash)
    if (!transferRootId) {
      return null
    }
    const item = await this.getById(transferRootId)
    return this.normalizeItem(item)
  }

  async getTransferRootIds (dateFilter?: TransferRootsDateFilter): Promise<string[]> {
    await this.tilReady()
    const kv = await this.subDbTimestamps.getFilteredKeyValues(dateFilter)
    return kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
  }

  async getItems (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRootIds = await this.getTransferRootIds(dateFilter)
    const batchedItems = await this.batchGetByIds(transferRootIds)
    const transferRoots = batchedItems.map(this.normalizeItem)
    const items = transferRoots.sort(this.sortItems)

    this.logger.debug(`items length: ${items.length}`)
    return items
  }

  async getTransferRoots (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    return this.getItems(dateFilter)
  }

  // gets only transfer roots within range: now - 2 weeks ago
  async getTransferRootsFromTwoWeeks (): Promise<TransferRoot[]> {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - (OneWeekMs * 2)) / 1000)
    return this.getTransferRoots({
      fromUnix
    })
  }

  async getBondedTransferRootsFromTwoWeeks (): Promise<TransferRoot[]> {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - (OneWeekMs * 2)) / 1000)
    const items = await this.subDbBondedAt.getFilteredKeyValues({ fromUnix })
    const transferRootIds = items.map((item: KV) => item.value.transferRootId)
    const entries = await this.batchGetByIds(transferRootIds)
    return entries.map(this.normalizeItem)
  }

  async getUnbondedTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<UnbondedTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (filter.destinationChainId) {
        if (!item.destinationChainId || filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      if (item.isNotFound) {
        return false
      }

      let timestampOk = true
      if (item.sentBondTxAt) {
        timestampOk =
          item.sentBondTxAt + TxRetryDelayMs < Date.now()
      }

      return (
        !item.bonded &&
        !item.bondedAt &&
        !item.confirmed &&
        item.transferRootHash &&
        item.transferRootId &&
        item.committedAt &&
        item.commitTxHash &&
        item.commitTxBlockNumber &&
        item.destinationChainId &&
        item.sourceChainId &&
        item.shouldBondTransferRoot &&
        item.totalAmount &&
        timestampOk
      )
    })

    return filtered as UnbondedTransferRoot[]
  }

  async getExitableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<ExitableTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      let timestampOk = true
      if (item.sentConfirmTxAt) {
        timestampOk =
          item.sentConfirmTxAt + TxRetryDelayMs < Date.now()
      }

      const hashesToIgnore = [
        '0xd26bfea7a1e36695ebe734a8dd12f0775d95141e3161b744130a04ff39ec25ca',
        '0xf390e1875f52eeece936c18aff0638cde9a0b27f5096df7bb963a40a5fd18b79',
        '0x6ee032fede61e83edb5cb1102e2f74a14989bcadf351b43a1ab383e82ec583ff',
        '0x82ba945f0463ed54f68d47348f5530988f7aee73814f5466da1a835dc40cad25',
        '0xd2a932111e96ca60ef43fd9bbcdeab890a42e1bbc5674809486aa3a626dc157a',
        '0xd0e286afae84f507700a1c8cd51bcee2c234f50fd6441f9fe7beffce253824a5',
        '0x22ae7727d892a21acad85e601ed84d6e6cc5d1eb3911627503a648d9a0ef99a8',
        '0x2f254353216ef91fc10fde3f96fb773326293a6ddf3d82f0e450b11c6fbb61dd',
        '0x7e370921ae3bc87ac7d87d68cf2d8f0b2448f7aa7f141f15da073370477370af',
        '0xac8855ce3f4bd489f839ba0e4a5bfc83540da6a148270d331bcfbf633d62b071',
        '0x4da82a68e81d3939041421b067491d058eaa27067a98d688330c7a21eec1e999',
        '0x5493e05d3c88efa0258f120e179d52db44e75e60995dc7a168fc516d7dd203fa',
        '0xb804a9a6ebc403ef96479ab1daf2b243ff40ddc491e1ecc7096d8da887d02ef5',
        '0xfa33fc4bad00eecb1f5896435ece46ad73e6f417ecd346c371e56c98fbdf00bb',
        '0x55a11795cbc696ad099a2951bd5fdc08bc011dfba9a803f6220f6f3f30cd81f7',
        '0x943cbeb2891d26e8c4851b91d84c2373cf74e26982dc3178fd18d7a4c3ec8a40',
        '0xb2ceef8982685ebe1247d291104e652094e2162db4bfad25464c77b17d270086',
        '0xcab120bc29250b49d5629af9dd4ce28c318f7dfe784597221f7b3d82ad47ca5f',
        '0x4f41711ac66c710f3b2f885ef4f58c89f269498d7f60f667796b39c0088f4580',
        '0xecb844a7790953d553462ea2e31370fb2558b9cebec5826e980a8a2da18db0bf',
        '0xdaf86ffc228fe7a04f76db519bdc23dff0306f9468196f41615f101f55fa1bdd',
        '0x4579bf93f96dc5156f4af5c5b23914b550b9da14599554bc2cde7b00873bf840',
        '0xb531614789e7c3b4def8fa84ceb1feb5fa2ebebfa34c5ab81ed725beda2c87f9',
        '0x374df9950341a183e6f25652f49dc9ac814a6c4b2a2dddbf54404d272895a784',
        '0x0508a62ce6ace490a4d4c53970449d61148638cc3c659990e1ee28bbd690f274',
        '0xbad55f6acb84660fc72de6b7f969665f111b2d9fb78761b5c1262e3c3a4c0896',
        '0xed2cc54cbb1964222cc58aa38596874e0a5aa624837dd12839fb8abf11e2512a',
        '0x05dceac9a28dd0047faf016869c80bada9d9b8ad7109fd10a0e80a3585c205a5',
        '0xc74518bf7310c3392ddc91fd396293d280e13b0804ad68c6ac46fa7639c395fb',
        '0x1e5fc7e16bd0fcbb9e2aa92f0306755263b6bb437fb3a3a9d99dc65521b77af9',
        '0x8a00b6f56ae66a0434465951635f82e2d0c7542e20f2b8f68f7e3f6385932433',
        '0xc1c638c24a6a84e66f2a267f9182b2cdd51c4a595b84452507366b18ee4d2a5a',
        '0x0f62d32e45416f59fc3bb199296bcd7c774ed3e3e9dd24f1cc852ed4f15e435a',
        '0xacb40d83d0a1b5a748a04a1e78f98bb3a1bb21af8abf6502376035ecc724a29a',
        '0x611a25f3e5c7a61e345fb0edfeab5961c133f3fab1d9f69fcf441a25feebc3db',
        '0x3b4f690c0357c7628f89f6a6632725578321de2aca1b2fb7578d6d3fa3e77a7c',
        '0x723bd4dfd552e7157cc91336712c1ee5479a015637a7ab1db1fa17aafc600dbb',
        '0x3b7f06af457b84918db3e6447e737a30df44dfa0d6d2d03f30952bba88e9bbc0',
        '0x25914de28cc227919114cc0751a508a0d820846eac90b54dddedeb21267a7cee',
        '0x2ada318aa7ebe844a5555184e05b45b7bcf22150ce771010181308eabb644b84',
        '0xe1273ae292f47808e1eacf6fd9bf9639a302f8481fc55bbac3733f7cb1f7e507',
        '0x40076e2563e1f8b7ab747ae7738c1b92570b5b127f94c49ce8502b2ee8b8a79e',
        '0x7e58f3a7c79b00933b975c432de9e47e0a6b23dcf007a4fe8dbd382ffecbe160',
        '0xca297c65043360ca5651ad1a89ff9550e8d909325e99dba809c6a67d27fc9f81',
        '0x24669e11cc950403761449aef4a55e439558bfbaeeea0e4fc27d69df699c798b',
        '0xea98791d1bce8158cd6121c600f319d01fb7c8d647e32fddf418d907bd053753',
        '0x3063e76907e8b65615fdd3e9fd2200e4ae9b511eb96f0a3076b82b95019f0b2d'
      ]

      if (hashesToIgnore.includes(item.transferRootHash!)) {
        return false
      }

      let oruTimestampOk = true
      const sourceChain = chainIdToSlug(item.sourceChainId)
      const isSourceOru = oruChains.has(sourceChain)
      if (isSourceOru && item.committedAt) {
        const committedAtMs = item.committedAt * 1000
        // Add a buffer to allow validators to actually make the assertion transactions
        // https://discord.com/channels/585084330037084172/585085215605653504/912843949855604736
        const validatorBufferMs = OneHourMs * 10
        const oruExitTimeMs = OneWeekMs + validatorBufferMs
        oruTimestampOk =
          committedAtMs + oruExitTimeMs < Date.now()
      }

      // Do not exit ORU if there is no risk of challenge
      let oruShouldExit = true
      const isChallenged = item?.challenged === true
      if (isSourceOru && item?.bondedAt && !isChallenged) {
        const bondedAtMs: number = item.bondedAt * 1000
        const isChallengePeriodOver = bondedAtMs + ChallengePeriodMs < Date.now()
        if (isChallengePeriodOver) {
          oruShouldExit = false
        }
      }

      return (
        item.commitTxHash &&
        !item.confirmed &&
        item.transferRootHash &&
        item.transferRootId &&
        item.totalAmount &&
        item.destinationChainId &&
        item.committed &&
        item.committedAt &&
        timestampOk &&
        oruTimestampOk &&
        oruShouldExit
      )
    })

    return filtered as ExitableTransferRoot[]
  }

  async getChallengeableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<ChallengeableTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getBondedTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      let isWithinChallengePeriod = true
      const sourceChain = chainIdToSlug(item?.sourceChainId)
      const isSourceOru = oruChains.has(sourceChain)
      if (isSourceOru && item?.bondedAt) {
        const bondedAtMs: number = item.bondedAt * 1000
        const isChallengePeriodOver = bondedAtMs + ChallengePeriodMs < Date.now()
        if (isChallengePeriodOver) {
          isWithinChallengePeriod = false
        }
      }

      return (
        item.transferRootId &&
        item.transferRootHash &&
        !item.committed &&
        item.totalAmount &&
        item.bonded &&
        !item.challenged &&
        isWithinChallengePeriod
      )
    })

    return filtered as ChallengeableTransferRoot[]
  }

  async getUnsettledTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<UnsettledTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (filter.destinationChainId) {
        if (!item.destinationChainId || filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      // https://github.com/hop-protocol/hop/pull/140#discussion_r697919256
      let rootSetTimestampOk = true
      const checkRootSetTimestamp = item.rootSetTimestamp && filter.destinationChainId && chainIdToSlug(filter.destinationChainId) === Chain.Gnosis
      if (checkRootSetTimestamp) {
        rootSetTimestampOk = (item.rootSetTimestamp! * 1000) + RootSetSettleDelayMs < Date.now() // eslint-disable-line
      }

      let bondSettleTimestampOk = true
      if (item.withdrawalBondSettleTxSentAt) {
        bondSettleTimestampOk =
          (item.withdrawalBondSettleTxSentAt + TxRetryDelayMs) <
          Date.now()
      }

      let settleAttemptTimestampOk = true
      if (item.settleAttemptedAt) {
        settleAttemptTimestampOk = item.settleAttemptedAt + TxRetryDelayMs < Date.now()
      }

      return (
        item.transferRootId &&
        item.transferRootHash &&
        item.totalAmount &&
        item.transferIds &&
        item.destinationChainId &&
        item.rootSetTxHash &&
        item.committed &&
        item.committedAt &&
        !item.allSettled &&
        rootSetTimestampOk &&
        bondSettleTimestampOk &&
        settleAttemptTimestampOk
      )
    })

    return filtered as UnsettledTransferRoot[]
  }

  async getIncompleteItems (
    filter: GetItemsFilter = {}
  ) {
    await this.tilReady()
    const kv = await this.subDbIncompletes.getKeyValues()
    const transferRootIds = kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
    if (!transferRootIds.length) {
      return []
    }

    const batchedItems = await this.batchGetByIds(transferRootIds)
    const transferRoots = batchedItems.map(this.normalizeItem)
    const filtered = transferRoots.filter((item: TransferRoot) => {
      if (filter.sourceChainId && item.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      if (item.isNotFound) {
        return false
      }

      return this.subDbIncompletes.isItemIncomplete(item)
    })

    return filtered
  }

  async updateMultipleWithdrawalsSettledEvent (event: MultipleWithdrawalsSettled) {
    await this.subDbMultipleWithdrawalsSettleds.insertItem(event)
  }

  async getMultipleWithdrawalsSettledTotalAmount (transferRootId: string) {
    // sum up all the totalBondsSettled amounts to get total settled amount
    const events = await this.subDbMultipleWithdrawalsSettleds.getEvents(transferRootId)
    let settledTotalAmount = BigNumber.from(0)
    for (const event of events) {
      settledTotalAmount = settledTotalAmount.add(event.totalBondsSettled)
    }
    return settledTotalAmount
  }

  async getMultipleWithdrawalsSettledTxHash (transferRootId: string) {
    const events = await this.subDbMultipleWithdrawalsSettleds.getEvents(transferRootId)

    // we can use any tx hash since we'll be using it to decode list of transfer ids upstream
    return events?.[0]?.txHash
  }
}

export default TransferRootsDb
