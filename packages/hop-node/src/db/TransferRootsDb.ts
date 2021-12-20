import BaseDb, { KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { Chain, ChallengePeriodMs, OneHourMs, OneWeekMs, RootSetSettleDelayMs, TxRetryDelayMs } from 'src/constants'
import { normalizeDbItem } from './utils'
import { oruChains } from 'src/config'

export type TransferRoot = {
  transferRootId?: string
  transferRootHash?: string
  totalAmount?: BigNumber
  destinationChainId?: number
  sourceChainId?: number
  sentCommitTxAt: number
  committed?: boolean
  committedAt?: number
  commitTxHash?: string
  commitTxBlockNumber?: number
  confirmed?: boolean
  confirmedAt?: number
  confirmTxHash?: string
  rootSetTxHash?: string
  rootSetBlockNumber?: number
  rootSetTimestamp?: number
  sentConfirmTxAt?: number
  shouldBondTransferRoot?: boolean
  bonded?: boolean
  sentBondTxAt?: number
  bondTxHash?: string
  bondBlockNumber?: number
  bondedAt?: number
  transferIds?: string[]
  bonder?: string
  withdrawalBondSettleTxSentAt?: number
  challenged?: boolean
  allSettled?: boolean
  multipleWithdrawalsSettledTxHash?: string
  multipleWithdrawalsSettledTotalAmount?: BigNumber
  isNotFound?: boolean
}

type TransferRootsDateFilter = {
  fromUnix?: number
  toUnix?: number
}

type GetItemsFilter = Partial<TransferRoot> & {
  destinationChainIds?: number[]
}

const invalidTransferRoots: Record<string, boolean> = {
  // Optimism pre-regenesis roots
  '0x063d5d24ca64f0c662b3f3339990ef6550eb4a5dee7925448d85b712dd38b9e5': true,
  '0x4c131e7af19d7dd1bc8ffe8e937ff8fcdb99bb1f09cc2e041f031e8c48d4d275': true,
  '0x843314ec24c31a00385ae66fb9f3bfe15b29bcd998681f0ba09b49ac500ffaee': true,
  '0x693d04548e6f7b6cafbd3761744411a2db98230de2d2ac372b310b59de42530a': true,
  '0xdcfab2fe9e84837b1cece4b3585ab355f8e51750f7e55a7a282da81bbdc0a5dd': true,
  '0xe3de2861ff4ca7046da4bd0345beb0a6fcb6fa09b108cc2d66f8bdfa7768fd70': true,
  '0xdfa48ba341de6478a8236a9efd9dd832569f2e7045d357a27ec89c8aeed25d19': true,
  '0xf3c01d73de571edcddc5a627726c1b5e1301da394a65d713cb489d3999cba52a': true,
  '0x8ce859861c32ee6608b45501e3a007165c9053b22e8f482edd2585746aa479b8': true,
  '0x3a098609751fa52d284ae86293873123238d2b676a6fc2b6620a34d3d83b362b': true,
  '0xd8b02ee1f0512ced8be25959c7650aeb9f6a5c60e3e63b1e322b5179545e9b73': true,
  '0x7d6cb1ee007a95756050f63d7f522b095eb2b3818207c2198fcdb90dc7fdc00c': true,
  '0x590778a6138164cfe808673fb3f707f3b16432c29c2d341cc97873bbc3218eae': true,
  '0xf2ccd9600ff6bf107fd16b076bf310ea456f14c9cee2a9c6abf1f394b2fe2489': true,
  '0x12a648e1dd69a7ae52e09eddc274d289280d80d5d5de7d0255a410de17ec3208': true,
  '0x00cd29b12bc3041a37a2cb64474f0726783c9b7cf6ce243927d5dc9f3473fb80': true,
  '0xa601b46a44a7a62c80560949eee70b437ba4a26049b0787a3eab76ad60b1c391': true,
  '0xbe12aa5c65bf2ebc59a8ebf65225d7496c59153e83d134102c5c3abaf3fd92e9': true,
  // Other
  '0xf902d5143ceee334fce5d56483024e0f4c476a1b5065d9d39d6c1deb6513b7bb': true,
  '0x07cb3b4d0246d68af81e5ba78d3714726679116137b4c426be9695730daff61a': true,
  '0x088b33a098c33e7ee5f34505b75193bd404876d736c0c30914f2d408054ced23': true,
  '0x0ac9d14049246430921aa9c23f12a20a1b88edf77c3dc89f68795c5cdf32fc8b': true,
  '0x0b23a433b6812637ccaeb761012a33c9423f5e266ab4c881a307799b9bc1b102': true,
  '0x0e554f027de80cd241b57c1b3c94a7ae5885c2a396b10c9c6f4c24307adf2e81': true,
  '0x0fcdc16491c7b490fd177720b8d387284da9f98a9e93d6f0c882b818d2f33e12': true,
  '0x115aee9493dec58f40a41fc6dda4e0cfed5e71c693bbddfbceefdd2807495453': true,
  '0x1207e1f1cc12b87b318cc045fccf97fdb613f39487982dd997f239c3b461dfff': true,
  '0x1678fd9c4ca7e55ac604f55daaa7b22ecf511ef526c3749ac366debb926d67c9': true,
  '0x1b60d67c50af3f0d6aced7c8007d57d01ec3982b3b880c9fb38ea426435346f9': true,
  '0x1bfb01220659328f9379ef2dab7356c98889c3f0db57920aa7ee491cd8d3ad60': true,
  '0x1edf64663c2c65283ef0b1ab02315181d1ffa49e6f2c1dbb387b6c93c05aecbf': true,
  '0x2330e9c4571636eb0ef16681c993d7b64b97b44be71b8ffb89543fe23b27e307': true,
  '0x268e8ec5e1e1583c8cbf334ba672bb74f631b397976bfd0c2e7cd717b04f8748': true,
  '0x281d9fdb6edc35f1196d502f6df9b0c127c2df8eea2dee961fa21af538fe8090': true,
  '0x2ae7edb530bf5fcdbc806e7ea59fe997e25239363001c50dd08eca3bb910d697': true,
  '0x32e5ce02df624eb221f389e9303d31b665b2625f42d63c0d4991fe7f970e6eb7': true,
  '0x376e20cf1c2166efdb9594ba3b3346fd620d4477b3575ee35e44dbdc9719f67d': true,
  '0x37be937dd238441ac3fdbfdc114016d7554229bbc54a0b1907af4d3a8dd31672': true,
  '0x37c494372a38c177103e7ea87ea4f537ac79e1eb53390ef2a32d31a62d87c80b': true,
  '0x37eabab2ed554fef009204460e90567ce239913b5fccc6d18b10d146779779b8': true,
  '0x3af969e3fe25f4b37a38371091bfc69cf139299bf795714ee636c8ce4fa6f5b4': true,
  '0x3b3c8a294b5454c6012b33f7cc74685a9f82d5914c69ad81bc568e2e1ddd9d0c': true,
  '0x3c3d2d5646dcdd6c890f32991bdf75adadee42b6d9c3d8ad241c75e81c9868cc': true,
  '0x3d48f77852e44cb2233c7efbf1a1a1b2135487c521cff94efdf5a3940a69ef97': true,
  '0x4252d26e41beb7d8bc4fc075cb80fc128c2380e5b35dccf7273e653597790f6d': true,
  '0x4845904728a0676c0edd849c961f17c7775b91855d0a8e97fe9365da8bf06e13': true,
  '0x4a9bfe4f60a922fce15d8883e655eaa618635eeae982eaa452cf4476ec7fae03': true,
  '0x4c0b47b62f9400dc9e94dce42c215f4dca6f89c54f89574021224fbe1acc62e1': true,
  '0x4c26d3e35f39b7e73a2d05cf72b13546de5d2afb0ba62844d85b182d1c806544': true,
  '0x50b6c2eb605e292b3bbc3867a7ad346e9e6cc6f0bfacff43ffe94ca64753f894': true,
  '0x54c47cb6f9f745b1cc4d46dec587c5e440779e8e5be20218aa72b8837f68a69c': true,
  '0x5748578bb0d625a728c3865d174f8aa70acc120da079fc7bfad4a7be30ae1da5': true,
  '0x595743844604a3059ed3dc7305e1c06b9180ee851e3267f942e4272cdbe9d285': true,
  '0x5dd593b82914698a16255aa82ac3458c87ea240d100deab07282f8099c662318': true,
  '0x611e54b53c065f8d3fee191a28f9461c1deac57fbb396870086224475e5da1ae': true,
  '0x6733f45adcd795bfb2728f0e858bced163ed570ccbe4c2603fa8d44ef20a1c02': true,
  '0x6a08e43507be2831837e366ad0704289c9d456f7796bbbd68cfd50f0a7450e13': true,
  '0x6b3ac02272dce5f766410193d9d8b7b48e5f0fbacd6ea2a0524384e8d05b3174': true,
  '0x6e23a10d4266332ef839109fc245847f4b900039a4bf447c3bce01d966b34ca5': true,
  '0x6edc436e789cce11569dc307978d5ee4bdc7bd09a5cc2e7c7b439d3188e8bf6e': true,
  '0x6f1393dcd54c5934a54cd8419b9149557e3d4aec9602601922697c2fd5d202d4': true,
  '0x6fa3e9551531c7302aeac41e96518d6c096f5f64b815e1e3a539803549e09a47': true,
  '0x70d65979ad41c41b2ccf277895e9d9aa52c3fb93de804547b31a2828fe4b4b09': true,
  '0x729bc3f5620b63c15b2fad19828b5f87f6c28f221068939043405b2b04c29626': true,
  '0x74dff6f50b6b34709166d29bd465e97ce05b0721eed0c327d806709418c3de1a': true,
  '0x77bab4dd9a27c9b0475cce52833c87deb1a213806190a80aad10d099663ab482': true,
  '0x77e2d7331c148cce2cc1e60e5a999f3a11ac7ec970e334a81c37d338bb209b2f': true,
  '0x77faff82e31e449beec502ade9efd67bc709ca1edbeb0c7ca54f28aaa7ce66e6': true,
  '0x7daf813b753ee5d6a26fce7265332b6ae3cba67f40b0896ff4c6f646f1a27a29': true,
  '0x827f20e17d9a86460f19637daa2f01032e625ba1691c378f711866595c01e06f': true,
  '0x83f064178cc8ba6c1c9e58de3614c0fa0d0dee3792f1c649b32d781f4af35ab6': true,
  '0x84af8716f02f12b85893175717a0b5e6acb20ff895e5ce37d245672f46ee77b6': true,
  '0x84cc5c71c7112454b9d18daf1e2c5b6795e9fef5dc4df77a2dd9e29a0e503776': true,
  '0x88b342f8cb23eb6fa73e4617fff7f3fdfa2b5569d4bad0e3c3555ac60faeb261': true,
  '0x8bb3768595d2e7686bbbf051ae73fa013d910c110a8671f92d18d2892bd17a73': true,
  '0x8bb46b05382afc8e818eaf9d6d902500c5c526908b848a6b435af993416460ee': true,
  '0x8df3be8957a6b70db6353c4e1ddf58f05d089a02d80b7009e7088718913ffbd9': true,
  '0x8e14f4e103720aa2df8327e9247f0964ae94f22f2179f4655a0bb28e6d5a34b8': true,
  '0x8e6676a5d6ccca08fa3f8ea211bbb713fb63a4169bbbf9d6d90a086f4d73f703': true,
  '0x962a1c8b2847ac00838330cac53d97b4247686c67c6b8db9083149686972056d': true,
  '0x96914168f96bb7f9d19796c60b4a0bd2914a09ee31ee36be9e83dbfff75a8a92': true,
  '0x9756b37d598469212fbc5c60b8eabc427c35d9d2a57a4292c5ff24e73ef28c23': true,
  '0x9acffbe77f99d488b20e48d6ecfe9cfcd287a9cf55dcee377c3986d35bd8d63b': true,
  '0x9bedc0fb56602281ec49550ae6e7450366319fe96cd7b564c3a7013cc450ffb7': true,
  '0xa212436194d7d6109c3f22ddbe9cd823f5f76abe65568c33d9d9c7bc0e389170': true,
  '0xa23cc811c07af2151cdd5fd83ac50d49c27abef7d581d2e4475ebf0738cc8264': true,
  '0xa67b01a7f1114c17ca6ac7c6079a8a8c934319f936e3ad108e146f9685147041': true,
  '0xa8d0fd7ac20805524e5db5ace0f47e9b4dbe7c5c832a5b0ec8c0f9205db60874': true,
  '0xab2915687e6d20c40470c2a3720887fd0150129950c471525a4cf291ce73787e': true,
  '0xab9f6b65b91b226635dcd1b75211cb6791707dd0bd5b21995d4bd7278ff894de': true,
  '0xb072bf7f4f839e71c11379960133b99d92cbd13c3da29ba6a81878a588437e93': true,
  '0xb5219bed7eaa6e81cf2d6fefcd03bd826fcf3b0cbcf5df7f89ad582085d7335f': true,
  '0xb64364b314e04c453670ef3ef98b0a1039ff5e9ef45a404083aafb7a97076d0f': true,
  '0xbcbe1ddb16c7dc06c608a831aed1f1afa360705bc8708f6ea0fff3fded276dfc': true,
  '0xbecb0f669c30161318fc60d3d2fe9e857f305e38bd6d1ae486a1ab78452e2884': true,
  '0xbed42030ce260dcaef00538263a70885c2ec91691025498793f83a9fc738ee10': true,
  '0xc0383974f4b28d3751a34332a890a4a99293fb7b4e9d27dd26081cce514fd0bb': true,
  '0xc0e238c1b55c0e1e6e4fc08ca2a697e8f29a4532a2a85d050ecba3265794d1b8': true,
  '0xc512792df647c70f0f1ba2c015002b7e09ee9099a562cdfd1e5ecc8c634b310e': true,
  '0xc63ba26ad650dc010fc79deb0be6933d5860796fd605068e5c3826052330fa56': true,
  '0xc8248526bf8f4f26f6401c74892005c10e83d721ff24ab361049a8562a869489': true,
  '0xc9ffb87ca49647793772ddfc5b21b98cc702beb7e5f514919bbc3b3386cc29f5': true,
  '0xce0d4ca1c09c8013923c6029b030a524808c502b8b3de8b67b8a335e03c1eba2': true,
  '0xd214d0f3407646cd47a3213e71ad55fc4a340bd74e25bbb902e3704b14e66f95': true,
  '0xd6d8e36135e6669027f8547a8d3d9023cfab0f31c9720fb6a893bf9799d7df05': true,
  '0xd8ac655dd48ba5a041f9c4aa505a4a9e386af92ff35a62a3e5e038cc1ff64515': true,
  '0xda48d791ef2c94c6a7d942fe67e7f21eac5c02e984cceef554bf278c85550b19': true,
  '0xe321c402a022865093f366bd41c1ddeb5efd4d374327da4e57f58c8f198efa96': true,
  '0xe3ff98e42b888750b2f2040e27d48a3af6e20c6f8ae4161bb4cdce9cd944efb5': true,
  '0xe829c81a24c014d17d529ab69309481d3c57784a146d31994552022330ff34b7': true,
  '0xe853aa0209a16e962f3912d674249dc870baf42e872fd6c534b7c1ec3c4096be': true,
  '0xe8a031b47cf5843a5841eb5e0049ea12a66e1c00b12436ed1673ad236443e1df': true,
  '0xebb138059daad8ec0fc690e37b437d3cc792f41b2d64809c862ce487888439d6': true,
  '0xed29885e9b69ba4b5f7fc1c7710562cda8b55aa769959d613fd4d12dd3e2a8f2': true,
  '0xeeecb522117bc1df2d3f334ebf843aed8e0663641ede2922a1d87ea4ae92603f': true,
  '0xf1f87619ce2021939ff8ca2327b1812541bfbf8416e3510514990253dbcb2fb2': true,
  '0xf29af81a03b312c014cc3e20c90bbb04105d7de99f0215c8f7f212214f3f4bfc': true,
  '0xf2b60fe8a018ee7bb72b1eca5be0c5c7c34820767c90e0a4ecdcb7da596dbdd4': true,
  '0xf3e6c67fe0c206ed472c89412de073f6955136e73fdbbc06319d0009ce12d6de': true,
  '0xf5393cdd34e47ae881a76266297b5ab293baf7df7fe34d39606a5f09afe3c26a': true,
  '0xf542914015967cff7bfbf3f44c18697e82487667b3e021c1601d72fff30ce542': true,
  '0xf64d0094f9fcc615afec9007fcd9b978e9cfcb69824a8134eac162d541104c84': true,
  '0xf903e11d697359281521efb558383475c5c759020c0d93ae7edec4eee2a9c7c5': true,
  '0xfb03fe0b69e690bf318e7745985867f7be0522ccde338629c592b73b045e576c': true,
  '0xfb9240d6494a59093b3fb57f78cc1df1ee1295b1bdf951f119c40d651955e13f': true,
  '0x15b910fa5db38fce2466c5aa43bb3ff9e372418f1632ce3d767155f49d52bbdf': true,
  '0x62d4596b79785a57d780a7da98bbf70fba2b9409c9a96468c0293bcbd4175b0c': true
}

class TransferRootsDb extends BaseDb {
  subDbIncompletes: BaseDb
  subDbTimestamps: BaseDb
  subDbRootHashes: BaseDb

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDbTimestamps = new BaseDb(`${prefix}:timestampedKeys`, _namespace)
    this.subDbIncompletes = new BaseDb(`${prefix}:incompleteItems`, _namespace)
    this.subDbRootHashes = new BaseDb(`${prefix}:rootHashes`, _namespace)

    this.migration()
      .then(() => {
        this.ready = true
        this.logger.debug('db ready')
      })
      .catch(err => {
        this.logger.error(err)
      })
  }

  async migration () {
    // re-index timestamped db keys by transfer root id
    let items = await this.subDbTimestamps.getKeyValues()
    let promises: Array<Promise<any>> = []
    for (const { key, value } of items) {
      promises.push(new Promise(async (resolve) => {
        if (!value?.transferRootHash) {
          resolve(null)
          return
        }
        const item = await this.getById(value.transferRootHash)
        if (!item?.transferRootId) {
          resolve(null)
          return
        }
        const { transferRootId } = item
        const parts = key.split(':')
        if (parts.length < 2) {
          resolve(null)
          return
        }
        const newKey = `${parts[0]}:${parts[1]}:${transferRootId}`
        await this.subDbTimestamps._update(newKey, { transferRootId })
        await this.subDbTimestamps.deleteById(key)
        resolve(null)
      }))
    }

    await Promise.all(promises)

    // re-index incomplete db item keys by transfer root id
    items = await this.subDbIncompletes.getKeyValues()
    promises = []
    for (const { key, value } of items) {
      promises.push(new Promise(async (resolve) => {
        if (!value?.transferRootHash) {
          resolve(null)
          return
        }
        const item = await this.getById(value.transferRootHash)
        if (!item?.transferRootId) {
          resolve(null)
          return
        }
        const { transferRootId } = item
        await this.subDbIncompletes._update(transferRootId, { transferRootId })
        await this.subDbIncompletes.deleteById(key)
        resolve(null)
      }))
    }

    await Promise.all(promises)

    // re-index db keys by transfer root id
    items = await this.getKeyValues()
    promises = []
    for (const { key, value } of items) {
      promises.push(new Promise(async (resolve) => {
        if (!value?.transferRootId || key === value?.transferRootId) {
          resolve(null)
          return
        }
        const { transferRootId } = value
        await this._update(transferRootId, value)
        await this.deleteById(key)
        resolve(null)
      }))
    }

    await Promise.all(promises)
  }

  async updateIncompleteItem (item: Partial<TransferRoot>) {
    if (!item) {
      this.logger.error('expected item', item)
      return
    }
    const { transferRootId } = item
    if (!transferRootId) {
      this.logger.error('expected transferRootId', item)
      return
    }
    const isIncomplete = this.isItemIncomplete(item)
    const exists = await this.subDbIncompletes.getById(transferRootId)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      await this.subDbIncompletes._update(transferRootId, { transferRootId })
    } else if (shouldDelete) {
      await this.subDbIncompletes.deleteById(transferRootId)
    }
  }

  getTimestampedKey (transferRoot: Partial<TransferRoot>) {
    if (transferRoot.committedAt && transferRoot.transferRootId) {
      const key = `transferRoot:${transferRoot.committedAt}:${transferRoot.transferRootId}`
      return key
    }
  }

  async getTimestampedKeyValueForUpdate (transferRoot: Partial<TransferRoot>) {
    if (!transferRoot) {
      this.logger.warn('expected transfer root object for timestamped key')
      return
    }
    const transferRootId = transferRoot.transferRootId
    const key = this.getTimestampedKey(transferRoot)
    if (!key) {
      this.logger.warn('expected timestamped key. incomplete transfer root:', JSON.stringify(transferRoot))
      return
    }
    if (!transferRootId) {
      this.logger.warn(`expected transfer root id for timestamped key. key: ${key} incomplete transfer root: `, JSON.stringify(transferRoot))
      return
    }
    const item = await this.subDbTimestamps.getById(key)
    const exists = !!item
    if (!exists) {
      const value = { transferRootId }
      return { key, value }
    }
  }

  async getRootHashKeyValueForUpdate (transferRoot: Partial<TransferRoot>) {
    if (!transferRoot) {
      this.logger.warn('expected transfer root object for root hash key')
      return
    }
    const transferRootId = transferRoot.transferRootId
    const key = transferRoot.transferRootHash
    if (!key) {
      this.logger.warn('expected root hash key. incomplete transfer root:', JSON.stringify(transferRoot))
      return
    }
    if (!transferRootId) {
      this.logger.warn(`expected transfer root id for root hash key. key: ${key} incomplete transfer root: `, JSON.stringify(transferRoot))
      return
    }
    const item = await this.subDbRootHashes.getById(key)
    const exists = !!item
    if (!exists) {
      const value = { transferRootId }
      return { key, value }
    }
  }

  async update (transferRootId: string, transferRoot: Partial<TransferRoot>) {
    await this.tilReady()
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('update called')
    transferRoot.transferRootId = transferRootId
    const promises: Array<Promise<any>> = []
    const timestampedKv = await this.getTimestampedKeyValueForUpdate(transferRoot)
    if (timestampedKv) {
      logger.debug(`storing timestamped key. key: ${timestampedKv.key} transferRootId: ${transferRootId}`)
      promises.push(this.subDbTimestamps._update(timestampedKv.key, timestampedKv.value).then(() => {
        logger.debug(`updated db item. key: ${timestampedKv.key}`)
      }))
    }
    const rootHashKv = await this.getRootHashKeyValueForUpdate(transferRoot)
    if (rootHashKv) {
      logger.debug(`storing root hash key. key: ${rootHashKv.key} transferRootId: ${transferRootId}`)
      promises.push(this.subDbRootHashes._update(rootHashKv.key, rootHashKv.value).then(() => {
        logger.debug(`updated db item. key: ${rootHashKv.key}`)
      }))
    }
    promises.push(this._update(transferRootId, transferRoot).then(async () => {
      const entry = await this.getById(transferRootId)
      logger.debug(`updated db transferRoot item. ${JSON.stringify(entry)}`)
      await this.updateIncompleteItem(entry)
    }))
    await Promise.all(promises)
  }

  normalizeItem (item: Partial<TransferRoot>) {
    if (!item) {
      return item
    }
    return normalizeDbItem(item)
  }

  async getByTransferRootId (
    transferRootId: string
  ): Promise<TransferRoot> {
    await this.tilReady()
    const item: TransferRoot = await this.getById(transferRootId)
    return this.normalizeItem(item)
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot | null> {
    await this.tilReady()
    let item = await this.subDbRootHashes.getById(transferRootHash)
    if (!item?.transferRootId) {
      return null
    }
    item = await this.getById(item.transferRootId)
    return this.normalizeItem(item)
  }

  private readonly filterTimestampedKeyValues = (x: any) => {
    return x?.value?.transferRootId
  }

  async getTransferRootIds (dateFilter?: TransferRootsDateFilter): Promise<string[]> {
    await this.tilReady()
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
    const kv = await this.subDbTimestamps.getKeyValues(filter)
    return kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
  }

  sortItems = (a: any, b: any) => {
    return a?.committedAt - b?.committedAt
  }

  async getItems (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRootIds = await this.getTransferRootIds(dateFilter)
    const batchedItems = await this.batchGetByIds(transferRootIds)
    const transferRoots = batchedItems.map(this.normalizeItem)

    const items = transferRoots
      .sort(this.sortItems)

    this.logger.debug(`items length: ${items.length}`)
    return items
  }

  async getTransferRoots (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    return await this.getItems(dateFilter)
  }

  // gets only transfer roots within range: now - 2 weeks ago
  async getTransferRootsFromTwoWeeks (): Promise<TransferRoot[]> {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - (OneWeekMs * 2)) / 1000)
    return await this.getTransferRoots({
      fromUnix
    })
  }

  async getUnbondedTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (filter.destinationChainId) {
        if (!item.destinationChainId || filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      const shouldIgnoreItem = this.isInvalidOrNotFound(item)
      if (shouldIgnoreItem) {
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
  }

  async getExitableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
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

      let oruTimestampOk = true
      const sourceChain = chainIdToSlug(item.sourceChainId)
      const isSourceOru = oruChains.includes(sourceChain)
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
  }

  async getChallengeableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      let isWithinChallengePeriod = true
      const sourceChain = chainIdToSlug(item?.sourceChainId)
      const isSourceOru = oruChains.includes(sourceChain)
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
  }

  async getUnsettledTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
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
      const checkRootSetTimestamp = item.rootSetTimestamp && filter.destinationChainId && chainIdToSlug(filter.destinationChainId) === Chain.xDai
      if (checkRootSetTimestamp) {
        rootSetTimestampOk = (item.rootSetTimestamp! * 1000) + RootSetSettleDelayMs < Date.now() // eslint-disable-line
      }

      let bondSettleTimestampOk = true
      if (item.withdrawalBondSettleTxSentAt) {
        bondSettleTimestampOk =
          (item.withdrawalBondSettleTxSentAt + TxRetryDelayMs) <
          Date.now()
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
        bondSettleTimestampOk
      )
    })
  }

  isItemIncomplete (item: Partial<TransferRoot>) {
    if (!item?.transferRootId) {
      return false
    }

    const shouldIgnoreItem = this.isInvalidOrNotFound(item)
    if (shouldIgnoreItem) {
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
      (item.sourceChainId && item.destinationChainId && item.commitTxBlockNumber && item.totalAmount && !item.transferIds) ||
      (item.multipleWithdrawalsSettledTxHash && item.multipleWithdrawalsSettledTotalAmount && !item.transferIds)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
  }

  async getIncompleteItems (
    filter: Partial<TransferRoot> = {}
  ) {
    await this.tilReady()
    const kv = await this.subDbIncompletes.getKeyValues()
    const transferRootIds = kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
    if (!transferRootIds.length) {
      return []
    }

    const batchedItems = await this.batchGetByIds(transferRootIds)
    const transferRoots = batchedItems.map(this.normalizeItem)
    return transferRoots.filter(item => {
      if (filter.sourceChainId && item.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      const shouldIgnoreItem = this.isInvalidOrNotFound(item)
      if (shouldIgnoreItem) {
        return false
      }

      return this.isItemIncomplete(item)
    })
  }

  isInvalidOrNotFound (item: Partial<TransferRoot>) {
    const isNotFound = item?.isNotFound
    const isInvalid = invalidTransferRoots[item.transferRootId!] // eslint-disable-line @typescript-eslint/no-non-null-assertion
    return isNotFound || isInvalid // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
  }

  isRouteOk (filter: GetItemsFilter = {}, item: Partial<TransferRoot>) {
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
}

export default TransferRootsDb
