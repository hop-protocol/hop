import { ArbBot } from 'src/arbBot'
import { actionHandler, parseBool, root } from './shared'

root
  .command('arb-bot')
  .description('Start the relayer watcher')
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { dry: dryMode } = source

  const arbBot = new ArbBot({
    dryMode
  })
  try {
    await arbBot.start()
  } catch (err: any) {
    throw new Error(`arb bot cli error: ${err.message}`)
  }
}
