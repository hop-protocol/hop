export class TimeoutError extends Error {}

const promiseTimeout = async (promise: any, timeout: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let timedout = false
    const t = setTimeout(() => {
      timedout = true
      reject(new TimeoutError('timedout'))
    }, timeout)

    // make it a promise if it's not one
    Promise.resolve(promise)
      .then((result: any) => {
        clearTimeout(t)
        if (!timedout) {
          resolve(result)
        }
      })
      .catch((err: any) => {
        clearTimeout(t)
        if (!timedout) {
          reject(err)
        }
      })
  })
}

export default promiseTimeout
