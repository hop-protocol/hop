import bridgeAbi from '@hop-protocol/core/abi/generated/Bridge.json'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTransferRootSet from 'src/theGraph/getTransferRootSet'
import { BigNumber, Contract } from 'ethers'
import { Chain } from 'src/constants'
import {
  actionHandler,
  parseString,
  root
} from './shared'
import { config as globalConfig } from 'src/config'

root
  .command('unwithdrawn-transfers')
  .description('Get all transfers that have not been withdrawn')
  .option('--chain <slug>', 'Destination chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .action(actionHandler(main))

export async function main (source: any) {
  const { chain: destinationChain, token } = source
  if (!destinationChain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  const addresses = globalConfig.addresses[token]
  if (!addresses) {
    throw new Error('addresses not found')
  }

  // Get contracts
  let bridgeAddress = ''
  if (destinationChain === Chain.Ethereum) {
    bridgeAddress = addresses[destinationChain].l1Bridge
  } else {
    bridgeAddress = addresses[destinationChain].l2Bridge
  }

  const setTransferRoots = await getTransferRootSet(destinationChain, token)
  const provider = getRpcProvider(destinationChain)!
  const contract = new Contract(bridgeAddress, bridgeAbi, provider)
  let amountUnwithdrawnTotal: BigNumber = BigNumber.from('0')
  for (const setTransferRoot of setTransferRoots) {
    const rootHash = setTransferRoot.rootHash
    const totalAmount = setTransferRoot.totalAmount
    const transferRoot = await contract.getTransferRoot(rootHash, totalAmount)
    const amountUnwithdrawn = transferRoot.total.sub(transferRoot.amountWithdrawn)
    amountUnwithdrawnTotal = amountUnwithdrawnTotal.add(amountUnwithdrawn)
  }

  return amountUnwithdrawnTotal
}
