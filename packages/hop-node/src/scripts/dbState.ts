import '../moduleAlias'
import db from 'src/db'
import { db as dbConfig } from 'src/config'

async function main () {
  dbConfig.path = '/home/mota/.hop-node/db.mainnet'
  const transferId =
    '0xa569abdba20965a2398bcb2a995fa7ed8f44375321860386a7a8f2892a9f3cdb'

  const transfer = await db.transfers.getByTransferId(transferId)
  console.log(transfer)

  const transferRootId =
    '0xa569abdba20965a2398bcb2a995fa7ed8f44375321860386a7a8f2892a9f3cdb'

  const transferRoot = await db.transferRoots.getByTransferRootHash(
    transferRootId
  )
  console.log(transferRoot)

  const dbTransfers = await db.transfers.getUnsettledBondedWithdrawalTransfers()
  //console.log(dbTransfers)
}

main()
