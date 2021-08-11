import LoadTest from 'src/loadTest'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

program
  .command('load-test')
  .description('Start load test')
  .option('--concurrent-users <number>', 'Number of concurrent users')
  .option('--iterations <number>', 'Number of iterations')
  .option('--amount <number>', 'Amount to send (in human readable format)')
  .option(
    '--paths <string>',
    'Transfer paths in form of "source:destination", separted by commas (e.g. "xdai:polygon,polygon:xdai,xdai:ethereum,polygon:ethereum")'
  )
  .option('--token <string>', 'Token to send (e.g. "USDC")')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const paths = (source.paths || '')
        .split(',')
        .map((s: string) => {
          return s
            .trim()
            .split(':')
            .map((v: string) => v.trim())
            .filter((v: string) => v)
        })
        .filter((x: any) => x && x?.length)
      new LoadTest({
        concurrentUsers: Number(source.concurrentUsers || 1),
        iterations: Number(source.iterations || 1),
        amount: Number(source.amount || 0),
        paths,
        token: source.token
      }).start()
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
