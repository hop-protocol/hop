import { ethers } from 'ethers'
import * as abis from '@hop-protocol/abi'
import * as addresses from '@hop-protocol/addresses'
import * as networks from '@hop-protocol/networks'

const network = 'goerli'
async function transferSentLogs (chain: string, token: string) {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    networks?.[network]?.[chain].rpcUrls[0]
  )
  const contract = new ethers.Contract(
    (addresses as any)?.[network].bridges?.[token]?.[chain]?.l2Bridge,
    abis.l2BridgeAbi,
    provider
  )
  const startBlockNumber = 13800051
  const endBlockNumber = 13800151

  const logs = await contract.queryFilter(
    contract.filters.TransferSent(),
    startBlockNumber,
    endBlockNumber
  )

  console.log(logs)
}

async function main () {
  const logs = await transferSentLogs('polygon', 'DAI')
  console.log(logs)
}

main()
