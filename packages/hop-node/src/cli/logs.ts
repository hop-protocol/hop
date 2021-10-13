import { DateTime } from 'luxon'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { getLogGroups, getLogStreams, getLogs } from 'src/aws/cloudWatch'

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
  .option('--show-log-groups', 'Show all CloudWatch log group names')
  .option('--show-log-streams', 'Show all CloudWatch log stream names')
  .option('--start-time <string>', 'Date time to start search from, in ISO format YYYY-MM-DDThh:mm:ss (e.g. "2021-09-24T02:34:56")')
  .option('--end-time <string>', 'Date time to end search at, in ISO format YYYY-MM-DDThh:mm:ss (e.g. "2021-09-24T02:34:56")')
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

      if (source.showLogGroups) {
        const groups = await getLogGroups()
        console.log(`${'log group name'.padEnd(38, ' ')}created`)
        for (const { name, createdAt } of groups) {
          const relativeTime = DateTime.fromMillis(createdAt).toRelative()
          console.log(`${name.padEnd(38, ' ')}${relativeTime}`)
        }
      } else if (source.showLogStreams) {
        if (!logGroup) {
          throw new Error('log group name is required')
        }
        const streams = await getLogStreams({
          logGroup
        })
        console.log(`${'log stream name'.padEnd(66, ' ')}${'created'.padEnd(16, ' ')}last event`)
        for (const { name, createdAt, lastEventAt } of streams) {
          const relativeCreatedAt = DateTime.fromMillis(createdAt).toRelative()
          const relativeLastEventAt = DateTime.fromMillis(createdAt).toRelative()
          console.log(`${name.padEnd(66, ' ')}${relativeCreatedAt.padEnd(16, ' ')}${relativeLastEventAt}`)
        }
      } else {
        if (!logGroup) {
          throw new Error('log group name is required')
        }

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
        let endTime: number
        if (startTimeISO) {
          startTime = DateTime.fromISO(startTimeISO, { zone: 'UTC' }).toMillis()
        }
        if (endTimeISO) {
          endTime = DateTime.fromISO(endTimeISO, { zone: 'UTC' }).toMillis()
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
      }

      console.log('\ndone')
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
