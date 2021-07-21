import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { User, waitForEvent } from './helpers'
import { bonderPrivateKey, governancePrivateKey, privateKey } from './config'
import { chainSlugToId, wait } from 'src/utils'
import { keccak256 } from 'ethereumjs-util'
import { startWatchers } from 'src/watchers/watchers'
require('dotenv').config()

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const logger = new Logger('TEST')

describe('challenge valid transfer root', () => {
  // TODO: use latest contracts and set min delay time
})

describe('challenge valid transfer root but committed too early', () => {
  const networks = [Chain.xDai]
  const destNetwork = Chain.Ethereum
  for (const sourceNetwork of networks) {
    const label = `challenge valid transfer root on ${sourceNetwork}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const bonder = new User(bonderPrivateKey)
        const { stop, watchers } = startWatchers({
          networks: [sourceNetwork, destNetwork]
        })
        logger.log('sending and waiting for receipt')
        let receipt = await user.sendAndWaitForReceipt(
          sourceNetwork,
          destNetwork,
          TOKEN,
          TRANSFER_AMOUNT
        )
        logger.log('got transfer receipt')
        const transferHash = receipt.logs[receipt.logs.length - 1].topics[1]
        const recipient = await user.getAddress()
        await waitForEvent(
          watchers,
          'bondWithdrawal',
          data => data.recipient === recipient
        )
        const validTransferRoot = transferHash
        let totalAmount = 0
        logger.log('bonding valid transfer root')
        logger.log('valid transferRootHash:', validTransferRoot)
        logger.log('waiting for transfer root to be bonded')
        await waitForEvent(watchers, 'bondTransferRoot', data => {
          if (data.transferRootHash === validTransferRoot) {
            totalAmount = data.totalAmount
            return true
          }
        })

        // await wait(30 * 1000)
        logger.log('checking transfer bond')
        expect(totalAmount).toBeGreaterThan(0)
        const transferRootId = await user.getTransferRootId(
          validTransferRoot,
          totalAmount
        )
        const transferBondStruct = await user.getTransferBond(transferRootId)
        const bondCreatedAt = Number(transferBondStruct.createdAt.toString())
        expect(bondCreatedAt).toBeGreaterThan(0)

        logger.log('challenging')

        let tx = await user.challengeTransferRoot(
          validTransferRoot,
          totalAmount
        )
        logger.log('challenge root tx:', tx.hash)
        await tx.wait()
        logger.log('got challenge receipt')

        const challengeResolutionPeriod = await user.getChallengeResolutionPeriod()
        logger.log(
          `waiting challengeResolutionPeriod ${challengeResolutionPeriod} seconds`
        )
        await wait(challengeResolutionPeriod * 1000)

        logger.log('checking challenge time')
        const challengeStartTime = Number(
          transferBondStruct.challengeStartTime.toString()
        )
        const blockTimestamp = await user.getBlockTimestamp(Chain.Ethereum)
        expect(blockTimestamp).toBeGreaterThan(
          challengeStartTime + challengeResolutionPeriod
        )
        expect(transferBondStruct.challengeResolved).toBe(false)

        logger.log('resolving challenge')
        const userBalanceBefore = await user.getBalance(Chain.Ethereum, TOKEN)
        const bonderCreditBefore = await bonder.getCredit(Chain.Ethereum)
        tx = await user.resolveChallenge(validTransferRoot, totalAmount)
        receipt = await tx.wait()
        expect(receipt.status).toBe(1)
        logger.log('challenge resolved')
        const userBalanceAfter = await user.getBalance(Chain.Ethereum, TOKEN)
        const bonderCreditAfter = await bonder.getCredit(Chain.Ethereum)
        const minTransferRootBondDelay = await user.getMinTransferRootBondDelaySeconds()
        const challengeStakeAmount = await user.getChallengeAmountForTransferAmount(
          totalAmount
        )
        const bondForTransferAmount = await user.getBondForTransferAmount(
          totalAmount
        )
        const destChainId = chainSlugToId(destNetwork)
        const committedAt = await user.getTransferRootCommittedAt(
          destChainId,
          transferRootId,
          TOKEN
        )
        const challengerWin = committedAt <= 0
        expect(challengerWin).toBe(true)

        if (challengerWin) {
          // TODO: fix this when using latest contracts
          expect(userBalanceAfter).toBe(
            userBalanceBefore + (challengeStakeAmount * 7) / 4
          )
        } else {
          if (bondCreatedAt > committedAt + minTransferRootBondDelay) {
            expect(bonderCreditAfter).toBe(
              bonderCreditBefore + bondForTransferAmount + challengeStakeAmount
            )
          } else {
            expect(bonderCreditAfter).toBe(
              bonderCreditBefore + bondForTransferAmount
            )
          }
        }

        await stop()
      },
      900 * 1000
    )
  }
})

describe.only('challenge invalid transfer root', () => {
  const networks = [Chain.xDai]
  const destNetwork = Chain.Ethereum
  for (const sourceNetwork of networks) {
    const chainId = chainSlugToId(sourceNetwork)
    const label = `challenge invalid transfer root on ${sourceNetwork}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const bonder = new User(bonderPrivateKey)
        const { stop, watchers } = startWatchers({
          networks: [sourceNetwork, destNetwork]
        })
        logger.log('sending and waiting for receipt')
        let receipt = await user.sendAndWaitForReceipt(
          sourceNetwork,
          destNetwork,
          TOKEN,
          TRANSFER_AMOUNT
        )
        logger.log('got transfer receipt')
        const invalidTransferRoot =
          '0x' + keccak256(Buffer.from(Date.now().toString())).toString('hex')
        const totalAmount = 1
        logger.log('bonding invalid transfer root')
        logger.log('invalid transferRootHash:', invalidTransferRoot)
        receipt = await bonder.bondTransferRootAndWaitForReceipt(
          invalidTransferRoot,
          chainId,
          totalAmount
        )
        expect(receipt.status).toBe(1)
        logger.log('got bond invalid transfer root receipt')
        await waitForEvent(
          watchers,
          'challengeTransferRootBond',
          data => data.transferRootHash === invalidTransferRoot
        )
        logger.log('got challengeTransferRootBond event')

        const challengeResolutionPeriod = await user.getChallengeResolutionPeriod()
        logger.log(
          `waiting challengeResolutionPeriod ${challengeResolutionPeriod} seconds`
        )
        await wait(challengeResolutionPeriod * 1000)

        logger.log('checking challenge time')
        const transferRootId = await user.getTransferRootId(
          invalidTransferRoot,
          totalAmount
        )
        const transferBondStruct = await user.getTransferBond(transferRootId)
        const challengeStartTime = Number(
          transferBondStruct.challengeStartTime.toString()
        )
        const bondCreatedAt = Number(transferBondStruct.createdAt.toString())
        expect(challengeStartTime).toBeGreaterThan(0)
        const blockTimestamp = await user.getBlockTimestamp(Chain.Ethereum)
        expect(blockTimestamp).toBeGreaterThan(
          challengeStartTime + challengeResolutionPeriod
        )
        expect(transferBondStruct.challengeResolved).toBe(false)

        logger.log('resolving challenge')
        const balanceBefore = await user.getBalance(Chain.Ethereum, TOKEN)
        const creditBefore = await bonder.getCredit(Chain.Ethereum)
        const tx = await user.resolveChallenge(invalidTransferRoot, totalAmount)
        receipt = await tx.wait()
        expect(receipt.status).toBe(1)
        logger.log('challenge resolved')
        const minTransferRootBondDelay = await user.getMinTransferRootBondDelaySeconds()
        const challengeStakeAmount = await user.getChallengeAmountForTransferAmount(
          totalAmount
        )
        const bondForTransferAmount = await user.getBondForTransferAmount(
          totalAmount
        )
        const destChainId = chainSlugToId(destNetwork)
        const committedAt = await user.getTransferRootCommittedAt(
          destChainId,
          transferRootId,
          TOKEN
        )
        const challengerWin = committedAt <= 0
        expect(challengerWin).toBe(true)

        if (challengerWin) {
          const balanceAfter = await user.getBalance(Chain.Ethereum, TOKEN)
          // TODO: fix this when using latest contracts
          expect(balanceAfter).toBe(balanceBefore)
        } else {
          const creditAfter = await bonder.getCredit(Chain.Ethereum)
          if (bondCreatedAt > committedAt + minTransferRootBondDelay) {
            expect(creditAfter).toBe(
              creditBefore + bondForTransferAmount + challengeStakeAmount
            )
          } else {
            expect(creditAfter).toBe(creditBefore + bondForTransferAmount)
          }
        }

        await stop()
      },
      900 * 1000
    )
  }
})

test.skip(
  'updateChallengePeriod',
  async () => {
    await updateChallengePeriods()
  },
  120 * 1000
)

async function updateChallengePeriods () {
  const gov = new User(governancePrivateKey)
  const challengePeriod = 300
  const timeSlotSize = challengePeriod / 3
  let tx = await gov.setChallengePeriodAndTimeSlotSize(
    challengePeriod,
    timeSlotSize
  )
  logger.log(tx?.hash)
  let receipt = await tx.wait()
  expect(receipt.status).toBe(1)

  const challengeResolutionPeriod = 30
  tx = await gov.setChallengeResolutionPeriod(challengeResolutionPeriod)
  logger.log(tx?.hash)
  receipt = await tx.wait()
  expect(receipt.status).toBe(1)
}
