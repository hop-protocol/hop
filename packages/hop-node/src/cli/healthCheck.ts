import { HealthCheckWatcher } from 'src/watchers/HealthCheckWatcher'
import { actionHandler, parseBool, parseNumber, parseString, parseStringArray, root } from './shared'

root
  .command('health-check')
  .description('Run health check watcher')
  .option('--days <number>', 'Number of days to search', parseNumber)
  .option('--offsetDays <number>', 'Number of days to offset search', parseNumber)
  .option('--s3Upload [boolean]', 'Upload result JSON to S3', parseBool)
  .option('--s3Namespace <name>', 'S3 bucket namespace', parseString)
  .option('--cacheFile <filepath>', 'Cache file', parseString)
  .option('--enabledChecks <enabledChecks>', 'Enabled checks. Options are: lowBonderBalances,unbondedTransfers,unbondedTransferRoots,incompleteSettlements,challengedTransferRoots,unsyncedSubgraphs,lowAvailableLiquidityBonders', parseStringArray)
  .action(actionHandler(main))

async function main (source: any) {
  const { days, offsetDays, s3Upload, s3Namespace, cacheFile, enabledChecks } = source

  let enabledChecksObj: any = null
  if (enabledChecks?.length) {
    enabledChecksObj = {
      lowBonderBalances: enabledChecks.includes('lowBonderBalances'),
      unbondedTransfers: enabledChecks.includes('unbondedTransfers'),
      unbondedTransferRoots: enabledChecks.includes('unbondedTransferRoots'),
      incompleteSettlements: enabledChecks.includes('incompleteSettlements'),
      challengedTransferRoots: enabledChecks.includes('challengedTransferRoots'),
      unsyncedSubgraphs: enabledChecks.includes('unsyncedSubgraphs'),
      lowAvailableLiquidityBonders: enabledChecks.includes('lowAvailableLiquidityBonders'),
      missedEvents: enabledChecks.includes('missedEvents'),
      invalidBondWithdrawals: enabledChecks.includes('invalidBondWithdrawals'),
			unrelaytedTransfers: enabledChecks.includes('unrelaytedTransfers'),
			unsetTransferRoots: enabledChecks.includes('unsetTransferRoots'),
      dnsNameserversChanged: enabledChecks.includes('dnsNameserversChanged'),
      lowOsResources: enabledChecks.includes('lowOsResources')
    }
  }

  const watcher = new HealthCheckWatcher({
    days,
    offsetDays,
    s3Upload,
    s3Namespace,
    cacheFile,
    enabledChecks: enabledChecksObj
  })
  await watcher.start()
  console.log('done')
}
