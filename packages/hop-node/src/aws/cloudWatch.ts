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

async function getLogs (config: Partial<Config>, cb: any) {
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
  console.log('fetching logs (this takes a few seconds)')
  while (true) {
    ({ messages, nextForwardToken } = await getLogEvents(nextForwardToken))
    cb(messages)
    if (!nextForwardToken) {
      break
    }
  }
}

export default getLogs
