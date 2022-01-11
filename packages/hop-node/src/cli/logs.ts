import { DateTime } from 'luxon'
import { actionHandler, parseBool, parseString, root } from './shared'
import { getLogGroups, getLogStreams, getLogs } from 'src/aws/cloudWatch'

root
  .command('logs')
  .description('CloudWatch logs')
  .option('--filter <pattern>', 'CloudWatch log filter pattern', parseString)
  .option('--error [boolean]', 'Filter for error logs', parseBool)
  .option('--warn [boolean]', 'Filter for warn logs', parseBool)
  .option('--info [boolean]', 'Filter for info logs', parseBool)
  .option('--transfer-id <id>', 'Filter for transfer ID', parseString)
  .option('--transfer-root <root>', 'Filter for transfer root hash or ID', parseString)
  .option('--log-group <name>', 'CloudWatch log group name', parseString)
  .option('--log-stream <id>', 'CloudWatch log stream name', parseString)
  .option('--show-log-groups [boolean]', 'Show all CloudWatch log group names', parseBool)
  .option('--show-log-streams [boolean]', 'Show all CloudWatch log stream names', parseBool)
  .option('--start-time <datetime>', 'Date time to start search from, in ISO format YYYY-MM-DDThh:mm:ss (e.g. "2021-09-24T02:34:56")', parseString)
  .option('--end-time <datetime>', 'Date time to end search at, in ISO format YYYY-MM-DDThh:mm:ss (e.g. "2021-09-24T02:34:56")', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  let { filter: filterPattern, startTime: startTimeISO, endTime: endTimeISO, error, warn, info, transferId, transferRoot, logStream, logGroup, showLogGroups, showLogStreams } = source

  if (showLogGroups) {
    const groups = await getLogGroups()
    console.log(`${'log group name'.padEnd(38, ' ')}created`)
    for (const { name, createdAt } of groups) {
      const relativeTime = DateTime.fromMillis(createdAt).toRelative()
      console.log(`${name.padEnd(38, ' ')}${relativeTime}`)
    }
  } else if (showLogStreams) {
    if (!logGroup) {
      throw new Error('log group name is required')
    }
    const streams = await getLogStreams({
      logGroup
    })
    console.log(`${'log stream name'.padEnd(66, ' ')}${'created'.padEnd(16, ' ')}last event`)
    for (const { name, createdAt, lastEventAt } of streams) {
      const relativeCreatedAt = DateTime.fromMillis(createdAt).toRelative()!
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
    } else if (error) {
      filterPattern = 'ERROR'
    } else if (warn) {
      filterPattern = 'WARN'
    } else if (info) {
      filterPattern = 'INFO'
    }

    let startTime: number | undefined
    let endTime: number | undefined
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
}
