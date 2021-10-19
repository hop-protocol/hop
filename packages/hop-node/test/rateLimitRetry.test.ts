import rateLimitRetry from 'src/utils/rateLimitRetry'

class Example {
  counter = 0
  triggerRateLimitError= rateLimitRetry(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.counter++
        if (this.counter < 2) {
          reject(new Error('rate limit'))
          return
        }
        resolve(null)
      }, 100)
    })
  })

  triggerRevertError= rateLimitRetry(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.counter++
        reject(new Error(
          'processing response error (body="{"jsonrpc":"2.0","error":{"code":-32016,"message":"The execution failed due to an exception.","data":"Reverted"},"id":695}n", error= { "code": -32016, "data": "Reverted" } , requestBody="{"method":"eth_estimateGas","params":[{"gasPrice":"0x430e23400","from":"0xa6a688f107851131f0e1dce493ebbebfaf99203e","to":"0x25d8039bb044dc227f741a9e381ca4ceae2e6ae8","data":"0x3d12a85a0000000000000000000000007ee5515dd8ca27afad5277ea07d5065034ed6df000000000000000000000000000000000000000000000000000000000001eabde61702a46938da1d8e1ad6aa98df8a7ef77b2bcc5dab6981b5a98798635b7fcfe00000000000000000000000000000000000000000000000000000000000f42bb0000000000000000000000000000000000000000000000000000000000000bc40000000000000000000000000000000000000000000000000000000061730a43"}],"id":695,"jsonrpc":"2.0"}", requestMethod="POST", url="https://xdai.rpc.hop.exchange", code=SERVER_ERROR, version=web/5.4.0)'
        ))
      }, 100)
    })
  })
}

describe('rateLimitRetry', () => {
  it('should retry', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    await example.triggerRateLimitError()
    expect(example.counter).toBe(2)
  }, 60 * 1000)
  it('should not retry', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    let errMsg : string
    try {
      await example.triggerRevertError()
    } catch (err) {
      errMsg = err.message
    }
    expect(errMsg).toBeTruthy()
    expect(example.counter).toBe(1)
  }, 60 * 1000)
})
