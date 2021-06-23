import '../moduleAlias'
import db from 'src/db'
import { db as dbConfig } from 'src/config'

async function main () {
  dbConfig.path = '/home/mota/.hop-node/db.mainnet'
  //const transferId = '0x26abd4677a846eca08146817aab52257468b2d9e4eaf433ea026468a61d23d39'
  const transferId =
    '0x70df5672dd33b81816aa92b2a230264ef7a896ab1c756cff8a54e765890abe52'

  const transfer = await db.transfers.getByTransferId(transferId)
  console.log(transfer)

  // const transferRootId = '0x0872531a7399727808632c595186055d53ef1f1eca96709ed15eb66a83ebcf7a'
  const transferRootId =
    '0x4f500fc924870e218b7fb047a979abbf5961b2a856268e2ee0176f5ccd1c327b'

  const transferRoot = await db.transferRoots.getByTransferRootId(
    transferRootId
  )
  console.log(transferRoot)
}

main()
