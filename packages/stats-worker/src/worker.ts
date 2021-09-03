import Stats from './stats'
import S3Upload from './s3Upload'
import wait from 'wait'

class Worker {
  stats = new Stats()
  hosting = new S3Upload()

  async start () {
    console.log('worker started')
    while (true) {
      try {
        console.log('fetching')
        const data = await this.stats.getAllAprs()
        await this.hosting.upload(data)
      } catch (err) {
        console.error(err)
      }
      await wait(15 * 60 * 1000)
    }
  }
}

export default Worker
