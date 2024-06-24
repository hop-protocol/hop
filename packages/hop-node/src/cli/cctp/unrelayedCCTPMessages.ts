import { getUnrelayedMessages } from './utils.js'
import { actionHandler, root } from '../shared/index.js'

root
  .command('unrelayed-cctp-messages')
  .description('Get unrelayed CCTP Messages')
  .action(actionHandler(main))

async function main () {
  const unrelayedMessages = await getUnrelayedMessages()
  for (const message of unrelayedMessages) {
    console.log(message)
  }
}
