import MerkleTree from 'src/utils/MerkleTree'
import getTransferId from 'src/theGraph/getTransfer'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

program
  .command('withdrawal-proof')
  .description('General withdrawal proof')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--token <string>', 'Token')
  .option('--transfer-id <string>', 'Transfer ID')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      if (!chain) {
        throw new Error('chain is required')
      }
      const token = source.token
      if (!token) {
        throw new Error('token is required')
      }
      const transferId = source.transferId
      if (!transferId) {
        throw new Error('transfer id is required')
      }

      const transfer = await getTransferId(
        chain,
        token,
        transferId
      )
      if (!transfer) {
        throw new Error('transfer not found')
      }

      const { transferRootHash } = transfer
      if (!transferRootHash) {
        throw new Error('no transfer root hash found for transfer Id. Has the transferId been committed (pendingTransferIdsForChainId)?')
      }

      const transferRoot = await getTransferRoot(
        chain,
        token,
        transferRootHash
      )

      if (!transferRoot) {
        throw new Error('no transfer root item found for transfer Id')
      }

      const rootTotalAmount = transferRoot.totalAmount.toString()
      const transferIds = transferRoot.transferIds?.map((x: any) => x.transferId)
      if (!transferIds?.length) {
        throw new Error('expected transfer ids for transfer root hash')
      }
      const tree = new MerkleTree(transferIds)
      const leaves = tree.getHexLeaves()
      const numLeaves = leaves.length
      const transferIndex = leaves.indexOf(transferId)
      const proof = tree.getHexProof(leaves[transferIndex])
      const output = {
        transferId,
        transferRootHash,
        leaves,
        proof,
        transferIndex,
        rootTotalAmount,
        numLeaves
      }

      console.log(JSON.stringify(output, null, 2))
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
