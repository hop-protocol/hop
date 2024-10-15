import { program as relayProgram } from './relay.js'
import { program as showDBProgram } from '../shared/showDB.js'
import { Rails } from '#clients/index.js'
import { ClientConfig } from '#config/index.js'
import { wait } from '#utils/wait.js'
import { Logger } from '#logger/index.js'
import { Command } from 'commander'
import { RAILS_ART } from './../../constants.js'
import { getHelpTextBefore } from './../../utils.js'

export const program = new Command()

program
  .name('rails')
  .description('Run Rails commands')
  .addHelpText('before', getHelpTextBefore(RAILS_ART))
  .addCommand(relayProgram)
  .addCommand(showDBProgram)
  .action(run)

async function run (): Promise<never> {
  const logger = new Logger(program.name())

  try {
    const clients = Object.values(Rails.RailsClientName)
    const railsManager = new Rails.Rails(clients, ClientConfig.RailsConfig.paths)
    await railsManager.start()
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
