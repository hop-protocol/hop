
import '../src/moduleAlias'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import contracts from 'src/contracts'
import { OneDayMs } from 'src/constants'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

// Run this with
// npx ts-node test/getTransfersIdsWithTransferRootHash.test.ts
// NOTE: import moduleAlias first to avoid errors

// NOTE: These tests assume an updated DB and chain, token, transferId, and rootHash values.

async function main () {
  const token = 'ETH'
  const chain = 'optimism'
  const tokenContracts = contracts.get(token, chain)
  const bridgeContract = tokenContracts.l2Bridge
  const bridge = new L2Bridge(bridgeContract)

  const configFilePath = '~/.hop/mainnet/config.json'
  const config = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)

  await testBondWithdrawalWatcher(bridge, chain, token)
}

async function testBondWithdrawalWatcher (bridge: L2Bridge, chain: string, token: string): Promise<void> {
  const numDaysToTest = 10
  const fromUnix = Math.floor((Date.now() - OneDayMs * numDaysToTest) / 1000)
  const transferRoots = await bridge.db.transferRoots.getTransferRoots({
    fromUnix
  })

  for (const transferRoot of transferRoots) {
    const transferIds = await bridge.db.transfers.getTransfersIdsWithTransferRootHash({
      sourceChainId: transferRoot.sourceChainId!,
      destinationChainId: transferRoot.destinationChainId!,
      commitTxBlockNumber: transferRoot.commitTxBlockNumber!,
      commitTxLogIndex: transferRoot.commitTxLogIndex!
    })
    if (!transferIds?.length) {
      throw new Error(`no transfer ids found for transfer root hash ${transferRoot.transferRootHash}`)
    }
  }
}

main().catch(console.error).finally(() => process.exit(0))
