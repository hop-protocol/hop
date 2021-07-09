import { Chain } from 'src/constants'
import { User } from './helpers'
import { bonderPrivateKey } from './config'
import { wait } from 'src/utils'
require('dotenv').config()

const TOKEN = 'USDC'
const TOKEN_0_AMOUNT = 1000
const testNetworks = [Chain.xDai]

for (const l2Network of testNetworks) {
  test(
    `add liquidity on ${l2Network}`,
    async () => {
      await addLiquidity(l2Network, TOKEN_0_AMOUNT)
    },
    300 * 1000
  )
  test.skip(
    `remove liquidity on ${l2Network}`,
    async () => {
      const lpTokens = 1
      await removeLiquidity(l2Network, lpTokens)
    },
    300 * 1000
  )
}

async function addLiquidity (l2Network: string, amount: number) {
  const user = new User(bonderPrivateKey)
  const l1Balance = await user.getBalance(Chain.Ethereum, TOKEN)
  console.log(`L1 ${TOKEN} balance: ${l1Balance}`)

  let tx: any
  const l1Bridge = user.getHopBridgeContract(Chain.Ethereum, TOKEN)
  await user.checkApproval(Chain.Ethereum, TOKEN, l1Bridge.address)

  let hopBalance = await user.getHopBalance(l2Network, TOKEN)
  console.log(`hop ${TOKEN} balance: ${hopBalance}`)

  if (l1Balance < amount) {
    console.log(`minting ${Chain.Ethereum} ${TOKEN}`)
    const tx = await user.mint(Chain.Ethereum, TOKEN, amount * 2)
    console.log(`mint tx: ${tx.hash}`)
    await tx.wait()
  }

  if (hopBalance < amount) {
    await user.checkApproval(Chain.Ethereum, TOKEN, l1Bridge.address)
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
    await user.checkApproval(Chain.Ethereum, TOKEN, tokenBridge.address)
    console.log(
      `converting ${Chain.Ethereum} ${TOKEN} to ${l2Network} ${TOKEN}`
    )
    const tx = await user.convertToCanonicalToken(l2Network, TOKEN, amount / 2)
    console.log(`convert to canonical token tx: ${tx.hash}`)
    await tx.wait()
    await wait(200 * 1000)
  }

  const [
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
  console.log('tx: ', tx.hash)
  console.log('waiting for receipt')
  const receipt = await tx.wait()
  expect(receipt.status).toBe(1)

  const [
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

async function removeLiquidity (l2Network: string, amount: number) {
  const user = new User(bonderPrivateKey)

  // const lpToken = await user.getLpToken(l2Network, TOKEN)
  // const saddleSwap = user.getSaddleSwapContract(l2Network, TOKEN)
  // const tx = await user.approve(l2Network, lpToken, saddleSwap.address)
  // await tx.wait()

  const [
    tokenBalanceBefore,
    hopTokenBalanceBefore,
    poolBalanceBefore
  ] = await Promise.all([
    user.getBalance(l2Network, TOKEN),
    user.getHopBalance(l2Network, TOKEN),
    user.getPoolBalance(l2Network, TOKEN)
  ])

  console.log('removing liquidity')
  const tx = await user.removeLiquidity(l2Network, TOKEN, amount)
  console.log('tx: ', tx.hash)
  console.log('waiting for receipt')
  const receipt = await tx.wait()
  expect(receipt.status).toBe(1)

  const [
    tokenBalanceAfter,
    hopTokenBalanceAfter,
    poolBalanceAfter
  ] = await Promise.all([
    user.getBalance(l2Network, TOKEN),
    user.getHopBalance(l2Network, TOKEN),
    user.getPoolBalance(l2Network, TOKEN)
  ])

  expect(tokenBalanceAfter).toBeGreaterThan(tokenBalanceBefore)
  expect(hopTokenBalanceAfter).toBeGreaterThan(hopTokenBalanceBefore)
  expect(poolBalanceAfter).toBeLessThanOrEqual(poolBalanceBefore)
}
