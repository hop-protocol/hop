import { Worker } from '#worker/index.js'
import { actionHandler, parseBool, parseNumber, root } from './shared/index.js'
import { server } from '#server/index.js'
import { wait } from '#utils/wait.js'

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
  .action(actionHandler(main))

async function main (source: any) {
  const { dry: dryMode, apiServer, indexerPollSeconds } = source

  console.log('starting worker')
  console.log('dryMode:', !!dryMode)
  console.log('apiServer:', !!apiServer)
  console.log('indexerPollSeconds:', indexerPollSeconds || 'default')

  if (apiServer) {
    server()
  }

  const worker = new Worker({
    indexerPollSeconds
  })

  await worker.start()
  while (true) {
    await wait(1000)
  }
}
