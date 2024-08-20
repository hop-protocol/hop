import { Base, BaseConfig } from '#common/index.js'
import { BigNumberish, Signer, providers, utils, Event as EthersEvent } from 'ethers'
import { HubERC5164ConnectorFactory__factory } from '#contracts/factories/HubERC5164ConnectorFactory__factory.js'
import { ConnectorDeployed, ConnectorDeployedEventFetcher } from '#hubConnector/events/ConnectorDeployed.js'
import { ConfigError, InputError } from '#error/index.js'

const { getAddress: checksumAddress } = utils

export type GetEventsInput = {
  chainId: BigNumberish
  fromBlock: number
  toBlock?: number
}

export type ConnectTargetsInput = {
  hubChainId: BigNumberish
  spokeChainId: BigNumberish
  target1: string
  target2: string
}

export type TransactionReceiptWithEvents = providers.TransactionReceipt & {
  events?: EthersEvent[]
}

export type HubConnectorConfig = BaseConfig

export class HubConnector extends Base {
  constructor (config: HubConnectorConfig) {
    super(config)
  }

  override connect (signer: Signer) {
    return new HubConnector({ network: this.network, signer, contractAddresses: this.contractAddresses })
  }

  get populateTransaction() {
    return {
      connectTargets: async ({ hubChainId, spokeChainId, target1, target2 }: ConnectTargetsInput): Promise<providers.TransactionRequest> => {
        const provider = this.getRpcProviderForChainId(hubChainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${hubChainId}`)
        }
        const address = this.getHubConnectorContractAddress(hubChainId)
        const signer = await this.getSignerOrProvider(hubChainId)
        const factory = HubERC5164ConnectorFactory__factory.connect(address, signer)
        const txData = await factory.populateTransaction.deployConnectors(hubChainId, target1, spokeChainId, target2)

        return {
          ...txData,
          chainId: Number(hubChainId)
        }
      }
    }
  }

  // used by connector demo
  async connectTargets (input: ConnectTargetsInput): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.connectTargets(input)
    return this.sendTransaction(txData)
  }

  async getConnectorAddressFromTx (tx: providers.TransactionResponse): Promise<string> {
    const receipt = await tx.wait()
    return this.getConnectorAddressFromReceipt(receipt)
  }

  async getConnectorAddressFromReceipt (receipt: TransactionReceiptWithEvents): Promise<string> {
    const event = receipt.events?.find(event => event.event === 'ConnectorDeployed')
    return checksumAddress(event?.args?.connector)
  }

  getHubConnectorContractAddress (chainId: BigNumberish): string {
    return this.getConfigAddress(chainId, 'hubConnectorFactory')
  }

  async getConnectorDeployedEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<ConnectorDeployed[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId: ${chainId}`)
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const address = this.getHubConnectorContractAddress(chainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }

    const eventFetcher = new ConnectorDeployedEventFetcher(provider, chainId, this.batchBlocks, address)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }
}
