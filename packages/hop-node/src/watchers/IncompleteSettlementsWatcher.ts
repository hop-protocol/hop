import chainIdToSlug from 'src/utils/chainIdToSlug'
import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import wait from 'src/utils/wait'
import { BigNumber, Contract } from 'ethers'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'
import { formatUnits } from 'ethers/lib/utils'
import { l1BridgeAbi, l2BridgeAbi } from '@hop-protocol/core/abi'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

type Options = {
  token?: string
  days?: number
  format?: string
}

class IncompleteSettlementsWatcher {
  ready: boolean = false

  format: string = 'table'

  chains: string[] = [
    Chain.Ethereum,
    Chain.Arbitrum,
    Chain.Optimism,
    Chain.Gnosis,
    Chain.Polygon
  ]

  tokens: string[] = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC']

  days: number = 7
  startBlockNumbers: any = {}
  endBlockNumbers: any = {}

  // events
  transferCommitteds: any = {}
  multipleWithdrawalsSettleds: any = {}
  withdrawalBondSettleds: any = {}
  rootTransferIds: any = {}
  transferRootConfirmeds: any = {}
  withdrews: any = {}

  // state to track
  rootHashMeta: any = {}
  rootHashTimestamps: any = {}
  rootHashTotals: any = {}
  rootHashSettlements: any = {}
  rootHashWithdrews: any = {}
  rootHashConfirmeds: any = {}
  rootHashSettledTotalAmounts: any = {}
  transferIdWithdrews: any = {}
  transferIdWithdrawalBondSettled: any = {}
  transferIdRootHashes: any = {}

  constructor (options: Options = {}) {
    const { token, days, format } = options
    if (token) {
      this.tokens = [token]
    }
    if (days) {
      this.days = days
    }
    if (format) {
      this.format = format
    }
    this.init()
  }

  private async init () {
    await this.sync()
    this.ready = true
  }

  private async tilReady (): Promise<any> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  private async sync () {
    await this.setStartBlockNumbers()

    console.log('done getting all block numbers')
    console.log('reading events')
    console.log(`days: ${this.days}`)
    console.log('this will take a minute')

    for (const chain of this.chains) {
      for (const token of this.tokens) {
        console.log(`${chain} ${token} reading events`)
        const promises: Array<Promise<any>> = []
        if (['optimism', 'arbitrum'].includes(chain) && token === 'MATIC') {
          continue
        }
        if (chain === 'ethereum') {
          promises.push(this.setTransferRootConfirmeds(chain, token))
        }
        if (chain !== 'ethereum') {
          promises.push(this.setTransferCommittedEvents(chain, token))
        }
        promises.push(this.setMultipleWithdrawalsSettleds(chain, token))
        promises.push(this.setWithdrawalBondSettleds(chain, token))
        promises.push(this.setWithdrews(chain, token))
        await Promise.all(promises)
        console.log(`${chain} ${token} done reading events`)
      }
    }

    console.log('done reading all events')
  }

  private async setStartBlockNumbers () {
    await Promise.all(this.chains.map(async (chain: string) => {
      console.log(`${chain} - getting start and end block numbers`)
      const date = DateTime.fromMillis(Date.now()).minus({ days: this.days })
      const timestamp = date.toSeconds()
      const startBlockNumber = await getBlockNumberFromDate(chain, timestamp)
      this.startBlockNumbers[chain] = startBlockNumber

      const provider = getRpcProvider(chain)
      const endBlockNumber = await provider!.getBlockNumber()
      this.endBlockNumbers[chain] = endBlockNumber
      console.log(`${chain} - done getting block numbers`)
    }))
  }

  private async setEvents (chain: string, token: string, filter: any, obj: any) {
    const contract = this.getContract(chain, token)
    const startBlockNumber = this.startBlockNumbers[chain]
    const endBlockNumber = this.endBlockNumbers[chain]
    const logs = await this.getLogs(filter, chain, startBlockNumber, endBlockNumber, contract)
    if (!obj[chain]) {
      obj[chain] = {}
    }
    if (!obj[chain][token]) {
      obj[chain][token] = {}
    }
    obj[chain][token] = logs
    return logs
  }

