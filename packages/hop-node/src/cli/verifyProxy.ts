import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'
import { BigNumber } from 'ethers'
import { actionHandler, parseBool, parseNumber, parseString, root } from './shared'
import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'
import {
  getProxyAddressForChain

} from 'src/config'
import { parseEther } from 'ethers/lib/utils'

import wait from 'src/utils/wait'
import { Chain, nativeChainTokens } from 'src/constants'
import { main as claimFromProxy } from './claimFromProxy'
import { main as stake } from './stake'
import { main as unstake } from './unstake'

interface GetClaimBalanceParams {
  bridge: L2Bridge | L1Bridge
  proxyAddress: string
  chain: string
  token: string
}

root
  .command('verify-proxy')
  .description('Verify working proxy')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--amount <number>', 'Amount (in human readable format)', parseNumber)
  .option('--bypass-proxy [boolean]', 'Bypass the proxy and perform EOA bonder verification', parseBool)
  .action(actionHandler(main))

async function main (source: any) {

  // NOTE: In order to run this, you must export the main function
  // in stake, unstake, and claimFromProxy

  let { chain, token, amount, bypassProxy } = source

  if (!amount) {
    throw new Error('amount is required. E.g. 100')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!chain) {
    throw new Error('chain is required')
  }

  if (!bypassProxy) {
    bypassProxy = false
  }

  // Arbitrary watcher since only the bridge is needed
  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode: false })
  if (!watcher) {
    throw new Error('Watcher not found')
  }

  const bridge: L2Bridge | L1Bridge = watcher.bridge
  const amountWei = parseEther(amount.toString())

  // Stake
  let unitsBefore = await bridge.getCredit()
  await stake({ chain, token, amount })
  await wait(1000)
  let unitsAfter = await bridge.getCredit()
  let unitsDiff = unitsAfter.sub(unitsBefore)

  if (!unitsDiff.eq(amountWei)) {
    throw new Error(`Stake failed: unitsDiff: ${unitsDiff.toString()}, amountWei: ${amountWei.toString()}`)
  }
  console.log('staked')

  // Unstake
  unitsBefore = await bridge.getDebit()
  await unstake({ chain, token, amount })
  await wait(1000)
  unitsAfter = await bridge.getDebit()
  unitsDiff = unitsAfter.sub(unitsBefore)
  if (!unitsDiff.eq(amountWei)) {
    throw new Error(`Unstake failed: creditDiff: ${unitsDiff.toString()}, amountWei: ${amountWei.toString()}`)
  }
  console.log('unstaked')

  // Claim funds
  const proxyAddress = getProxyAddressForChain(token, chain)
  const isL2 = chain !== Chain.Ethereum
  const getClaimBalanceParams = {
    bridge,
    proxyAddress,
    chain,
    token
  }

  unitsBefore = await getClaimBalance(getClaimBalanceParams)
  await claimFromProxy({ chain, token, amount, htoken: isL2 })
  await wait(1000)
  unitsAfter = await getClaimBalance(getClaimBalanceParams)
  unitsDiff = unitsBefore.sub(unitsAfter)
  if (!unitsDiff.eq(amountWei)) {
    throw new Error(`Claim failed: creditDiff: ${unitsDiff.toString()}, amountWei: ${amountWei.toString()}`)
  }
  console.log('claimed')

}

async function getClaimBalance (params: GetClaimBalanceParams): Promise<BigNumber> {
  const { bridge, proxyAddress, chain, token } = params
  const isNativeSendOnL1 = nativeChainTokens[chain] === token && chain === Chain.Ethereum
  if (isNativeSendOnL1) {
    return bridge.provider.getBalance(proxyAddress)
  }

  // For this command, we only deal with hTokens on l2
  const isHToken = true
  const tokenInstance = getTokenInstance(token, chain, isHToken)
  return tokenInstance.tokenContract.balanceOf(proxyAddress)
}

function getTokenInstance (token: string, chain: string, isHToken: boolean): Token {
  const tokenContracts = contracts.get(token, chain)
  if (!tokenContracts) {
    throw new Error('token contracts not found')
  }

  if (chain === Chain.Ethereum) {
    return new Token(tokenContracts.l1CanonicalToken)
  } else {
    if (isHToken) {
      return new Token(tokenContracts.l2HopBridgeToken)
    } else {
      return new Token(tokenContracts.l2CanonicalToken)
    }
  }
}
