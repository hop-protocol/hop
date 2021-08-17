import '../moduleAlias'
import getBondedWithdrawal from 'src/theGraph/getBondedWithdrawal'
import { DateTime } from 'luxon'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { getDbSet } from 'src/db'

async function main () {
  const configFilePath = process.argv[2]
  const token = process.argv[3]
  console.log('config:', configFilePath)
  console.log('token:', token)
  const config: FileConfig = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)

  const db = getDbSet(token)
  const dbTransfers = await db.transfers.getTransfers()
  for (const dbTransfer of dbTransfers) {
    const { transferId, withdrawalBonded, sourceChainSlug, destinationChainSlug, amount, transferSentTxHash, deadline } = dbTransfer
    if (withdrawalBonded) {
      continue
    }
    const bondedWithdrawal = await getBondedWithdrawal(destinationChainSlug, token, transferId)
    if (!bondedWithdrawal) {
      const ts = DateTime.fromSeconds(deadline).toRelative()
      console.log(transferId, sourceChainSlug, destinationChainSlug, amount.toString(), transferSentTxHash, ts)
    }
  }
  console.log('done')
}

main()
