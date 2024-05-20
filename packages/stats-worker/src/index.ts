import 'dotenv/config'
import Worker from './worker.js'
import minimist from 'minimist'
import S3Upload from './S3Upload.js'

const argv = minimist(process.argv.slice(2))
console.debug('flags:', argv)

async function main () {
  const shouldOnlyUploadConfig = argv.uploadConfig
  if (shouldOnlyUploadConfig) {
    const upload = new S3Upload()
    return upload.uploadConfig()
  }

  const worker = new Worker({
    yields: argv.yields,
    prices: argv.prices,
    tvl: argv.tvl,
    amm: argv.amm,
    ammDays: argv.ammDays,
    ammOffsetDays: argv.ammOffsetDays,
    ammTokens: argv.ammTokens ? argv.ammTokens.split(',') : null,
    ammChains: argv.ammChains ? argv.ammChains.split(',') : null,
    volume: argv.volume,
    bonder: argv.bonder,
    bonderProfit: argv.bonderProfit,
    bonderFees: argv.bonderFees,
    bonderTxFees: argv.bonderTxFees,
    regenesis: argv.regenesis,
    volumeDays: argv.volumeDays,
    tvlDays: argv.tvlDays,
    bonderOffsetDays: argv.bonderOffsetDays,
    bonderTokens: argv.bonderTokens ? argv.bonderTokens.split(',') : null,
    bonderDays: argv.bonderDays,
    bonderStartDate: argv.bonderStartDate,
    bonderEndDate: argv.bonderEndDate,
    pollIntervalSeconds: argv.pollIntervalSeconds,
    pricesPollIntervalSeconds: argv.pricesPollIntervalSeconds
  })

  worker.start()
}

main().then(() => console.log('Complete'))
