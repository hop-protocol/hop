import { Logger } from '#logger/index.js'
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
  FilterLogEventsCommand
} from '@aws-sdk/client-cloudwatch-logs'
import { awsRegion } from '#config/index.js'

const logger = new Logger('CloudWatch')

type Config = {
  logGroup: string
  logStream: string
  filterPattern: string
  startTime: number
  endTime: number
}

export async function getLogGroups () {
  const cloudwatch = new CloudWatchLogsClient({ region: awsRegion })
  const params = {
    limit: 20
  }
  const command = new DescribeLogGroupsCommand(params)
  const data = await cloudwatch.send(command)
  if (!data?.logGroups) {
    throw new Error('no log groups found')
  }
  return data?.logGroups.map((item: any) => {
    return {
      name: item.logGroupName,
      createdAt: item.creationTime
    }
  })
}

export async function getLogStreams (config: Partial<Config>) {
  const { logGroup } = config
  const cloudwatch = new CloudWatchLogsClient({ region: awsRegion })
  const params = {
    logGroupName: logGroup,
    descending: true,
    orderBy: 'LastEventTime',
    limit: 10
  }
  const command = new DescribeLogStreamsCommand(params)
  const data = await cloudwatch.send(command)
  if (!data?.logStreams) {
    throw new Error('no log streams found')
  }
  return data?.logStreams.map((item: any) => {
    return {
      name: item.logStreamName,
      createdAt: item.creationTime,
      lastEventAt: item.lastEventTimestamp
    }
  })
}

export async function getLogs (config: Partial<Config>, cb: any) {
  let { logGroup, logStream, filterPattern, startTime, endTime } = config
  const cloudwatch = new CloudWatchLogsClient({ region: awsRegion })
  const getLatestLogStream = async (): Promise<any> => {
    const params = {
      logGroupName: logGroup,
      descending: true,
      orderBy: 'LastEventTime',
      limit: 5
    }
    const command = new DescribeLogStreamsCommand(params)
    const data = await cloudwatch.send(command)
    if (!data?.logStreams) {
      throw new Error('no log streams found')
    }
    return data?.logStreams?.[0]?.logStreamName
  }

  if (!logStream) {
    logStream = await getLatestLogStream()
  }

  if (!logStream) {
    throw new Error('no log stream found')
  }

  const getLogEvents = async (nextToken?: string): Promise<any> => {
    const logStreamNames = logStream ? [logStream] : undefined
    const params = {
      startTime,
      endTime,
      filterPattern,
      logGroupName: logGroup,
      logStreamNames,
      nextToken
    }
    const command = new FilterLogEventsCommand(params)
    const data = await cloudwatch.send(command)
    if (!data?.events) {
      throw new Error('no log events found')
    }
    return {
      messages: data.events.map((event: any) => event.message),
      nextToken: data.nextToken
    }
  }

  let messages: string[]
  let nextForwardToken: string | undefined
  logger.debug(`log stream: ${logStream}`)
  logger.debug('fetching logs (this takes a few seconds)\n')
  while (true) {
    ({ messages, nextForwardToken } = await getLogEvents(nextForwardToken))
    cb(messages)
    if (!nextForwardToken) {
      break
    }
  }
}
