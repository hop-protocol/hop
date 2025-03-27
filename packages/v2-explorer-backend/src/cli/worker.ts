import { Worker } from '#worker/index.js'
import { actionHandler, parseBool, parseNumber, root } from './shared/index.js'
import { server } from '#server/index.js'
import { wait } from '#utils/wait.js'
import { skipChainIds } from '#config/index.js'

export const workerProgram = root
  .command('worker')
  .description('Start the worker')
  .option('--skip-main [boolean]', 'Skip running main function (for testing).', parseBool)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .option(
    '--api-server [boolean]',
    'Start the api server',
    parseBool
  )
  .option(
    '--indexer-poll-seconds <number>',
    'The number of seconds to wait between indexer polls',
    parseNumber
  )
  .option(
    '--sync-from <number>',
    'Unix timestamp to start syncing from',
    parseNumber
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { dry: dryMode, apiServer, indexerPollSeconds, syncFrom } = source

  console.log('starting worker')
  console.log('dryMode:', !!dryMode)
  console.log('apiServer:', !!apiServer)
  console.log('indexerPollSeconds:', indexerPollSeconds || 'default')
  if (syncFrom) {
    const date = new Date(syncFrom * 1000)
    console.log('syncFrom:', syncFrom, '(' + date.toLocaleString() + ')')
  } else {
    console.log('syncFrom: default')
  }

  if (apiServer) {
    server()
  }

  const worker = new Worker({
    indexerPollSeconds,
    skipChainIds,
    syncFromTimestamp: syncFrom
  })

  await worker.start()
  while (true) {
    await wait(1000)
  }
}
