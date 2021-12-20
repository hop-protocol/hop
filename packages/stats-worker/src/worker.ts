import AprStats from './AprStats'
import VolumeStats from './VolumeStats'
import TvlStats from './TvlStats'
import S3Upload from './S3Upload'
import wait from 'wait'

class Worker {
  aprStats = new AprStats()
  volumeStats = new VolumeStats()
  tvlStats = new TvlStats()
  hosting = new S3Upload()
  pollIntervalMs: number = 60 * 60 * 1000

  async start () {
    console.log('worker started')
    console.log(`polling every ${this.pollIntervalMs}ms`)
    await Promise.all([
      this.aprStatsPoll(),
      this.volumeStatsPoll(),
      this.tvlStatsPoll()
    ])
  }

  async volumeStatsPoll () {
    console.log('volumeStatsPoll started')
    while (true) {
      try {
        console.log('fetching volume stats')
        await this.volumeStats.trackDailyVolume()
        console.log('done tracking volume stats')
      } catch (err) {
        console.error(err)
      }
      await wait(this.pollIntervalMs)
    }
  }

  async tvlStatsPoll () {
    console.log('tvlStatsPoll started')
    while (true) {
      try {
        console.log('fetching tvl stats')
        await this.tvlStats.trackTvl()
        console.log('done tracking tvl stats')
      } catch (err) {
        console.error(err)
      }
      await wait(this.pollIntervalMs)
    }
  }

  async aprStatsPoll () {
    console.log('aprStatsPoll started')
    while (true) {
      try {
        console.log('fetching apr stats')
        const data = await this.aprStats.getAllAprs()
        await this.hosting.upload(data)
        console.log('done uploading apr stats')
      } catch (err) {
        console.error(err)
      }
      await wait(this.pollIntervalMs)
    }
  }
}

export default Worker
