require('dotenv').config()
import { User } from './helpers'
import { wait } from 'src/utils'
import { bonderPrivateKey } from './config'
// @ts-ignore
import { KOVAN, OPTIMISM, XDAI } from 'src/constants'

const TOKEN = 'DAI'
const TOKEN_0_AMOUNT = 10000
const testNetworks = [OPTIMISM, XDAI]

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
  const user = new User(bonderPrivateKey)
  const l1Balance = await user.getBalance(KOVAN, TOKEN)
  console.log(`kovan ${TOKEN} balance: ${l1Balance}`)

  let tx: any
  const l1Bridge = user.getHopBridgeContract(KOVAN, TOKEN)
  await user.checkApproval(KOVAN, TOKEN, l1Bridge.address)

  let hopBalance = await user.getHopBalance(l2Network, TOKEN)
  console.log(`hop ${TOKEN} balance: ${hopBalance}`)

  if (l1Balance < amount) {
    console.log(`minting ${KOVAN} ${TOKEN}`)
    let tx = await user.mint(KOVAN, TOKEN, amount * 2)
    console.log(`mint tx: ${tx.hash}`)
    await tx.wait()
  }

  if (hopBalance < amount) {
    await user.checkApproval(KOVAN, TOKEN, l1Bridge.address)
    console.log('converting canonical token to hop token')
    // TODO: take fee into account
    tx = await user.canonicalTokenToHopToken(l2Network, TOKEN, amount)
    console.log('tx sendToL2:', tx?.hash)
    await tx.wait()
    await wait(200 * 1000)
    hopBalance = await user.getHopBalance(l2Network, TOKEN)
    expect(hopBalance).toBeGreaterThanOrEqual(amount)
    console.log(`hop ${TOKEN} balance: ${hopBalance}`)
  }

  const l2Balance = await user.getBalance(l2Network, TOKEN)
  console.log(`${l2Network} ${TOKEN} balance: ${l1Balance}`)

  if (l2Balance < amount) {
    const tokenBridge = user.getCanonicalBridgeContract(l2Network, TOKEN)
    await user.checkApproval(KOVAN, TOKEN, tokenBridge.address)
    console.log(`converting ${KOVAN} ${TOKEN} to ${l2Network} ${TOKEN}`)
    let tx = await user.convertToCanonicalToken(l2Network, TOKEN, amount / 2)
    console.log(`convert to canonical token tx: ${tx.hash}`)
    await tx.wait()
    await wait(200 * 1000)
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
