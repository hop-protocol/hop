import { Rails } from '#clients/index.js'
import { Logger } from '#logger/index.js'
import { Argument, Command } from 'commander'
import { parseString } from '../../utils.js'

export const program = new Command()

const relayMethodNameArgument = new Argument('method-name', 'Method name of the relay tx')
  .choices(Object.values(Rails.RailsCLI.RailsMethodName))
  .argParser(parseString)
  .argRequired()

program
  .name('relay')
  .description('Relay a Rails transaction')
  .action(run)
  .addArgument(relayMethodNameArgument)

async function run (relayMethodName: any): Promise<void> {
  const logger = new Logger(program.name())

  if (!Object.values(Rails.RailsCLI.RailsMethodName).includes(relayMethodName)) {
    throw new Error(`Invalid method name: ${relayMethodName}. Did you mean one of the following: ${Object.values(Rails.RailsCLI.RailsMethodName).join(', ')}?`)
  }

  const relayableItems = await Rails.RailsCLI.getRelayableItems(relayMethodName)
  if (relayableItems.length === 0) {
    logger.debug('No relayable items found')
    return
  }

  logger.info(`Found ${relayableItems.length} relayable items`)
  for (const relayableItem of relayableItems) {
    await Rails.RailsCLI.relayItem(relayableItem)
  }
}