  private async setTransferCommittedEvents (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.TransfersCommitted()
    const logs = await this.setEvents(chain, token, filter, this.transferCommitteds)
    await Promise.all(logs.map(async (log: any) => {
      const { rootHash, totalAmount, destinationChainId } = log.args
      const destinationChain = chainIdToSlug(destinationChainId)
      this.rootHashMeta[rootHash] = {
        token,
        sourceChain: chain,
        destinationChain
      }
      this.rootHashTotals[rootHash] = totalAmount

      const provider = getRpcProvider(chain)
      const { timestamp } = await provider!.getBlock(log.blockNumber)
      this.rootHashTimestamps[rootHash] = timestamp
    }))
  }

  private async setMultipleWithdrawalsSettleds (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.MultipleWithdrawalsSettled()
    const logs = await this.setEvents(chain, token, filter, this.multipleWithdrawalsSettleds)
    await Promise.all(logs.map(async (log: any) => {
      return this.setRootTransferIds(chain, token, log)
    }))
  }

  private async setWithdrawalBondSettleds (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.WithdrawalBondSettled()
    const logs = await this.setEvents(chain, token, filter, this.withdrawalBondSettleds)
    for (const log of logs) {
      this.transferIdWithdrawalBondSettled[log.args.transferId] = log
    }
  }

  private async setTransferRootConfirmeds (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.TransferRootConfirmed()
    const logs = await this.setEvents(chain, token, filter, this.transferRootConfirmeds)
    for (const log of logs) {
      this.rootHashConfirmeds[log.args.rootHash] = log
    }
  }

  private async setWithdrews (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.Withdrew()
    const logs = await this.setEvents(chain, token, filter, this.withdrews)
    for (const log of logs) {
      this.transferIdWithdrews[log.args.transferId] = log
    }
  }

  private async setRootTransferIds (chain: string, token: string, log: any) {
    const provider = getRpcProvider(chain)
    const rootHash = log.args.rootHash
    const { data } = await provider!.getTransaction(log.transactionHash)
    const contract = this.getContract(chain, token)
    const { transferIds } = contract.interface.decodeFunctionData(
      'settleBondedWithdrawals',
      data
    )
    this.rootTransferIds[rootHash] = transferIds
    for (const transferId of transferIds) {
      this.transferIdRootHashes[transferId] = rootHash
    }
  }

  private getContract (chain: string, token: string) {
    const provider = getRpcProvider(chain)
    const config = (mainnetAddresses as any).bridges[token][chain]
    const contract = new Contract(config.l1Bridge || config.l2Bridge, config.l1Bridge ? l1BridgeAbi : l2BridgeAbi, provider!)
    return contract
  }

  private async getLogs (filter: any, chain: string, startBlockNumber: number, endBlockNumber: number, contract: any, noStartEnd: boolean = false) {
    let logs = []
    const loop = chain === 'gnosis'
    if (loop) {
      const batchSize = 10000
      let start = startBlockNumber
      let end = start + batchSize
      while (end < endBlockNumber) {
        const _logs = await contract.queryFilter(
          filter,
          start,
          end
        )

        logs.push(..._logs)
        start = end
        end = start + batchSize
      }
    } else {
      if (noStartEnd) {
        logs = await contract.queryFilter(
          filter
        )
      } else {
        logs = await contract.queryFilter(
          filter,
          startBlockNumber,
          endBlockNumber
        )
      }
    }
    return logs
  }

  async start () {
    await this.tilReady()
    await this.checkDiffs()
  }

