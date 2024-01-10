import { BigNumber, ethers } from 'ethers'
import { getBlockNumberFromDateUsingLib } from './getBlockNumberFromDate'

type MessageHashInput = {
  from: string
  to: string
  fee: string | BigNumber
  value: string | BigNumber
  deadline: string | number | BigNumber
  calldata: string
}

export class LineaUtils {
  l1Provider: any
  l2Provider: any

  constructor () {
    const l1Rpc = 'https://rpc.ankr.com/eth_goerli'
    this.l1Provider = new ethers.providers.StaticJsonRpcProvider({ allowGzip: true, url: l1Rpc })

    const l2Rpc = 'https://linea-goerli.infura.io/v3/faf4bc4ea7344e5da5e56c55de087480'
    this.l2Provider = new ethers.providers.StaticJsonRpcProvider({ allowGzip: true, url: l2Rpc })
  }

  async getL1MessageDispatchedEvent (l1TxHash: string, fromAddress: string) {
    const l1Address = '0xe87d317eb8dcc9afe24d9f63d6c760e52bc18a40'
    const contract = new ethers.Contract(l1Address, abi, this.l1Provider)
    const receipt = await this.l1Provider.getTransactionReceipt(l1TxHash)
    const l1BlockNumber = receipt.blockNumber
    const startBlockNumber = l1BlockNumber
    const endBlockNumber = startBlockNumber

    const logs = await contract.queryFilter(contract.filters.MessageDispatched(),
      startBlockNumber,
      endBlockNumber
    )

    for (const log of logs) {
      if (log.args?._from.toLowerCase() === fromAddress.toLowerCase()) {
        return log
      }
    }

    return null
  }

  async getL2MessageDeliveredEvent (l1TxHash: string, fromAddress: string) {
    const messageDispatchedEvent = await this.getL1MessageDispatchedEvent(l1TxHash, fromAddress)
    if (!messageDispatchedEvent) {
      return null
    }
    const l1BlockNumber = messageDispatchedEvent.blockNumber
    const l1Block = await this.l1Provider.getBlock(l1BlockNumber)
    const l1BlockTimestamp = l1Block.timestamp

    const l2BlockNumber = await getBlockNumberFromDateUsingLib(this.l2Provider, l1BlockTimestamp)
    const l2Address = '0xA59477f7742Ba7d51bb1E487a8540aB339d6801d'
    const contract = new ethers.Contract(l2Address, abi, this.l2Provider)
    const startBlockNumber = l2BlockNumber - 100
    const endBlockNumber = startBlockNumber + 1000

    const batchSize = 250
    const logs = []
    let start = startBlockNumber
    let end = Math.min(start + batchSize, endBlockNumber)
    while (end <= endBlockNumber) {
      const _logs = await contract.queryFilter(contract.filters.MessageDelivered(),
        start,
        end
      )
      logs.push(..._logs)
      start = end
      end = start + batchSize
    }

    for (const log of logs) {
      if (log.data.includes(fromAddress.replace('0x', '').toLowerCase())) {
        return log
      }
    }

    return null
  }

  async getL1MessageConfirmedEvent (l1TxHash: string, fromAddress: string) {
    const l1Address = '0xe87d317eb8dcc9afe24d9f63d6c760e52bc18a40'
    const contract = new ethers.Contract(l1Address, abi, this.l1Provider)
    const receipt = await this.l1Provider.getTransactionReceipt(l1TxHash)
    const l1BlockNumber = receipt.blockNumber
    const range = 1000
    const startBlockNumber = l1BlockNumber - 100
    const endBlockNumber = startBlockNumber + range

    const logs = await contract.queryFilter(contract.filters.MessageConfirmed(),
      startBlockNumber,
      endBlockNumber
    )

    const messageDispatchedEvent = await this.getL1MessageDispatchedEvent(l1TxHash, fromAddress)
    const messageHash = this.computeMessageHash({
      from: fromAddress,
      to: messageDispatchedEvent?.args?._to,
      fee: messageDispatchedEvent?.args?._fee,
      value: messageDispatchedEvent?.args?._value,
      deadline: messageDispatchedEvent?.args?._deadline,
      calldata: messageDispatchedEvent?.args?._calldata
    })

    for (const log of logs) {
      if (log.args?.messageHash === messageHash) {
        return log
      }
    }

    return null
  }

  computeMessageHash (input: MessageHashInput) {
    const abiCoder = new ethers.utils.AbiCoder()
    const from = input.from
    const to = input.to
    const fee = BigNumber.from(input.fee || 0)
    const value = BigNumber.from(input.value || 0)
    const deadline = BigNumber.from(input.deadline || 0)
    const calldata = input.calldata || '0x'

    const encoded = abiCoder.encode(['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes'], [from, to, fee, value, deadline, calldata])
    const messageHash = ethers.utils.keccak256(encoded)
    return messageHash
  }
}

const abi = [
  {
    name: 'MessageDispatched',
    inputs: [
      {
        name: '_from',
        type: 'address',
        indexed: false
      },
      {
        name: '_to',
        type: 'address',
        indexed: false
      },
      {
        name: '_fee',
        type: 'uint256',
        indexed: false
      },
      {
        name: '_value',
        type: 'uint256',
        indexed: false
      },
      {
        name: '_deadline',
        type: 'uint256',
        indexed: false
      },
      {
        name: '_calldata',
        type: 'bytes',
        indexed: false
      }
    ],
    type: 'event'
  },
  {
    name: 'MessageDelivered',
    inputs: [
      {
        name: '_from',
        type: 'address',
        indexed: false
      },
      {
        name: '_to',
        type: 'address',
        indexed: false
      },
      {
        name: '_fee',
        type: 'uint256',
        indexed: false
      },
      {
        name: '_value',
        type: 'uint256',
        indexed: false
      },
      {
        name: '_deadline',
        type: 'uint256',
        indexed: false
      },
      {
        name: '_calldata',
        type: 'bytes',
        indexed: false
      }
    ],
    type: 'event'
  },
  {
    name: 'MessageConfirmed',
    inputs: [
      {
        name: 'messageHash',
        type: 'bytes32',
        indexed: false
      }
    ],
    type: 'event'
  }
]
