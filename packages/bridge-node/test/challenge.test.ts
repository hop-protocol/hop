require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { networkSlugToId } from 'src/utils'
import { KOVAN, XDAI } from 'src/constants'
import { User, waitForEvent } from './helpers'
import { privateKey, bonderPrivateKey, governancePrivateKey } from './config'
import { keccak256 } from 'ethereumjs-util'
import Logger from 'src/logger'

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const logger = new Logger('TEST')

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

async function updateChallengePeriod () {
  const gov = new User(governancePrivateKey)
  const tx = await gov.setChallengePeriodAndTimeSlotSize(300, 180)
  console.log(tx?.hash)
}
