import BaseWatcher from './classes/BaseWatcher'
import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import { Chain } from 'src/constants'
import { Contract, Wallet, providers } from 'ethers'
import { Watcher } from '@eth-optimism/core-utils'
import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import { getMessagesAndProofsForL2Transaction } from '@eth-optimism/message-relayer'
import { getRpcProvider, getRpcUrls, wait } from 'src/utils'
import { config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
}

class OptimismBridgeWatcher extends BaseWatcher {
  l1Provider: any
  l2Provider: any
  l1Wallet: Wallet
  l2Wallet: Wallet
  l1Messenger: Contract
  scc: Contract
  watcher: Watcher

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'OptimismBridgeWatcher',
      logColor: 'yellow'
    })

    const privateKey = globalConfig.relayerPrivateKey || globalConfig.bonderPrivateKey
    this.l1Provider = new providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Ethereum)[0]
    )
    this.l2Provider = new providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Optimism)[0]
    )
    this.l1Wallet = new GasBoostSigner(privateKey, this.l1Provider)
    this.l2Wallet = new GasBoostSigner(privateKey, this.l2Provider)
    const sccAddress = '0xE969C2724d2448F1d1A6189d3e2aA1F37d5998c1'
    const l1MessengerAddress = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007'

    this.watcher = new Watcher({
      l1: {
        provider: getRpcProvider(Chain.Ethereum),
        messengerAddress: l1MessengerAddress
      },
      l2: {
        provider: getRpcProvider(Chain.Optimism),
        messengerAddress: l2MessengerAddress
      }
    })

    this.l1Messenger = getContractFactory('iOVM_L1CrossDomainMessenger')
      .connect(this.l1Wallet)
      .attach(this.watcher.l1.messengerAddress)
    this.scc = getContractFactory('iOVM_StateCommitmentChain')
      .connect(this.l1Wallet)
      .attach(sccAddress)
  }

  async relayXDomainMessages (
    txHash: string
  ): Promise<any> {
    let messagePairs = []
    while (true) {
      try {
        messagePairs = await getMessagesAndProofsForL2Transaction(
          this.l1Provider,
          this.l2Provider,
          this.scc.address,
          predeploys.OVM_L2CrossDomainMessenger,
          txHash
        )
        break
      } catch (err) {
        if (err.message.includes('unable to find state root batch for tx')) {
          await wait(5000)
        } else {
          throw err
        }
      }
    }

    for (const { message, proof } of messagePairs) {
      while (true) {
        try {
          const inChallengeWindow = await this.scc.insideFraudProofWindow(proof.stateRootBatchHeader)
          if (inChallengeWindow) {
            return false
          }

          const result = await this.l1Messenger
            .connect(this.l1Wallet)
            .relayMessage(
              message.target,
              message.sender,
              message.message,
              message.messageNonce,
              proof
            )
          await result.wait()
          return result
        } catch (err) {
          if (err.message.includes('execution failed due to an exception')) {
            await wait(5000)
          } else if (
            err.message.includes('message has already been received')
          ) {
            break
          } else {
            throw err
          }
        }
      }
    }
  }
}
export default OptimismBridgeWatcher
