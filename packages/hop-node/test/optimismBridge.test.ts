import { getConfirmRootsWatcher } from '../src/watchers/watchers'
import OptimismBridge from '../src/chains/optimism/OptimismBridge'
import getRpcProvider from '../src/utils/getRpcProvider'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from '../src/config'
import { Chain } from '../src/constants'
import { providers } from 'ethers'

// Run this with
// NETWORK=goerli npx ts-node test/OptimismBridge.test.ts
// NOTE: Use relative imports to avoid cannot find module errors. Also, move '../src/watchers/' to the top fo the file

async function main () {
  const chain = Chain.Optimism
  const token = 'ETH'
  const dryMode = true

  // Run with
  const configFilePath = '~/.hop/goerli.config.json'
  const config = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)

  const chainWatcher = await getConfirmRootsWatcher({ chain, token, dryMode })
  if (!chainWatcher) {
    throw new Error('watcher not found')
  }
  const l1Provider = getRpcProvider(Chain.Ethereum)!
  const l2Provider = getRpcProvider(chain)!

  const destinationChainSlug = Chain.Base

  // 210 blocks gives optimism enough time for the tx to get included on L1 and posted on the destination L2 (base only)
  const blockBuffer = 210
  const currentBlockNumber: number = await l2Provider.getBlockNumber()
  const blockToUse = await l2Provider.getBlockWithTransactions(currentBlockNumber - blockBuffer)
  const l2BlockNumber = blockToUse.number

  let l2TxHash: string | undefined
  for (const tx of blockToUse.transactions) {
    if (tx.data.substring(0,10) === '0x015d8eb9') continue
    l2TxHash = tx.hash
  }
  
  if (!l2TxHash) {
    throw new Error('bad block')
  }

  const opts = {
    chainWatcher,
    l1Provider,
    destinationChainSlug,
    l2TxHash,
    l2BlockNumber
  }

  // getHiddenCalldataForDestinationChain
  await testGetHiddenCalldataForDestinationChain(opts)
  // await testGetL1InclusionBlock(opts)
  // await testGetL2BlockByL1BlockNumber(opts)

  // const getHiddenCalldataForDestinationChainOpts = {
  //   chainWatcher,
  //   destinationChainSlug,
  //   l2TxHash,
  //   l2BlockNumber
  // }
  // await getHiddenCalldataForDestinationChain(getHiddenCalldataForDestinationChainOpts)

  // // getL1InclusionBlock
  // // TODO


}

async function testGetHiddenCalldataForDestinationChain(opts: any): Promise<void> {
  const { chainWatcher, destinationChainSlug, l2TxHash, l2BlockNumber } = opts

  const getHiddenCalldataForDestinationChainOpts = {
    chainWatcher,
    destinationChainSlug,
    l2TxHash,
    l2BlockNumber
  }

  await testGetHiddenCalldataForDestinationChainSuccess(getHiddenCalldataForDestinationChainOpts)
}

async function testGetL1InclusionBlock(opts: any): Promise<void> {
  // TODO
}

async function testGetL2BlockByL1BlockNumber(opts: any): Promise<void> {
  const { chainWatcher, l1Provider } = opts

  const l1BlockHead = await l1Provider.getBlockNumber()
  const getL2BlockByL1BlockNumberOpts = {
    chainWatcher,
    l1Provider,
    l1BlockHead
  }

  await testGetL2BlockByL1BlockNumberSuccess(getL2BlockByL1BlockNumberOpts)
  await testGetL2BlockByL1BlockNumberTooManyLoops(getL2BlockByL1BlockNumberOpts)
  await testGetL2BlockByL1BlockNumberTooEarly(getL2BlockByL1BlockNumberOpts)
}

async function testGetHiddenCalldataForDestinationChainSuccess(opts: any): Promise<void> {
  const { chainWatcher, destinationChainSlug, l2TxHash, l2BlockNumber } = opts
  const hiddenCalldata = await chainWatcher.getHiddenCalldataForDestinationChain(destinationChainSlug, l2TxHash, l2BlockNumber)
  if (hiddenCalldata === undefined) {
    throw new Error('shouldn\'t have failed')
  }
  console.log(hiddenCalldata)
}

async function testGetL2BlockByL1BlockNumberSuccess (opts: any): Promise<void> {
  const { chainWatcher, l1Provider, l1BlockHead } = opts
  const l1Block = await l1Provider.getBlock(l1BlockHead - 10)
  const l2BlockWithL1BlockData = await chainWatcher.getL2BlockByL1BlockNumber(l1Block)
  if (l2BlockWithL1BlockData === undefined) {
    throw new Error('shouldn\'t have failed')
  }
}

async function testGetL2BlockByL1BlockNumberTooManyLoops (opts: any): Promise<void> {
  const { chainWatcher, l1Provider, l1BlockHead } = opts
  const l1Block = await l1Provider.getBlock(l1BlockHead - 100)
  try {
    await chainWatcher.getL2BlockByL1BlockNumber(l1Block)
    throw new Error('should have failed')
  } catch {}
}

async function testGetL2BlockByL1BlockNumberTooEarly (opts: any): Promise<void> {
  const { chainWatcher, l1Provider, l1BlockHead } = opts
  const l1Block = await l1Provider.getBlock(l1BlockHead)
  const l2BlockWithL1BlockData = await chainWatcher.getL2BlockByL1BlockNumber(l1Block)
  if (l2BlockWithL1BlockData !== undefined) {
    throw new Error('should have failed')
  }
}

main().catch(console.error).finally(() => process.exit(0))
