import IncompleteSettlementsWatcher from 'src/watchers/IncompleteSettlementsWatcher'
import { actionHandler, parseString, root } from './shared'

root
  .command('incomplete-settlements')
  .description('Get incomplete settlements')
  .option('--token <symbol>', 'Token', parseString)
  .option('--days <number>', 'Number of days to search', parseString)
  .option('--format <string>', 'Output format. Options are "table,csv,json"', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { config, token, days, format } = source
  const watcher = new IncompleteSettlementsWatcher({
    token,
    days,
    format
  })
  await watcher.start()
  console.log('done')
}
