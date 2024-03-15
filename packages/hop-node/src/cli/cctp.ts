import { Chain } from 'src/constants'
import { MessageManager } from 'src/cctp/cctp/MessageManager'
import { actionHandler, root } from './shared'
import { getEnabledNetworks } from 'src/config'

root
  .command('cctp')
  .description('Start the CCTP relayer')
  .action(actionHandler(main))

async function main (source: any) {
  const chains: string[] = getEnabledNetworks()

  try {
    // TODO: Better init
    // TODO: Better typing
    const run = new MessageManager(chains as Chain[])
  } catch (err: any) {
    throw new Error(`CCTP CLI error: ${err.message}`)
  }
}

