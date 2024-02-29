import { actionHandler, parseBool, root } from './shared/index.js'

import {
  startChallengeWatchers
} from '#watchers/watchers.js'

root
  .command('challenger')
  .description('Start the challenger watcher')
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { dry: dryMode } = source
  startChallengeWatchers({
    dryMode
  })
}
