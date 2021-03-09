require('dotenv').config()
import { User, checkApproval } from './helpers'
import { wait } from 'src/utils'
import { KOVAN, ARBITRUM, XDAI } from 'src/constants'

const privateKey = process.env.TEST_USER_PRIVATE_KEY
const TOKEN = 'DAI'
const TOKEN_0_AMOUNT = 5
const testNetworks = [ARBITRUM, XDAI]

for (let l2Network of testNetworks) {
  test(
    `add liquidity on ${l2Network}`,
    async () => {
      await addLiquidity(l2Network, TOKEN_0_AMOUNT)
    },
    300 * 1000
  )
}

async function addLiquidity (l2Network: string, amount: number) {
  const user = new User(privateKey)
  const l1Balance = await user.getBalance(KOVAN, TOKEN)
  console.log(`kovan ${TOKEN} balance: ${l1Balance}`)

  let tx: any
  const l1Bridge = user.getHopBridgeContract(KOVAN, TOKEN)
  await checkApproval(user, KOVAN, TOKEN, l1Bridge.address)

  let hopBalance = await user.getHopBalance(l2Network, TOKEN)
  console.log(`hop ${TOKEN} balance: ${hopBalance}`)

  if (hopBalance < amount) {
    tx = await user.canonicalTokenToHopToken(l2Network, TOKEN, amount)
    console.log('tx sendToL2:', tx?.hash)
    await tx?.wait()
    await wait(20 * 1000)
    hopBalance = await user.getHopBalance(l2Network, TOKEN)
    expect(hopBalance >= amount).toBe(true)
    console.log(`hop ${TOKEN} balance: ${hopBalance}`)
  }

  let [
    tokenBalanceBefore,
    hopTokenBalanceBefore,
    poolBalanceBefore
  ] = await Promise.all([
    user.getBalance(l2Network, TOKEN),
    user.getHopBalance(l2Network, TOKEN),
    user.getPoolBalance(l2Network, TOKEN)
  ])

  console.log('adding liquidity')
  tx = await user.addLiquidity(l2Network, TOKEN, amount)
  await tx.wait()
  const receipt = await user.getTransactionReceipt(l2Network, tx.hash)
  expect(receipt.status).toBe(1)

  let [
    tokenBalanceAfter,
    hopTokenBalanceAfter,
    poolBalanceAfter
  ] = await Promise.all([
    user.getBalance(l2Network, TOKEN),
    user.getHopBalance(l2Network, TOKEN),
    user.getPoolBalance(l2Network, TOKEN)
  ])

  expect(tokenBalanceAfter < tokenBalanceBefore).toBe(true)
  expect(hopTokenBalanceAfter < hopTokenBalanceBefore).toBe(true)
  expect(poolBalanceAfter > poolBalanceBefore).toBe(true)
}
