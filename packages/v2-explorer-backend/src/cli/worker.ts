import wait from 'wait'
import { Worker } from '../worker'
import { actionHandler, parseBool, parseNumber, root } from './shared'
import { server } from '../server'

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
    '--server [boolean]',
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
  const { dry: dryMode, server: startServer, indexerPollSeconds } = source

  console.log('starting worker')
  console.log('dryMode:', !!dryMode)
  console.log('server:', !!startServer)
  console.log('indexerPollSeconds:', indexerPollSeconds || 'default')

  if (startServer) {
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
