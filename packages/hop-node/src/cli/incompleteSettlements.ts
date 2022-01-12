import getIncompleteSettlements from 'src/theGraph/getIncompleteSettlements'
import { Chain } from 'src/constants'
import { actionHandler, parseBool, parseString, root } from './shared'

const chains = [
  Chain.Ethereum,
  Chain.Arbitrum,
  Chain.Optimism,
  Chain.Gnosis,
  Chain.Polygon
]

root
  .command('incomplete-settlements')
  .description('Get incomplete settlements')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--destination-chain <slug>', 'Destination Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--all-chains [boolean]', 'Check all destination chains', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { config, token, allChains, sourceChain, destinationChain } = source
  if (!token) {
    throw new Error('token is required')
  }
  if (!sourceChain) {
    throw new Error('source chain is required')
  }
  if (!destinationChain && !allChains) {
    throw new Error('destination chain is required')
  }
  if (destinationChain && allChains) {
    throw new Error('only destinationChain or allChains can be defined')
  }

  const destinationChains = []
  if (allChains) {
    for (const chain of chains) {
      if (chain !== sourceChain) {
        destinationChains.push(chain)
      }
    }
  } else {
    destinationChains.push(destinationChain)
  }

  for (const chain of destinationChains) {
    console.log(`\n\n\nGetting incomplete settlements for token ${token}: source ${sourceChain} and destination ${chain}`)
    const transferRoot = await getIncompleteSettlements(
      token,
      sourceChain,
      chain
    )
    console.log(JSON.stringify(transferRoot, null, 2))
  }
}
