import AWS from 'aws-sdk'

export async function getParameter (name: string): Promise<string> {
  AWS.config.update({ region: 'us-east-1' })
  const ssm = new AWS.SSM()
  const params = {
    Names: [name],
    WithDecryption: true
  }
  return new Promise((resolve, reject) => {
    ssm.getParameters(params, function (err, data) {
      if (err) {
        return reject(err)
      }
      if (!data?.Parameters?.length) {
        return reject(new Error('not found'))
      }
      resolve(data.Parameters[0].Value)
    })
  })
}
