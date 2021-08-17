import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { User } from './helpers'
import { privateKey } from './config'
import { wait } from 'src/utils'
require('dotenv').config()

const TOKEN = 'USDC'
const AMOUNT = 10_000
const NETWORKS = [Chain.xDai]
const logger = new Logger('TEST')

describe('convert L1 token to L2 Hop token', () => {
  for (const L2_NETWORK of NETWORKS) {
    const label = `convert token to Hop bridge token on ${L2_NETWORK}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        logger.log(`minting ${Chain.Ethereum} ${TOKEN}`)
        let tx = await user.mint(Chain.Ethereum, TOKEN, AMOUNT)
        logger.log(`mint tx: ${tx.hash}`)
        await tx.wait()
        const l1Bridge = user.getHopBridgeContract(Chain.Ethereum, TOKEN)
        logger.log(`checking ${TOKEN} approval on ${L2_NETWORK}`)
        await user.checkApproval(Chain.Ethereum, TOKEN, l1Bridge.address)
        logger.log(
          `getting ${TOKEN} hop token balance balance on ${L2_NETWORK}`
        )
        const hopBalanceBefore = await user.getHopBalance(L2_NETWORK, TOKEN)
        logger.log(`hop ${TOKEN} balance: ${hopBalanceBefore}`)
        logger.log(`converting ${Chain.Ethereum} ${TOKEN} for hop`)
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
