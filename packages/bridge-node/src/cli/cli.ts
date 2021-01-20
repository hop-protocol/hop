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
  .command('bonder')
  .description('Start the bonder watchers')
  .action(() => {
    ArbitrumBondTransferRootWatcher.start().catch(console.error)
    ArbitrumBondWithdrawalWatcher.start().catch(console.error)
    SettleBondedWithdrawalWatcher.start().catch(console.error)
    ArbitrumCommitTransferWatcher.start().catch(console.error)
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    ArbitrumChallengeWatcher.start().catch(console.error)
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    ArbitrumCommitTransferWatcher.start().catch(console.error)
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .action(() => {
    arbBot.start().catch(console.error)
  })

program.parse(process.argv)
