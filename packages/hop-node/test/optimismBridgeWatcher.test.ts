import { getConfirmRootsWatcher } from '../src/watchers/watchers'
import OptimismBridgeWatcher from '../src/watchers/OptimismBridgeWatcher'
import getRpcProvider from '../src/utils/getRpcProvider'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from '../src/config'
import { Chain } from '../src/constants'

// Run this with
// npx ts-node test/optimismBridgeWatcher.test.ts
// NOTE: Use relative imports to avoid cannot find module errors

async function main () {
  const chain = Chain.Optimism
  const token = 'ETH'
  const dryMode = true

  const configFilePath = '~/.hop/mainnet/config.json'
  const config = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)

  const watcher = await getConfirmRootsWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }
  const chainWatcher: OptimismBridgeWatcher = watcher.watchers[chain]
  const l1Provider = getRpcProvider(Chain.Ethereum)!
  const l1BlockHead = await l1Provider.getBlockNumber()

  const opts = {
    chainWatcher,
    l1Provider,
    l1BlockHead
  }
  await testGetL2BlockByL1Block(opts)
  await testGetL2BlockByL1BlockTooManyLoops(opts)
  await testGetL2BlockByL1BlockTooEarly(opts)
}

async function testGetL2BlockByL1Block(opts: any): Promise<void> {
  const { chainWatcher, l1Provider, l1BlockHead } = opts
  const l1Block = await l1Provider.getBlock(l1BlockHead - 10)
  const l2BlockWithL1BlockData = await chainWatcher.getL2BlockByL1Block(l1Block)
  if (l2BlockWithL1BlockData === undefined) {
    throw new Error('shouldn\'t have failed')
  }
}

async function testGetL2BlockByL1BlockTooManyLoops(opts: any): Promise<void> {
  const { chainWatcher, l1Provider, l1BlockHead } = opts
  const l1Block = await l1Provider.getBlock(l1BlockHead - 100)
  try {
    await chainWatcher.getL2BlockByL1Block(l1Block)
    throw new Error('should have failed')
  } catch {}
}

async function testGetL2BlockByL1BlockTooEarly(opts: any): Promise<void> {
  const { chainWatcher, l1Provider, l1BlockHead } = opts
  const l1Block = await l1Provider.getBlock(l1BlockHead)
  const l2BlockWithL1BlockData = await chainWatcher.getL2BlockByL1Block(l1Block)
  if (l2BlockWithL1BlockData !== undefined) {
    throw new Error('should have failed')
  }
}

main().catch(console.error).finally(() => process.exit(0))
