import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import { BigNumber, Contract } from 'ethers'
import { Notifier } from 'src/notifier'
import { getTransferRootId } from 'src/utils'
import { hostname } from 'src/config'

export interface Config {
  chainSlug: string
  bridgeContract: Contract
  tokenSymbol: string
  label: string
  isL1: boolean
  dryMode?: boolean
}

class ChallengeWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: ChallengeWatcher }

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'ChallengeWatcher',
      prefix: config.label,
      bridgeContract: config.bridgeContract,
      isL1: config.isL1,
      logColor: 'red',
      dryMode: config.dryMode
    })

    this.notifier = new Notifier(`watcher: ChallengeWatcher, host: ${hostname}`)
  }

  async pollHandler () {
    if (!this.isL1) {
      return
    }
    await this.checkChallengeableTransferRootFromDb()
  }

  async checkChallengeableTransferRootFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getChallengeableTransferRoots()
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} challengeable root db items`
      )
    }

    for (const dbTransferRoot of dbTransferRoots) {
      const rootHash = dbTransferRoot.transferRootHash
      await this.checkChallengeableTransferRoot(
        rootHash,
        dbTransferRoot.bondTotalAmount
      )
    }
  }

  async checkChallengeableTransferRoot (
    transferRootHash: string,
    totalAmount: BigNumber
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    const transferRootId = getTransferRootId(transferRootHash, totalAmount)

    logger.debug('Challenging transfer root', transferRootHash)
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('transferRootId:', transferRootId)

    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )

    const l1Bridge = this.bridge as L1Bridge
    const transferRootCommittedAt = await l1Bridge.getTransferRootCommittedAt(
      dbTransferRoot.destinationChainId, transferRootId
    )
    const isRootHashConfirmed = !!transferRootCommittedAt
    if (isRootHashConfirmed) {
      logger.info('rootHash is already confirmed on L1')
      await this.db.transferRoots.update(transferRootHash, {
        challengeExpired: true
      })
      return
    }

    const bond = await l1Bridge.getTransferBond(transferRootId)
    if (bond.challengeStartTime.toNumber() > 0) {
      logger.info('challenge already started')
      await this.db.transferRoots.update(transferRootHash, {
        challenged: true
      })
      return
    }

    const challengePeriod: number = await l1Bridge.getChallengePeriod()
    const bondedAtMs: number = dbTransferRoot.bondedAt * 1000
    const challengePeriodMs: number = challengePeriod * 1000
    if (bondedAtMs + challengePeriodMs < Date.now()) {
      logger.info('challenge period over')
      await this.db.transferRoots.update(transferRootHash, {
        challengeExpired: true
      })

      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping challengeTransferRootBond`)
      return
    }

    const challengeMsg = `TransferRoot should be challenged! Root hash: ${transferRootHash}. Total amt: ${totalAmount}.`
    logger.debug(challengeMsg)
    await this.notifier.warn(challengeMsg)
    await this.db.transferRoots.update(transferRootHash, {
      challenged: true
    })
  }
}

export default ChallengeWatcher
