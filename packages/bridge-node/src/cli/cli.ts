import '../moduleAlias'
import { Command } from 'commander'
import * as config from 'src/config'
import { contracts } from 'src/contracts'
import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import ChallengeWatcher from 'src/watchers/ChallengeWatcher'
import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import StakeWatcher from 'src/watchers/StakeWatcher'
import arbot from 'src/arb-bot/bot'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import { L2OptimismProvider } from 'src/wallets/L2OptimismWallet'
import l1WalletOld from 'src/wallets/L1WalletOld'

const providers: any = {
  arbitrum: L2ArbitrumProvider,
  optimism: L2OptimismProvider
}

const program = new Command()

const tokens = Object.keys(config.tokens)
const networks = ['arbitrum', 'optimism']

const startStakeWatchers = () => {
  for (let token of tokens) {
    new StakeWatcher({
      chains: [
        {
          label: 'L1',
          contract: contracts[token]['kovan'].l1Bridge
        },
        ...networks
          .filter(network => {
            return !!contracts[token][network]
          })
          .map(network => {
            return {
              label: `${network} ${token}`,
              contract: contracts[token][network].l2Bridge
            }
          })
      ]
    }).start()
  }
}

program
  .command('bonder')
  .description('Start the bonder watchers')
  .action(() => {
    for (let network of networks) {
      for (let token of tokens) {
        if (!contracts[token][network]) {
          continue
        }
        const label = `${network} ${token}`
        let l1Bridge = contracts[token].kovan.l1Bridge
        if (
          (token === 'DAI' && network === 'arbitrum') ||
          (token === 'DAI' && network === 'optimism')
        ) {
          l1Bridge = l1Bridge.connect(l1WalletOld)
        }

        new BondTransferRootWatcher({
          label,
          L1BridgeContract: l1Bridge,
          L2BridgeContract: contracts[token][network].l2Bridge
        }).start()

        new BondWithdrawalWatcher({
          label,
          L1BridgeContract: l1Bridge,
          L2BridgeContract: contracts[token][network].l2Bridge,
          // TODO
          contracts: {
            '69': contracts[token].optimism?.l2Bridge,
            '79377087078960': contracts[token].arbitrum?.l2Bridge
          },
          L2Provider: providers[network]
        }).start()

        new SettleBondedWithdrawalWatcher({
          label,
          L1BridgeContract: l1Bridge,
          L2BridgeContract: contracts[token][network].l2Bridge
        }).start()

        new CommitTransferWatcher({
          label,
          L2BridgeContract: contracts[token][network].l2Bridge
        }).start()
      }
    }

    startStakeWatchers()
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    for (let network of networks) {
      for (let token of tokens) {
        new ChallengeWatcher({
          label: network,
          L1BridgeContract: contracts[token].kovan.l1Bridge,
          L2BridgeContract: contracts[token][network].l2Bridge,
          L2Provider: providers[network]
        }).start()
      }
    }
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    for (let network of networks) {
      for (let token of tokens) {
        new CommitTransferWatcher({
          label: network,
          L2BridgeContract: contracts[token][network].l2Bridge
        }).start()
      }
    }
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .action(() => {
    arbot.start()
  })

program
  .command('stake')
  .description('Start the stake watcher')
  .action(() => {
    startStakeWatchers()
  })

program.parse(process.argv)
