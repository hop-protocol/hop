import { CCTP } from '#clients/index.js'
import { actionHandler, root } from '../shared/index.js'
import { CCTPSDK } from '#clients/cctp/sdk/CCTPSDK.js'

root
  .command('unrelayed-cctp-messages')
  .description('Get unrelayed CCTP Messages')
  .action(actionHandler(main))

async function main () {
  const unrelayedMessages = await CCTP.getUnrelayedMessages()
  for (const message of unrelayedMessages) {
    console.log(message, 'hash:', CCTPSDK.getMessageHashFromMessage(message.message))
  }
}
