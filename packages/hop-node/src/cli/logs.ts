import getLogs from 'src/aws/cloudWatch'
import { DateTime } from 'luxon'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

import { logger, program } from './shared'

program
  .command('logs')
  .description('CloudWatch logs')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--filter <string>', 'CloudWatch log filter pattern')
  .option('--error', 'Filter for error logs')
  .option('--warn', 'Filter for warn logs')
  .option('--info', 'Filter for info logs')
  .option('--transfer-id <string>', 'Filter for transfer ID')
  .option('--transfer-root <string>', 'Filter for transfer root hash or ID')
  .option('--log-group <string>', 'CloudWatch log group name')
  .option('--log-stream <string>', 'CloudWatch log stream name')
  .option('--start-time <string>', 'Date time to start search from, in ISO format YYYY-MM-DDThh:mm:ss')
  .option('--end-time <string>', 'Date time to end search at, in ISO format YYYY-MM-DDThh:mm:ss')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      let filterPattern = source.filter
      const startTimeISO = source.startTime
      const endTimeISO = source.endTime
      const transferId = source.transferId
      const transferRoot = source.transferRoot
      const logStream = source.logStream
      const logGroup = source.logGroup

      if (transferId) {
        filterPattern = transferId
      } else if (transferRoot) {
        filterPattern = transferRoot
      } else if (source.error) {
        filterPattern = 'ERROR'
      } else if (source.warn) {
        filterPattern = 'WARN'
      } else if (source.info) {
        filterPattern = 'INFO'
      }

      let startTime: number
      let endTime : number
      if (startTimeISO) {
        startTime = DateTime.fromISO(startTimeISO).toMillis()
      }
      if (endTimeISO) {
        endTime = DateTime.fromISO(endTimeISO).toMillis()
      }

      await getLogs({
        startTime,
        endTime,
        logStream,
        logGroup,
        filterPattern
      }, (messages: string[]) => {
        console.log(messages.join('\n'))
      })

      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
