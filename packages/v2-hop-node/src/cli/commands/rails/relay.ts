import { Rails } from '#clients/index.js'
import { Logger } from '#logger/index.js'
import { Argument, Command } from 'commander'
import { parseString } from '../../utils.js'

export const program = new Command()

const relayTypeArgument = new Argument('relay-type', 'Type of relay to perform')
  .choices(Object.values(Rails.RailsRelayType))
  .argParser(parseString)
  .argRequired()

program
  .name('relay')
  .description('Relay a Rails transaction')
  .action(run)
  .addArgument(relayTypeArgument)

async function run (relayType: Rails.RailsRelayType): Promise<void> {
  const logger = new Logger(program.name())

  const relayableItems = await Rails.getRelayableItems(relayType)
  if (relayableItems.length === 0) {
    logger.debug('No relayable items found')
    return
  }

  for (const relayableItem of relayableItems) {
    await Rails.relayItem(relayableItem)
  }
}