  async checkDiffs () {
    console.log('summing multipleWithdrawalsSettled events')

    for (const chain of this.chains) {
      for (const token of this.tokens) {
        const logs = this.multipleWithdrawalsSettleds?.[chain]?.[token]
        if (!logs) {
          continue
        }

        for (const log of logs) {
          const transactionHash = log.transactionHash
          const bonder = log.args.bonder
          const rootHash = log.args.rootHash
          const amount = log.args.totalBondsSettled

          if (!this.rootHashSettlements[rootHash]) {
            this.rootHashSettlements[rootHash] = []
          }

          this.rootHashSettlements[rootHash].push({
            transactionHash,
            bonder,
            rootHash,
            amount
          })
        }
      }
    }

    for (const rootHash in this.rootHashSettlements) {
      if (!this.rootHashSettledTotalAmounts[rootHash]) {
        this.rootHashSettledTotalAmounts[rootHash] = BigNumber.from(0)
      }
      for (const { amount } of this.rootHashSettlements[rootHash]) {
        this.rootHashSettledTotalAmounts[rootHash] = this.rootHashSettledTotalAmounts[rootHash].add(amount)
      }
    }

    console.log('summing withdrew events')

    for (const transferId in this.transferIdWithdrews) {
      const log = this.transferIdWithdrews[transferId]
      const amount = log.args.amount
      const rootHash = this.transferIdRootHashes[transferId]
      if (!this.rootHashWithdrews[rootHash]) {
        this.rootHashWithdrews[rootHash] = []
      }
      this.rootHashWithdrews[rootHash].push(log)
      this.rootHashSettledTotalAmounts[rootHash] = this.rootHashSettledTotalAmounts[rootHash].add(amount)
    }

    console.log('summing withdrawalBondSettled events')

    for (const transferId in this.transferIdWithdrawalBondSettled) {
      const log = this.transferIdWithdrawalBondSettled[transferId]
      // TODO: get transfer sent amount
      const amount = BigNumber.from(0)
      const rootHash = this.transferIdRootHashes[transferId]
      this.rootHashSettledTotalAmounts[rootHash] = this.rootHashSettledTotalAmounts[rootHash].add(amount)
    }

    let incompletes = []

    const rootsCount = Object.keys(this.rootHashTotals).length
    console.log('checking settled amount diffs')
    console.log(`roots to check: ${rootsCount}`)

    for (const rootHash in this.rootHashTotals) {
      const { sourceChain, destinationChain, token } = this.rootHashMeta[rootHash]
      const totalAmount = this.rootHashTotals[rootHash]
      const timestamp = this.rootHashTimestamps[rootHash]
      const isConfirmed = !!this.rootHashConfirmeds[rootHash]
      const tokenDecimals = getTokenDecimals(token)
      const settledTotalAmount = this.rootHashSettledTotalAmounts[rootHash] ?? BigNumber.from(0)
      const timestampRelative = DateTime.fromSeconds(timestamp).toRelative()
      const _totalAmount = totalAmount.toString()
      const totalAmountFormatted = formatUnits(_totalAmount, tokenDecimals)
      const diff = totalAmount.sub(settledTotalAmount).toString()
      const diffFormatted = formatUnits(diff, tokenDecimals)
      const isIncomplete = settledTotalAmount.eq(0) || !settledTotalAmount.eq(totalAmount)
      if (isIncomplete) {
        const settlementEvents = this.rootHashSettlements[rootHash]?.length ?? 0
        const withdrewEvents = this.rootHashWithdrews[rootHash]?.length ?? 0
        incompletes.push({
          timestamp,
          timestampRelative,
          token,
          sourceChain,
          destinationChain,
          totalAmount: _totalAmount,
          totalAmountFormatted,
          diff,
          diffFormatted,
          rootHash,
          settlementEvents,
          withdrewEvents,
          isConfirmed
        })
      }
      console.log(`root: ${rootHash}, token: ${token}, isAllSettled: ${!isIncomplete}, isConfirmed: ${isConfirmed}, totalAmount: ${totalAmountFormatted}, diff: ${diffFormatted}`)
    }

    incompletes = incompletes.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))

    console.log('done checking root diffs')
    console.log(`incomplete settlements: ${incompletes.length}`)
    if (this.format === 'table') {
      console.table(incompletes)
    } else if (this.format === 'csv') {
      if (incompletes.length > 0) {
        const header = Object.keys(incompletes[0])
        const csv = incompletes.map((item: any) => Object.values(item))
        console.log(header.join(','))
        console.log(csv.join(','))
      }
    } else if (this.format === 'json') {
      console.log(JSON.stringify(incompletes, null, 2))
    } else {
      throw new Error('invalid format')
    }
  }
}

export default IncompleteSettlementsWatcher
