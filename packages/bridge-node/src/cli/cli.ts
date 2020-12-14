import '../moduleAlias'
import { Command } from 'commander'
import ArbitrumCommitTransferWatcher from 'src/watchers/ArbitrumCommitTransferWatcher'
import ArbitrumBondTransferRootWatcher from 'src/watchers/ArbitrumBondTransferRootWatcher'
import ArbitrumChallengeWatcher from 'src/watchers/ArbitrumChallengeWatcher'
import { arbBot } from 'src/arb-bot'

const program = new Command()

program
  .command('committee')
  .description('Start the committee watcher')
  .action(() => {
    ArbitrumBondTransferRootWatcher().catch(console.error)
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    ArbitrumChallengeWatcher().catch(console.error)
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    ArbitrumCommitTransferWatcher().catch(console.error)
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .action(() => {
    arbBot.start()
  })

program.parse(process.argv)
