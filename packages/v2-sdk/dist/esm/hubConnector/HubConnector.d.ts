import { Base, BaseConfig } from '#common/index.js';
import { BigNumberish, Signer, providers, Event as EthersEvent } from 'ethers';
import { ConnectorDeployed } from '#hubConnector/events/ConnectorDeployed.js';
export type GetEventsInput = {
    chainId: BigNumberish;
    fromBlock: number;
    toBlock?: number;
};
export type ConnectTargetsInput = {
    hubChainId: BigNumberish;
    spokeChainId: BigNumberish;
    target1: string;
    target2: string;
};
type TransactionReceiptWithEvents = providers.TransactionReceipt & {
    events?: EthersEvent[];
};
export type HubConnectorConfig = BaseConfig;
export declare class HubConnector extends Base {
    batchBlocks: number;
    constructor(config: HubConnectorConfig);
    connect(signer: Signer): HubConnector;
    get populateTransaction(): {
        connectTargets: (input: ConnectTargetsInput) => Promise<providers.TransactionRequest>;
    };
    connectTargets(input: ConnectTargetsInput): Promise<providers.TransactionResponse>;
    getConnectorAddressFromTx(tx: providers.TransactionResponse): Promise<string>;
    getConnectorAddressFromReceipt(receipt: TransactionReceiptWithEvents): Promise<string>;
    getHubConnectorContractAddress(chainId: BigNumberish): string;
    getConnectorDeployedEvents(input: GetEventsInput): Promise<ConnectorDeployed[]>;
}
export {};
//# sourceMappingURL=HubConnector.d.ts.map