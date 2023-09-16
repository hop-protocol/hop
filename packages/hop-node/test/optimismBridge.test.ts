import '../src/moduleAlias'
import getChainBridge from 'src/chains/getChainBridge'
import getRpcProvider from 'src/utils/getRpcProvider'
import { Chain } from 'src/constants'
import { getConfirmRootsWatcher } from 'src/watchers/watchers'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { providers } from 'ethers'

// Run this with
// NETWORK=goerli npx ts-node test/OptimismBridge.test.ts
// NOTE: import moduleAlias first to avoid errors

async function main () {
  const chain = Chain.Optimism
  const destinationChainSlug = Chain.Base
  const token = 'ETH'
  const dryMode = true

  // Run with
  // const configFilePath = '~/.hop/eth.config.json'
  const configFilePath = '~/.hop/goerli.config.json'
  const config = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)

  const chainWatcher = await getConfirmRootsWatcher({ chain, token, dryMode })
  if (!chainWatcher) {
    throw new Error('watcher not found')
  }

  const l1Provider = getRpcProvider(Chain.Ethereum)!
  const l2Provider = getRpcProvider(chain)!
  const chainBridge = getChainBridge(chain)

  const { l2TxHash, l2BlockNumber } = await _getL2TxHashToTest(l2Provider)
  const opts = {
    chainWatcher,
    chainBridge,
    l1Provider,
    destinationChainSlug,
    l2TxHash,
    l2BlockNumber
  }

  // await testGetHiddenCalldataForDestinationChain(opts)
  await testGetL1InclusionTx(opts)
  await testGetL2InclusionTx(opts)
}

async function testGetHiddenCalldataForDestinationChain (opts: any): Promise<void> {
  const { chainWatcher, destinationChainSlug, l2TxHash, l2BlockNumber } = opts
  const hiddenCalldata = await chainWatcher.getHiddenCalldataForDestinationChain(destinationChainSlug, l2TxHash, l2BlockNumber)
  if (hiddenCalldata === undefined) {
    throw new Error('shouldn\'t have failed')
  }
  console.log(hiddenCalldata)
}

async function testGetL1InclusionTx (opts: any): Promise<void> {
  const { chainBridge, l2TxHash } = opts
  const inclusionTx = await chainBridge.getL1InclusionTx!(l2TxHash)
  if (!inclusionTx.transactionHash) {
    throw new Error('testGetL1InclusionTx failed')
  }
}

async function testGetL2InclusionTx (opts: any): Promise<void> {
  const { chainBridge, l1Provider } = opts
  const l1Block = await l1Provider.getBlock('safe')
  const inclusionTx = await chainBridge.getL2InclusionTx!(l1Block.transactions[0])
  if (!inclusionTx.transactionHash) {
    throw new Error('testGetL2InclusionTx failed')
  }
}

async function _getL2TxHashToTest (l2Provider: providers.Provider): Promise<any> {
  // System txs on Optimism are not included in checkpoints, so we must get a tx that is not a system tx

  // 210 blocks gives optimism enough time for the tx to get included on L1 and posted on the destination L2 (base only)
  // More than ~300 will result in a blockHash that is no longer stored
  const blockBuffer = 250
  const currentBlockNumber: number = await l2Provider.getBlockNumber()

  // If a block only has system txs, skip it since they are not checkpointed
  let blockNumberToUse = currentBlockNumber - blockBuffer
  for (let i = 0; i < 10; i++) {
    const blockToUse = await l2Provider.getBlockWithTransactions(blockNumberToUse)

    for (const tx of blockToUse.transactions) {
      if (tx.data.substring(0, 10) === '0x015d8eb9') continue
      return {
        l2TxHash: tx.hash,
        l2BlockNumber: tx.blockNumber
      }
    }
    blockNumberToUse--
  }

  throw new Error('no tx found')
}

main().catch(console.error).finally(() => process.exit(0))
