import { CCTP } from '#clients/index.js'
import { CCTPSDK } from '#clients/cctp/sdk/CCTPSDK.js'
import { Command } from 'commander'
import { Logger } from '#logger/index.js'

export const program = new Command()

program
  .name('unrelayed-cctp-messages')
  .description('Get unrelayed CCTP Messages')
  .action(run)

async function run () {
  const logger = new Logger(program.name())

  const unrelayedMessages = await CCTP.getUnrelayedMessages()
  for (const message of unrelayedMessages) {
    logger.debug(message, 'hash:', CCTPSDK.getMessageHashFromMessage(message.message))
  }
}
