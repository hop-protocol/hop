import '../moduleAlias'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'

async function main () {
  const L2BlockNumber = await L2ArbitrumProvider.getBlockNumber()
  console.log('L2 Arbitrum head block number', L2BlockNumber)

  const netid = await L2ArbitrumProvider.getNetwork()
  console.log('L2 Arbitrum network id', netid)
}

main()
