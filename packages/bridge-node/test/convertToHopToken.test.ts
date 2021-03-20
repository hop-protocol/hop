require('dotenv').config()
import { User, checkApproval } from './helpers'
import { wait } from 'src/utils'
import { KOVAN, OPTIMISM, XDAI } from 'src/constants'
import Logger from 'src/logger'
import { privateKey } from './config'

const TOKEN = 'sBTC'
const AMOUNT = 10000
const NETWORKS = [OPTIMISM, XDAI]
const logger = new Logger('TEST')
console.log(XDAI, OPTIMISM)

describe('convert L1 token to L2 Hop token', () => {
  for (let L2_NETWORK of NETWORKS) {
    const label = `convert token to Hop bridge token on ${L2_NETWORK}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        logger.log(`minting ${KOVAN} ${TOKEN}`)
        let tx = await user.mint(KOVAN, TOKEN, AMOUNT)
        logger.log(`mint tx: ${tx.hash}`)
        await tx.wait()
        const l1Bridge = user.getHopBridgeContract(KOVAN, TOKEN)
        logger.log(`checking ${TOKEN} approval on ${L2_NETWORK}`)
        await checkApproval(user, KOVAN, TOKEN, l1Bridge.address)
        logger.log(
          `getting ${TOKEN} hop token balance balance on ${L2_NETWORK}`
        )
        const hopBalanceBefore = await user.getHopBalance(L2_NETWORK, TOKEN)
        logger.log(`hop ${TOKEN} balance: ${hopBalanceBefore}`)
        logger.log(`converting ${KOVAN} ${TOKEN} for hop`)
        tx = await user.canonicalTokenToHopToken(L2_NETWORK, TOKEN, AMOUNT)
        logger.log('tx sendToL2:', tx?.hash)
        await tx?.wait()
        logger.log(`waiting 120s for ${L2_NETWORK} to process tx`)
        await wait(120 * 1000)
        const hopBalanceAfter = await user.getHopBalance(L2_NETWORK, TOKEN)
        logger.log(`hop ${TOKEN} balance: ${hopBalanceAfter}`)
        expect(hopBalanceAfter).toBeGreaterThan(hopBalanceBefore)
      },
      300 * 1000
    )
  }
})
