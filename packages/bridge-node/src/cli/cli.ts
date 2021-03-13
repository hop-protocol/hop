import '../moduleAlias'
import { Command } from 'commander'
import arbbots from 'src/arb-bot/bots'
import {
  startWatchers,
  startStakeWatchers,
  startChallengeWatchers,
  startCommitTransferWatchers
} from 'src/watchers/watchers'
//import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'

const program = new Command()

program
  .command('bonder')
  .option('-o, --order <order>', 'Bonder order')
  .option(
    '-t, --tokens <symbol>',
    'List of token by symbol to bond, comma separated'
  )
  .option(
    '-n, --networks <network>',
    'List of networks to bond, comma separated'
  )
  .description('Start the bonder watchers')
  .action(source => {
    const orderNum = Number(source.order) || 0
    const tokens = (source.tokens || '')
      .split(',')
      .map((value: string) => value.trim().toUpperCase())
      .filter((value: string) => value)
    const networks = (source.networks || '')
      .split(',')
      .map((value: string) => value.trim().toLowerCase())
      .filter((value: string) => value)
    startWatchers({
      order: orderNum,
      tokens,
      networks
    })
    //new xDaiBridgeWatcher().start()
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    startChallengeWatchers()
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    startCommitTransferWatchers()
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .action(() => {
    arbbots.start()
  })

program
  .command('stake')
  .description('Start the stake watcher')
  .action(() => {
    startStakeWatchers()
  })

program.parse(process.argv)
