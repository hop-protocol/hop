import { Command } from 'commander'
import { parseString, parseStringArray } from './../../utils.js'

export const program = new Command()

type RelayOptions = {
  chain: string
  txHashes: string[]
}

program
  .name('relay')
  .description('Relay rails transaction')
  .requiredOption('-c, --chain <chain>', 'Source chain name', parseString)
  .requiredOption('-t, --tx-hashes <hash, ...>', 'Comma-separated tx hashes from the source chain', parseStringArray)
  .action(run)

async function run (): Promise<void> {
  const { chain, txHashes } = program.opts<RelayOptions>()
  // TODO: V2: Implement
}