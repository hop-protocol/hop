import { Base, BaseConfig } from '#common/index.js'
import { BigNumberish, BigNumber, Signer, providers } from 'ethers'
import { HubERC5164ConnectorFactory__factory } from '#contracts/factories/HubERC5164ConnectorFactory__factory.js'
import { formatEther, formatUnits, getAddress, parseEther } from 'ethers/lib/utils.js'

export type ConnectTargetsInput = {
  hubChainId: number
  spokeChainId: number
  target1: string
  target2: string
  signer: Signer
}

export type HubConnectorConfig = BaseConfig & {}

export class HubConnector extends Base {
  constructor (config: HubConnectorConfig) {
    super(config)
  }

  get populateTransaction() {
    return {
      connectTargets: async (input: ConnectTargetsInput): Promise<providers.TransactionRequest> => {
        const { hubChainId, spokeChainId, target1, target2 } = input
        const provider = this.getProviderForChainId(hubChainId)
        if (!provider) {
          throw new Error(`Provider not found for chainId: ${hubChainId}`)
        }
        const address = await this.getHubConnectorContractAddress(hubChainId)
        const signer = await this.getSignerOrProvider(hubChainId)
        const factory = HubERC5164ConnectorFactory__factory.connect(address, signer)
        const txData = await (factory as any).populateTransaction.deployConnectors(hubChainId, target1, spokeChainId, target2)

        return {
          ...txData,
          chainId: hubChainId
        }
      }
    }
  }

  // used by connector demo
  async connectTargets (input: ConnectTargetsInput): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.connectTargets(input)
    const tx = await this.sendTransaction(txData)
    return tx
  }

  async getConnectorAddressFromTx (tx: providers.TransactionResponse): Promise<string> {
    const receipt = await tx.wait()
    return this.getConnectorAddressFromReceipt(receipt)
  }

  async getConnectorAddressFromReceipt (receipt: any): Promise<string> {
    const event = receipt.events?.find(
      (event: any) => event.event === 'ConnectorDeployed'
    )
    const connectorAddress = getAddress(event?.args?.connector)
    return connectorAddress
  }

  async getHubConnectorContractAddress (chainId: BigNumberish): Promise<string> {
    return this.getConfigAddress(chainId, 'hubConnectorFactory')
  }
}
