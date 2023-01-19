import { BigNumber, constants, utils as ethersUtils } from 'ethers'
import { Chain } from '../models'
import { IRelayerFee } from './IRelayerFee'
import { MaxDeadline } from '../constants'
import { config } from '../config'
import { getProviderFromUrl } from '../utils/getProviderFromUrl'

export class ArbitrumRelayerFee implements IRelayerFee {
  network: string
  token: string
  chain: string

  constructor (network: string, token: string, chain: string) {
    this.network = network
    this.token = token
    this.chain = chain
  }

  async getRelayCost (): Promise<BigNumber> {
    const arbitrumRpcUrl = config.chains[this.network][this.chain].rpcUrl
    const provider = getProviderFromUrl(arbitrumRpcUrl)

    // Submission Cost
    const l1RpcUrl = config.chains[this.network][Chain.Ethereum.slug].rpcUrl
    const l1Provider = getProviderFromUrl(l1RpcUrl)
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
    const redemptionGasLimit = BigNumber.from(1000)
    const redemptionCost = redemptionGasLimit.mul(redemptionGasPrice)

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
    // Do not use the zero address since some ERC20 tokens throw when sending to the zero address
    const recipient = '0x0000000000000000000000000000000000000001'
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
    // The alias address on Arbitrum needs to have enough funds to cover the tx in order for this to work
    const messengerWrapperAddress = this._getMessengerWrapperAddress()
    const sender = messengerWrapperAddress
    const deposit = BigNumber.from(0)
    const to = this._getL2BridgeAddress()
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

  private _getMessengerWrapperAddress (): string {
    const messengerWrapperAddress = config?.addresses?.[this.network]?.[this.token]?.[this.chain]?.l1MessengerWrapper
    if (!messengerWrapperAddress) {
      throw new Error('messengerWrapperAddress not found')
    }
    return messengerWrapperAddress
  }

  private _getL2BridgeAddress (): string {
    const l2BridgeAddress = config?.addresses?.[this.network]?.[this.token]?.[this.chain]?.l2Bridge
    if (!l2BridgeAddress) {
      throw new Error('l2BridgeAddress not found')
    }
    return l2BridgeAddress
  }

  private _getBonderAddress (): string {
    const bonderAddress = config?.bonders?.[this.network]?.[this.token]?.[this.chain]?.[Chain.Ethereum.slug]
    if (!bonderAddress) {
      throw new Error('bonderAddress not found')
    }
    return bonderAddress
  }
}
