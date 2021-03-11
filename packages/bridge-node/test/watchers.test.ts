require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { wait, isL1, networkSlugToId } from 'src/utils'
import { KOVAN, ARBITRUM, XDAI } from 'src/constants'
import { User, checkApproval, waitForEvent } from './helpers'
import { privateKey, bonderPrivateKey, governancePrivateKey } from './config'
import { keccak256 } from 'ethereumjs-util'
import Logger from 'src/logger'

const L1ToL2Paths = [
  [KOVAN, ARBITRUM],
  //[KOVAN, OPTIMISM],
  [KOVAN, XDAI]
]

const L2ToL1Paths = [
  [ARBITRUM, KOVAN],
  //[OPTIMISM, KOVAN],
  [XDAI, KOVAN]
]

const L2ToL2Paths = [
  //[OPTIMISM, ARBITRUM],
  //[OPTIMISM, XDAI],
  //[ARBITRUM, OPTIMISM],
  [ARBITRUM, XDAI],
  //[XDAI, OPTIMISM],
  [XDAI, ARBITRUM]
]

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const logger = new Logger('TEST')

describe('bondWithdrawal', () => {
  const testPaths = [...L1ToL2Paths, ...L2ToL1Paths, ...L2ToL2Paths]
  for (let path of testPaths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} -> ${destNetwork}`
    it(
      label,
      async () => {
        logger.log(label)
        await prepareAccount(sourceNetwork, TOKEN)
        const user = new User(privateKey)
        const recipient = await user.getAddress()
        const { stop, watchers } = startWatchers({ networks: path })
        const sourceBalanceBefore = await user.getBalance(sourceNetwork, TOKEN)
        expect(sourceBalanceBefore).toBeGreaterThan(TRANSFER_AMOUNT)
        const destBalanceBefore = await user.getBalance(destNetwork, TOKEN)
        logger.log('source balance before:', sourceBalanceBefore)
        logger.log('dest balance before:', destBalanceBefore)
        logger.log('send and wait for receipt')
        const receipt = await user.sendAndWaitForReceipt(
          sourceNetwork,
          destNetwork,
          TOKEN,
          TRANSFER_AMOUNT
        )
        expect(receipt.status).toBe(1)
        logger.log('got receipt')
        if (isL1(sourceNetwork)) {
          logger.log('waiting')
          await wait(40 * 1000)
        } else {
          await waitForEvent(
            watchers,
            'bondWithdrawal',
            data => data.recipient === recipient
          )
        }
        const sourceBalanceAfter = await user.getBalance(sourceNetwork, TOKEN)
        const destBalanceAfter = await user.getBalance(destNetwork, TOKEN)
        expect(sourceBalanceAfter + TRANSFER_AMOUNT).toBe(sourceBalanceBefore)
        logger.log('source balance after:', sourceBalanceAfter)
        logger.log('dest balance after:', destBalanceAfter)
        expect(destBalanceAfter).toBeGreaterThan(destBalanceBefore)
        await stop()
      },
      300 * 1000
    )
  }
})

describe('bondTransferRoot', () => {
  //const testPaths = [...L2ToL1Paths, ...L2ToL2Paths]
  const testPaths = [[XDAI, KOVAN]]
  for (let path of testPaths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} -> ${destNetwork}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const recipient = await user.getAddress()
        const { stop, watchers } = startWatchers({ networks: path })
        logger.log('sending and waiting for receipt')
        const receipt = await user.sendAndWaitForReceipt(
          sourceNetwork,
          destNetwork,
          TOKEN,
          TRANSFER_AMOUNT
        )
        expect(receipt.status).toBe(1)
        logger.log('got receipt')
        logger.log('waiting for bondWithdrawal event')
        await waitForEvent(
          watchers,
          'bondWithdrawal',
          data => data.recipient === recipient
        )
        logger.log('waiting for event')
        await waitForEvent(watchers, 'bondTransferRoot', data => {
          return true
        })
        await stop()
        await wait(2 * 20000)
      },
      500 * 1000
    )
  }
})

describe.only('settleBondedWithdrawal', () => {
  //const testPaths = [...L2ToL1Paths, ...L2ToL2Paths]
  const testPaths = [[XDAI, KOVAN]]
  for (let path of testPaths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} -> ${destNetwork}`
    const txCount = 1
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const recipient = await user.getAddress()
        const { stop, watchers } = startWatchers({ networks: path })

        const promises: Promise<any>[] = []
        for (let i = 0; i < txCount; i++) {
          promises.push(
            new Promise(async resolve => {
              logger.log('sending and waiting for receipt')
              const receipt = await user.sendAndWaitForReceipt(
                sourceNetwork,
                destNetwork,
                TOKEN,
                TRANSFER_AMOUNT
              )
              expect(receipt.status).toBe(1)
              logger.log('got receipt')
              logger.log('waiting for bondWithdrawal event')
              let transferHash: string
              await waitForEvent(watchers, 'bondWithdrawal', data => {
                if (data.recipient === recipient) {
                  transferHash = data.transferHash
                  return true
                }
                return false
              })
              logger.log('waiting for bondTransferRoot event')
              await waitForEvent(watchers, 'bondTransferRoot', data => {
                return true
              })
              logger.log('waiting for event')
              await waitForEvent(watchers, 'settleBondedWithdrawal', data => {
                if (data.transferHash === transferHash) {
                  return true
                }
                return false
              })
              resolve(null)
            })
          )
        }

        await Promise.all(promises)

        await stop()
      },
      500 * 1000
    )
  }
})

describe('challenge', () => {
  const networks = [KOVAN]
  for (let network of networks) {
    const chainId = networkSlugToId(network)
    const label = `${network}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const bonder = new User(bonderPrivateKey)
        const { stop, watchers } = startWatchers({ networks: [KOVAN, XDAI] })
        logger.log('sending and waiting for receipt')
        const sourceNetwork = XDAI
        const destNetwork = KOVAN
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
        await stop()
      },
      500 * 1000
    )
  }
})

test.skip('updateChallengePeriod', async () => {
  await updateChallengePeriod()
})

async function prepareAccount (sourceNetwork: string, token: string) {
  const user = new User(privateKey)
  const balance = await user.getBalance(sourceNetwork, token)
  if (balance < 10) {
    // TODO: sent L1 token to L2 over bridge instead of mint (mint not always supported)
    const tx = await user.mint(sourceNetwork, token, 1000)
    await tx?.wait()
  }
  expect(balance).toBeGreaterThan(0)
  const spender = user.getBridgeAddress(sourceNetwork, token)
  await checkApproval(user, sourceNetwork, token, spender)
  // NOTE: xDai SPOA token is required for fees.
  // faucet: https://blockscout.com/poa/sokol/faucet
  if (sourceNetwork === XDAI) {
    const ethBalance = await user.getBalance(sourceNetwork)
    expect(ethBalance).toBeGreaterThan(0)
  }
}

async function updateChallengePeriod () {
  const gov = new User(governancePrivateKey)
  const tx = await gov.setChallengePeriodAndTimeSlotSize(300, 180)
  console.log(tx?.hash)
}
