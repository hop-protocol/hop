import IncompleteSettlementsWatcher from 'src/watchers/IncompleteSettlementsWatcher'
import Logger from 'src/logger'
import S3Upload from 'src/aws/s3Upload'
import wait from 'src/utils/wait'
import { config as globalConfig } from 'src/config'

export type Config = {
  days?: number
  s3Upload?: boolean
  s3Namespace?: string
}

export class HealthCheckWatcher {
  logger: Logger = new Logger('HealthCheckWatcher')
  s3Upload: S3Upload
  incompleteSettlementsWatcher: IncompleteSettlementsWatcher
  s3Filename: string

  constructor (config: Config) {
    const { days, s3Upload, s3Namespace } = config
    this.incompleteSettlementsWatcher = new IncompleteSettlementsWatcher({
      days,
      format: 'json'
    })
    this.logger.debug(`s3Upload: ${!!s3Upload}`)
    if (s3Upload) {
      const bucket = 'assets.hop.exchange'
      const filePath = `${s3Namespace ?? globalConfig.network}/v1-health-check.json`
      this.s3Filename = `https://${bucket}/${filePath}`
      this.logger.debug(`upload path: ${this.s3Filename}`)
      this.s3Upload = new S3Upload({
        bucket,
        key: filePath
      })
    }
  }

  async start () {
    while (true) {
      try {
        await this.poll()
      } catch (err) {
        this.logger.error('poll error:', err)
      }
      await wait(60 * 1000)
    }
  }

  async poll () {
    this.logger.debug('poll')
    const incompleteSettlements = await this.incompleteSettlementsWatcher.getDiffResults()
    const data = {
      incompleteSettlements
    }
    this.logger.debug('data')
    this.logger.debug(JSON.stringify(data, null, 2))
    if (this.s3Upload) {
      await this.s3Upload.upload(data)
      this.logger.debug(`uploaded to s3 at ${this.s3Filename}`)
    }
    this.logger.debug('poll complete')
  }
}
