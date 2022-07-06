import MerkleTree from '../src/utils/MerkleTree'
import { getSyncWatcher } from '../src/watchers/watchers'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

const transferRootHashes = [
  '0x97ec9bf23059c42142ab2fefc1e65328076e57d5f7c9221e9b2975f06d46b19e',
  '0x390bfa3f8b8f3d1fb974d3cebf55837934cb2a8d4fd6313892b4521a0bb01e4e',
  '0xcb8c474f41ea58b3450e6df8debd566e1fceda9b717fa17aa6ad5ed21d2fbceb',
  '0x5aeaf6187d937cdd463c775fe57d4042eb8479029e467054be1fa721ffde2015',
  '0xbb21b6e3864d5b267e9b140f030d153b32f869fe83cd46348e827fa7f8a42af2',
  '0xd2b1a7ca1a4f1c545126fe877603e0755e9e03956281720edb7c1b3459d6d5b5',
  '0xebe971088388ede4dca10b55ccfe85000218da83a211b9b1ec48a33c7a6a150d',
  '0xcd48a178d86767b616b8820c022b9f4eb053acb7c0d420a97388242f71be3ee2',
  '0x0035e8dd5e0bc7718e05d2bdacc971507d8683996c0fdc4bd0aa8e57758beae4',
  '0xcc5a01771dca373ab483ed6aec76c00f1b26b33558ff8259d5315ad7a5986fcf',
  '0x4dd043d3371d1297ca90012050e2db3a9a3878520786442845d1823e188a76d5',
  '0xcb5c205eef29c99bced0509a52a78e4bf3582ad161c3cbf9f90dd42d13ad395c',
  '0x64832892e02adcc6ab0650251b7bb0269976ccd20798c05b2d030e0708173220',
  '0xf63eeb8ef45179bda89849ddb361bc134cc26b32f29bbd7242ba5b5521dc3049',
  '0x177a56761a1badfec8e16fccb5a8b1d90c3eb2ff9aa4abdbaadea396caa95dcf',
  '0x97465c0645c1b7ed2b7f194d7eb830e6678fcff035cbed411087192442dc69b6',
  '0x9165e761d821b420ca1011f41226817bda2ba232062040d3b5e74df71cb28b3f',
  '0xbc216a8317c2fbc0066b251c675dcc355ec7b7fb7c4772ba843320eb70d9f87c',
  '0x275e2e579326cd79a86a54e6cc1797491f9f45fe576f1255b6666d3f2afc6bbc',
  '0x2020ce8a92caf3b7be42790d20e7088d96dfdb19ebc61a8e7e0282cec7040293',
  '0x79c7739ad31c681a8711f85795e7948e05a0c414b4cabd8f43a3053b67ebad64',
  '0xad720713fc7d62607556a93555096a9bb13ea10090f9e445d65dec2c7e2d2bd2',
  '0xd067cc762a79262f21c4b8789c5dd4290fc1021614e86167af6612eb21152537',
  '0xb3b499204821affb21397ebe0951d6d23019b0f3358838223aa59b9cb7310d8f',
  '0xad341836557a3bfdf9ffdd96a226e78d6ddd730f5fddfbdb7281d894308b4984',
  '0x7ccf0aebe41d97c3253cb4a5d3a3bf5c2c84355ca29ad751edc382c26f519ff5',
  '0x8d7618c0376f5d23a3f07c1abd8517de457ca741346fb0c942a1599dd8071ba8'
]

async function main () {
  const token = 'ETH'
  const configFilePath = '~/.hop-node/mainnet/config.json'
  const config = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)
  const watcher = await getSyncWatcher({ token, dryMode: true })

  for (const transferRootHash of transferRootHashes) {
    const dbItem = await watcher.db.transferRoots.getByTransferRootHash(transferRootHash)
    const { sourceChainId, destinationChainId, commitTxBlockNumber } = dbItem
    if (!(sourceChainId && destinationChainId && commitTxBlockNumber)) {
      throw new Error('expected values')
    }
    const sourceBridge = watcher.getSiblingWatcherByChainId(sourceChainId)
      .bridge
    const { transferIds } = await watcher.lookupTransferIds(sourceBridge, transferRootHash, destinationChainId, commitTxBlockNumber)

    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      throw new Error(`computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}`)
    }

    console.log(`${transferRootHash} OK`)
  }

  console.log('done checking all')
}

main().catch(console.error).finally(() => process.exit(0))
