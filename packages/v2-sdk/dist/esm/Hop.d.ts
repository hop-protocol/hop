import { Base } from '#common/index.js';
import { BigNumberish, Signer, providers, Event as EthersEvent } from 'ethers';
import { EventFetcher } from '#events/index.js';
import { GasPriceOracle } from '#gasPriceOracle/index.js';
import { Messenger } from '#messenger/index.js';
import { HubConnector, ConnectTargetsInput } from '#hubConnector/index.js';
import { RailsGateway, GetPathInfoInput, Path } from '#railsGateway/index.js';
import { Nft } from '#nft/index.js';
import { Addresses } from '#addresses/types.js';
export type HopConstructorInput = {
    network: string;
    batchBlocks?: number;
    signer?: Signer;
    contractAddresses?: Addresses;
};
export type GetEventsInput = {
    chainId: BigNumberish;
    fromBlock: number;
    toBlock?: number;
};
export type GetGeneralEventsInput = {
    eventName?: string;
    eventNames?: string[];
    chainId: BigNumberish;
    fromBlock: number;
    toBlock?: number;
};
export type SendTokensInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    fromToken: string;
    toToken: string;
    to: string;
    amount: BigNumberish;
    minAmountOut: BigNumberish;
};
export type ApproveSendTokensInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    fromToken: string;
    toToken: string;
    amount: BigNumberish;
};
export declare class Hop extends Base {
    eventFetcher: EventFetcher;
    batchBlocks: number;
    providers: Record<string, providers.Provider>;
    gasPriceOracle: GasPriceOracle;
    messenger: Messenger;
    railsGateway: RailsGateway;
    nft: Nft;
    hubConnector: HubConnector;
    constructor(options?: HopConstructorInput);
    connect(signer: Signer): Hop;
    get version(): string;
    getSupportedChainIds(): number[];
    getHubConnectorContractAddress(chainId: BigNumberish): string;
    getRailsGatewayContractAddress(chainId: BigNumberish): string;
    getNftBridgeContractAddress(chainId: BigNumberish): string;
    get populateTransaction(): {
        sendTokens: (input: SendTokensInput) => Promise<providers.TransactionRequest>;
        approveSendTokens: (input: ApproveSendTokensInput) => Promise<providers.TransactionRequest>;
    };
    sendTokens(input: SendTokensInput): Promise<providers.TransactionResponse>;
    approveSendTokens(input: ApproveSendTokensInput): Promise<providers.TransactionResponse>;
    getNeedsApprovalForSendTokens(input: ApproveSendTokensInput): Promise<boolean>;
    getPathInfo(input: GetPathInfoInput): Promise<Path>;
    connectTargets(input: ConnectTargetsInput): Promise<{
        tx: providers.TransactionResponse;
        connectorAddress: string;
    }>;
    switchChain(chainId: BigNumberish): Promise<void>;
    getEvents(input: GetGeneralEventsInput): Promise<EthersEvent[]>;
    getEventNames(): string[];
}
//# sourceMappingURL=Hop.d.ts.map