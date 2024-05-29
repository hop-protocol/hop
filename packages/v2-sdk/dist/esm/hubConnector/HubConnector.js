import { Base } from '#common/index.js';
import { utils } from 'ethers';
import { HubERC5164ConnectorFactory__factory } from '#contracts/factories/HubERC5164ConnectorFactory__factory.js';
import { ConnectorDeployedEventFetcher } from '#hubConnector/events/ConnectorDeployed.js';
import { ConfigError, InputError } from '#error/index.js';
const { getAddress: checksumAddress } = utils;
export class HubConnector extends Base {
    constructor(config) {
        super(config);
        this.batchBlocks = 1000;
    }
    connect(signer) {
        return new HubConnector({ network: this.network, signer, contractAddresses: this.contractAddresses });
    }
    get populateTransaction() {
        return {
            connectTargets: async (input) => {
                const { hubChainId, spokeChainId, target1, target2 } = input;
                const provider = this.getRpcProviderForChainId(hubChainId);
                if (!provider) {
                    throw new ConfigError(`Provider not found for chainId: ${hubChainId}`);
                }
                const address = this.getHubConnectorContractAddress(hubChainId);
                const signer = await this.getSignerOrProvider(hubChainId);
                const factory = HubERC5164ConnectorFactory__factory.connect(address, signer);
                const txData = await factory.populateTransaction.deployConnectors(hubChainId, target1, spokeChainId, target2);
                return {
                    ...txData,
                    chainId: Number(hubChainId)
                };
            }
        };
    }
    // used by connector demo
    async connectTargets(input) {
        const txData = await this.populateTransaction.connectTargets(input);
        const tx = await this.sendTransaction(txData);
        return tx;
    }
    async getConnectorAddressFromTx(tx) {
        const receipt = await tx.wait();
        return this.getConnectorAddressFromReceipt(receipt);
    }
    async getConnectorAddressFromReceipt(receipt) {
        const event = receipt.events?.find((event) => event.event === 'ConnectorDeployed');
        const connectorAddress = checksumAddress(event?.args?.connector);
        return connectorAddress;
    }
    getHubConnectorContractAddress(chainId) {
        return this.getConfigAddress(chainId, 'hubConnectorFactory');
    }
    async getConnectorDeployedEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId: ${chainId}`);
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getHubConnectorContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new ConnectorDeployedEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
}
//# sourceMappingURL=HubConnector.js.map