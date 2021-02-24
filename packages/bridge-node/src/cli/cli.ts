import '../moduleAlias'
import { Command } from 'commander'
import arbbots from 'src/arb-bot/bots'
import {
  startWatchers,
  startStakeWatchers,
  startChallengeWatchers,
  startCommitTransferWatchers
} from 'src/watchers/watchers'

const program = new Command()

program
  .command('bonder')
  .option('-o, --order <order>', 'Bonder order')
  .description('Start the bonder watchers')
  .action(source => {
    const orderNum = Number(source.order) || 0
    startWatchers(orderNum)
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
