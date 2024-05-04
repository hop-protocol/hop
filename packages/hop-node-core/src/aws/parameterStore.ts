import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { CoreEnvironment } from '#config/index.js'

export async function getParameter (name: string, region?: string): Promise<string> {
  const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
  const ssm = new SSMClient({
    region: region ?? coreEnvironmentVariables.awsRegion
  })
  const params = {
    Name: name,
    WithDecryption: true
  }
  const command = new GetParameterCommand(params)
  return new Promise((resolve, reject) => {
    ssm.send(command, function (err: Error, data: any) {
      if (err) {
        return reject(err)
      }
      if (!data?.Parameter) {
        return reject(new Error('not found'))
      }
      resolve(data.Parameter.Value)
    })
  })
}
