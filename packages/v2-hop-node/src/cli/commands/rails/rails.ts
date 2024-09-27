import { Rails } from '#clients/index.js'
import { RailsConfig } from '#config/index.js'
import { wait } from '#utils/wait.js'
import { Logger } from '#logger/index.js'
import { Command } from 'commander'
import { RAILS_ART } from './../../constants.js'

export const program = new Command()

program
  .name('rails')
  .description('Run Rails commands')
  .action(run)

async function run (): Promise<never> {
  const logger = new Logger(program.name())
  logger.log(RAILS_ART)

  try {
    const clients = Object.values(Rails.RailsClientName)
    const railsManager = new Rails.Rails(clients, RailsConfig.paths)
    await railsManager.start()
    // TODO: V2: Add logger
    logger.debug('Rails Manager started')

    // TODO: V2: Better way to run
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      await wait (60_000)
    }
  } catch (err: any) {
    logger.error(err)
    throw new Error(`Rails CLI error: ${err.message}`)
  }
}
