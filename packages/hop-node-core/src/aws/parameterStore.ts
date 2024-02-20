import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { awsRegion } from 'src/config/index.js'

export async function getParameter (name: string, region?: string): Promise<string> {
  const ssm = new SSMClient({
    region: region ?? awsRegion
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
