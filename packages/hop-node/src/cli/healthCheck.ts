import { HealthCheckWatcher } from 'src/watchers/HealthCheckWatcher'
import { actionHandler, parseBool, parseNumber, parseString, root } from './shared'

root
  .command('health-check')
  .description('Run health check watcher')
  .option('--days <number>', 'Number of days to search', parseNumber)
  .option('--offsetDays <number>', 'Number of days to offset search', parseNumber)
  .option('--s3Upload [boolean]', 'Upload result JSON to S3', parseBool)
  .option('--s3Namespace <name>', 'S3 bucket namespace', parseString)
  .option('--cacheFile <filepath>', 'Cache file', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { days, offsetDays, s3Upload, s3Namespace, cacheFile } = source
  const watcher = new HealthCheckWatcher({
    days,
    offsetDays,
    s3Upload,
    s3Namespace,
    cacheFile
  })
  await watcher.start()
  console.log('done')
}
