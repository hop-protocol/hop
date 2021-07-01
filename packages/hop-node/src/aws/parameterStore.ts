import AWS from 'aws-sdk'

AWS.config.update({ region: 'us-east-1' })

export async function getParameter (name: string): Promise<string> {
  const ssm = new AWS.SSM()
  const params = {
    Name: name,
    WithDecryption: true
  }
  return new Promise((resolve, reject) => {
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
