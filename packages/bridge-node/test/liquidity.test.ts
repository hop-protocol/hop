require('dotenv').config()
import { User, checkApproval } from './helpers'
import { wait } from 'src/utils'
import { KOVAN, OPTIMISM, XDAI } from 'src/constants'
import { privateKey } from './config'

const TOKEN = 'DAI'
const TOKEN_0_AMOUNT = 1000
const testNetworks = [OPTIMISM, XDAI]
console.log(OPTIMISM, XDAI)

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

  if (l1Balance < amount) {
    console.log(`minting ${KOVAN} ${TOKEN}`)
    let tx = await user.mint(KOVAN, TOKEN, amount)
    console.log(`mint tx: ${tx.hash}`)
    await tx.wait()
  }

  if (hopBalance < amount) {
    console.log('converting canonical token to hop token')
    tx = await user.canonicalTokenToHopToken(l2Network, TOKEN, amount)
    console.log('tx sendToL2:', tx?.hash)
    await tx.wait()
    await wait(20 * 1000)
    hopBalance = await user.getHopBalance(l2Network, TOKEN)
    expect(hopBalance).toBeGreaterThanOrEqual(amount)
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
  const receipt = await tx.wait()
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

  expect(tokenBalanceAfter).toBeLessThan(tokenBalanceBefore)
  expect(hopTokenBalanceAfter).toBeLessThan(hopTokenBalanceBefore)
  expect(poolBalanceAfter).toBeGreaterThan(poolBalanceBefore)
}
