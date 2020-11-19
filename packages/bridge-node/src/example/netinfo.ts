import '../moduleAlias'
import { L2Provider } from 'src/wallets/L2Wallet'

async function main() {
  const L2BlockNumber = await L2Provider.getBlockNumber()
  console.log('L2 head block number', L2BlockNumber)

  const netid = await L2Provider.getNetwork()
  console.log('L2 network id', netid)
}

main()
