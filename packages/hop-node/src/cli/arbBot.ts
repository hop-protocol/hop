import { actionHandler, parseBool, parseString, root } from './shared'
import { startArbBots } from 'src/arbBot'

root
  .command('arb-bot')
  .description('Start the relayer watcher')
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .option(
    '--arb-bot-conf <path>',
    'Arb bot(s) config JSON file',
    parseString
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { dry: dryMode, arbBotConf: arbBotConfig } = source

  try {
    await startArbBots({ dryMode, configFilePath: arbBotConfig })
  } catch (err: any) {
    throw new Error(`arb bot cli error: ${err.message}`)
  }
}
