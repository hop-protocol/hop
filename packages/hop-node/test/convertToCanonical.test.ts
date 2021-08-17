import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { User } from './helpers'
import { faucetPrivateKey as privateKey } from './config'
import { wait } from 'src/utils'

const TOKEN = 'USDC'
const AMOUNT = 10_000
const NETWORKS = [Chain.Optimism]
const logger = new Logger('TEST')

describe('convert L1 token to L2 canonical token', () => {
  for (const L2_NETWORK of NETWORKS) {
    const label = `convert token to canonical token on ${L2_NETWORK}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        logger.log(`minting ${Chain.Ethereum} ${TOKEN}`)
        let tx = await user.mint(Chain.Ethereum, TOKEN, AMOUNT)
        logger.log(`mint tx: ${tx.hash}`)
        await tx.wait()
        const l1CanonicalBridge = user.getCanonicalBridgeContract(
          L2_NETWORK,
          TOKEN
        )
        logger.log(`checking ${TOKEN} approval on ${L2_NETWORK}`)
        await user.checkApproval(
          Chain.Ethereum,
          TOKEN,
          l1CanonicalBridge.address
        )
        const tokenBalanceBefore = await user.getBalance(L2_NETWORK, TOKEN)
        logger.log(`token ${TOKEN} balance: ${tokenBalanceBefore}`)
        logger.log(`converting ${Chain.Ethereum} ${TOKEN} to canonical token`)
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

describe.skip('polygon', () => {
  it(
    'polygon canonical L1 → L2',
    async () => {
      const user = new User(privateKey)
      const amount = 0.1
      const tx = await user.polygonCanonicalL1ToL2(amount, true)
      console.log('tx hash:', tx.hash)
      expect(tx.hash).toBeTruthy()
      const receipt = await tx.wait()
      expect(receipt.status).toBe(1)
    },
    60 * 1000
  )

  it(
    'polygon canonical L2 → L1',
    async () => {
      const user = new User(privateKey)
      const amount = 0.01
      let tx: any
      tx = await user.polygonCanonicalL2ToL1(amount)
      console.log('tx hash:', tx.hash)
      expect(tx.hash).toBeTruthy()
      let receipt = await tx.wait()
      expect(receipt.status).toBe(1)
      await wait(30 * 60 * 1000)
      const txHash =
        '0x00bbc7c27cdd5de267c785d3ae6e6e7d809ed04b3020854aa95179a3a0010ad4'
      tx = await user.polygonCanonicalL2ToL1Exit(txHash)
      console.log('exit tx hash:', tx.hash)
      receipt = await tx.wait()
      expect(receipt.status).toBe(1)
      expect(tx.hash).toBeTruthy()
    },
    60 * 60 * 1000
  )
})
