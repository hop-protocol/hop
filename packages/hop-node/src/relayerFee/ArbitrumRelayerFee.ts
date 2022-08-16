import getRpcProvider from 'src/utils/getRpcProvider'
import { BigNumber, constants, utils as ethersUtils } from 'ethers'
import { Chain, MaxDeadline } from 'src/constants'
import {
  config as globalConfig
} from 'src/config'
import { IRelayerFee } from './IRelayerFee'


export class ArbitrumRelayerFee implements IRelayerFee {
  async getRelayCost (): Promise<BigNumber> {
    const provider = getRpcProvider(Chain.Arbitrum)!

    // Submission Cost
    const l1Provider = getRpcProvider(Chain.Ethereum)!
    const distributeCalldataSize: number = 196
    const { baseFeePerGas } = await l1Provider.getBlock('latest')
    const submissionCost: BigNumber = this._calculateRetryableSubmissionFee(distributeCalldataSize, baseFeePerGas!)

    // Redemption Cost
    const encodedRedemptionData = await this._getEncodedGasInfo()
    const arbGasInfo = '0x000000000000000000000000000000000000006C'
    const redemptionTx = {
      to: arbGasInfo,
      data: encodedRedemptionData
    }
    const gasInfo = await provider.call(redemptionTx)
    const types = ['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256']
    const decoded = ethersUtils.defaultAbiCoder.decode(types, gasInfo)
    const redemptionGasPrice = decoded[1]
    const redemptionGasLimit = BigNumber.from(1980)
    const l1TransactionCost = ethersUtils.parseUnits('0.00015')
    const redemptionCost = redemptionGasLimit.mul(redemptionGasPrice).add(l1TransactionCost)

    // Distribution Cost
    const encodedDistributeData = await this._getEncodedDistributeData()
    const encodedEstimateRetryableTicketData = await this._getEncodedEstimateRetryableTicketData(encodedDistributeData)
    const nodeInterfaceAddress = '0x00000000000000000000000000000000000000C8'
    const distributionTx = {
      to: nodeInterfaceAddress,
      from: this._getBonderAddress(),
      data: encodedEstimateRetryableTicketData
    }
    const distributionGasLimit = await provider.estimateGas(distributionTx)
    const distributionGasPrice = await provider.getGasPrice()
    const distributionCost = distributionGasLimit.mul(distributionGasPrice)

    const totalCost = submissionCost.add(redemptionCost).add(distributionCost)
    return totalCost
  }

  private _calculateRetryableSubmissionFee (dataLength: number, baseFee: BigNumber): BigNumber {
    const dataCost: number = 1400 + 6 * dataLength
    return BigNumber.from(dataCost).mul(baseFee)
  }

  private async _getEncodedGasInfo (): Promise<string> {
    const abi = ['function getPricesInWei()']
    const ethersInterface = new ethersUtils.Interface(abi)
    const encodedData = ethersInterface.encodeFunctionData(
      'getPricesInWei', []
    )

    return encodedData
  }

  private async _getEncodedDistributeData (): Promise<string> {
    const recipient = constants.AddressZero
    const amount = BigNumber.from(10)
    const amountOutMin = BigNumber.from(0)
    const deadline = BigNumber.from(MaxDeadline)
    const relayer = this._getBonderAddress()
    const relayerFee = BigNumber.from(1)

    const abi = ['function distribute(address recipient, uint256 amount, uint256 amountOutMin, uint256 deadline, address relayer, uint256 relayerFee)']
    const ethersInterface = new ethersUtils.Interface(abi)
    const encodedData = ethersInterface.encodeFunctionData(
      'distribute', [
        recipient,
        amount,
        amountOutMin,
        deadline,
        relayer,
        relayerFee
      ]
    )

    return encodedData
  }

  private async _getEncodedEstimateRetryableTicketData (encodedDistributeData: string): Promise<string> {
    // The token has a negligible effect on the gas cost, so we can use any token
    const token = 'USDC'
    const messengerWrapperAddress = this._getMessengerWrapperAddress(token)
    const sender = messengerWrapperAddress
    const deposit = BigNumber.from(0)
    const to = this._getL2BridgeAddress(token)
    const l2CallValue = BigNumber.from(0)
    const excessFeeRefundAddress = constants.AddressZero
    const callValueRefundAddress = constants.AddressZero
    const data = encodedDistributeData

    const abi = ['function estimateRetryableTicket(address sender, uint256 deposit, address to, uint256 l2CallValue, address excessFeeRefundAddress, address callValueRefundAddress, bytes data)']
    const ethersInterface = new ethersUtils.Interface(abi)
    const encodedData = ethersInterface.encodeFunctionData(
      'estimateRetryableTicket', [
        sender,
        deposit,
        to,
        l2CallValue,
        excessFeeRefundAddress,
        callValueRefundAddress,
        data
      ]
    )

    return encodedData
  }

  private _getMessengerWrapperAddress (token: string): string {
    const messengerWrapperAddress = globalConfig?.addresses?.[token]?.[Chain.Arbitrum]?.l1MessengerWrapper
    if (!messengerWrapperAddress) {
      throw new Error('messengerWrapperAddress not found')
    }
    return messengerWrapperAddress
  }

  private _getL2BridgeAddress (token: string): string {
    const l2BridgeAddress = globalConfig?.addresses?.[token]?.[Chain.Arbitrum]?.l2Bridge
    if (!l2BridgeAddress) {
      throw new Error('l2BridgeAddress not found')
    }
    return l2BridgeAddress
  }

  private _getBonderAddress (): string {
    // The bonder is the same for every route, so the final parameter can be any chain
    const token = 'USDC'
    const bonderAddress = globalConfig?.bonders?.[token]?.[Chain.Arbitrum]?.[Chain.Ethereum]
    if (!bonderAddress) {
      throw new Error('bonderAddress not found')
    }
    return bonderAddress
  }
}
