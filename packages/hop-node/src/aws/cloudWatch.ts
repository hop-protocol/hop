import AWS from 'aws-sdk'
import pify from 'pify'

AWS.config.update({ region: 'us-east-1' })

type Config = {
  logGroup: string
  logStream: string
  filterPattern: string,
  startTime: number
  endTime: number
}

export async function getLogGroups () {
  const cloudwatch = new AWS.CloudWatchLogs()
  const params = {
    limit: 20
  }
  const data = await pify(cloudwatch.describeLogGroups.bind(cloudwatch))(params)
  return data?.logGroups.map((item: any) => {
    return {
      name: item.logGroupName,
      createdAt: item.creationTime
    }
  })
}

export async function getLogStreams (config: Partial<Config>) {
  const { logGroup } = config
  const cloudwatch = new AWS.CloudWatchLogs()
  const params = {
    logGroupName: logGroup,
    descending: true,
    orderBy: 'LastEventTime',
    limit: 10
  }
  const data = await pify(cloudwatch.describeLogStreams.bind(cloudwatch))(params)
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
  const cloudwatch = new AWS.CloudWatchLogs()
  const getLatestLogStream = async ():Promise<any> => {
    const params = {
      logGroupName: logGroup,
      descending: true,
      orderBy: 'LastEventTime',
      limit: 5
    }
    const data = await pify(cloudwatch.describeLogStreams.bind(cloudwatch))(params)
    return data?.logStreams?.[0]?.logStreamName
  }

  if (!logStream) {
    logStream = await getLatestLogStream()
  }

  if (!logStream) {
    throw new Error('no log stream found')
  }

  const getLogEvents = async (nextToken?: string):Promise<any> => {
    const params = {
      startTime,
      endTime,
      filterPattern,
      logGroupName: logGroup,
      logStreamNames: [logStream],
      nextToken
    }
    const data = await pify(cloudwatch.filterLogEvents.bind(cloudwatch))(params)
    return {
      messages: data.events.map((event: any) => event.message),
      nextToken: data.nextToken
    }
  }

  let messages : string[]
  let nextForwardToken : string
  console.log(`log stream: ${logStream}`)
  console.log('fetching logs (this takes a few seconds)')
  console.log(startTime)
  while (true) {
    ({ messages, nextForwardToken } = await getLogEvents(nextForwardToken))
    cb(messages)
    if (!nextForwardToken) {
      break
    }
  }
}
