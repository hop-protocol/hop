import HealthCheck from 'src/health/HealthCheck'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

program
  .command('health-check')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option(
    '--bond-withdrawal-time-limit <number>',
    'Number of minutes a transfer should be bonded before alerting'
  )
  .option(
    '--bond-transfer-root-time-limit <number>',
    'Number of minutes a transfer root should be bonded before alerting'
  )
  .option(
    '--commit-transfers-min-threshold-amount <number>',
    'Minimum threshold amount that triggers alert if commit transfers has not occurred'
  )
  .option(
    '--poll-interval-seconds <number>',
    'Number of seconds to wait between each poll'
  )
  .description('Start health check')
  .action(async (source: any) => {
    const configPath = source?.config || source?.parent?.config
    if (configPath) {
      const config: FileConfig = await parseConfigFile(configPath)
      await setGlobalConfigFromConfigFile(config)
    }
    const bondWithdrawalTimeLimitMinutes = Number(
      source.bondWithdrawalTimeLimit
    )
    const bondTransferRootTimeLimitMinutes = Number(
      source.bondTransferRootTimeLimitMinutes
    )
    const commitTransfersMinThresholdAmount = Number(
      source.commitTransfersMinThresholdAmount
    )
    const pollIntervalSeconds = Number(source.pollIntervalSeconds)

    try {
      new HealthCheck({
        bondWithdrawalTimeLimitMinutes,
        bondTransferRootTimeLimitMinutes,
        commitTransfersMinThresholdAmount,
        pollIntervalSeconds
      }).start()
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
