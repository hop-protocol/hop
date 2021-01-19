import '../moduleAlias'
import { Command } from 'commander'
import ArbitrumCommitTransferWatcher from 'src/watchers/ArbitrumCommitTransferWatcher'
import ArbitrumBondTransferRootWatcher from 'src/watchers/ArbitrumBondTransferRootWatcher'
import ArbitrumBondWithdrawalWatcher from 'src/watchers/ArbitrumBondWithdrawalWatcher'
import ArbitrumChallengeWatcher from 'src/watchers/ArbitrumChallengeWatcher'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import { arbBot } from 'src/arb-bot'

const program = new Command()

program
  .command('committee')
  .description('Start the committee watcher')
  .action(() => {
    ArbitrumBondTransferRootWatcher.start()
    ArbitrumBondWithdrawalWatcher.start()
    SettleBondedWithdrawalWatcher.start()
    ArbitrumCommitTransferWatcher.start()
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    ArbitrumChallengeWatcher.start()
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    ArbitrumCommitTransferWatcher.start()
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .action(() => {
    arbBot.start()
  })

program.parse(process.argv)
