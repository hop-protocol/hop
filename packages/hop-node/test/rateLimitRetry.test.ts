import rateLimitRetry from 'src/utils/rateLimitRetry'

class Example {
  counter = 0
  foo = rateLimitRetry(async () => {
    return await new Promise((resolve, reject) => {
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
}

describe('rateLimitRetry', () => {
  it('should retry', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    await example.foo()
    expect(example.counter).toBe(2)
  }, 60 * 1000)
})
