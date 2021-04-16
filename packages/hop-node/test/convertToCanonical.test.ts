require('dotenv').config()
import { User } from './helpers'
import { wait } from 'src/utils'
import Logger from 'src/logger'
import { privateKey } from './config'
// @ts-ignore
import { ETHEREUM, OPTIMISM, XDAI } from 'src/constants'

const TOKEN = 'USDC'
const AMOUNT = 1_000
const NETWORKS = [XDAI]
const logger = new Logger('TEST')

describe('convert L1 token to L2 canonical token', () => {
  for (let L2_NETWORK of NETWORKS) {
    const label = `convert token to canonical token on ${L2_NETWORK}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        logger.log(`minting ${ETHEREUM} ${TOKEN}`)
        let tx = await user.mint(ETHEREUM, TOKEN, AMOUNT)
        logger.log(`mint tx: ${tx.hash}`)
        await tx.wait()
        const l1CanonicalBridge = user.getCanonicalBridgeContract(
          L2_NETWORK,
          TOKEN
        )
        logger.log(`checking ${TOKEN} approval on ${L2_NETWORK}`)
        await user.checkApproval(ETHEREUM, TOKEN, l1CanonicalBridge.address)
        const tokenBalanceBefore = await user.getBalance(L2_NETWORK, TOKEN)
        logger.log(`token ${TOKEN} balance: ${tokenBalanceBefore}`)
        logger.log(`converting ${ETHEREUM} ${TOKEN} to canonical token`)
        tx = await user.convertToCanonicalToken(L2_NETWORK, TOKEN, AMOUNT)
        logger.log('tx deposit:', tx?.hash)
        await tx?.wait()
        logger.log(`waiting 120s for ${L2_NETWORK} to process tx`)
        await wait(120 * 1000)
        const tokenBalanceAfter = await user.getBalance(L2_NETWORK, TOKEN)
        logger.log(`hop ${TOKEN} balance: ${tokenBalanceAfter}`)
        expect(tokenBalanceAfter).toBeGreaterThan(tokenBalanceBefore)
      },
      300 * 1000
    )
  }
})
