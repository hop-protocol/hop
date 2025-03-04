import { Rails } from '#clients/index.js'
import { Logger } from '#logger/index.js'
import { Command } from 'commander'

export const program = new Command()

program
  .name('push')
  .description('Push Rails Claims')
  .action(run)

async function run (): Promise<void> {
  const logger = new Logger(program.name())

  const relayType = Rails.RailsRelayType.Bond // This should be CLI passed in

  const relayableItems = await Rails.getRelayableItems(relayType)
  if (relayableItems.length === 0) {
    logger.debug('No relayable items found')
    return
  }

  for (const relayableItem of relayableItems) {
    await Rails.relayItem(relayableItem)
  }
}
