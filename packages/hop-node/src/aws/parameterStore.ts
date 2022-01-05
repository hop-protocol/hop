import AWS from 'aws-sdk'
import { awsRegion } from 'src/config'

AWS.config.update({
  region: awsRegion
})

export async function getParameter (name: string, region?: string): Promise<string> {
  const ssm = new AWS.SSM({
    region
  })
  const params = {
    Name: name,
    WithDecryption: true
  }
  return await new Promise((resolve, reject) => {
    ssm.getParameter(params, function (err: Error, data: any) {
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
