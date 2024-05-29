import { Base, BaseConfig } from '#common/index.js';
import { providers, Signer, BigNumberish } from 'ethers';
import { ConfirmationSent } from '#nft/events/ConfirmationSent.js';
import { TokenConfirmed } from '#nft/events/TokenConfirmed.js';
import { TokenSent } from '#nft/events/TokenSent.js';
type GetEventsInput = {
    chainId: BigNumberish;
    fromBlock: number;
    toBlock?: number;
};
export type MintNftInput = {
    fromChainId: BigNumberish;
    contractAddress: string;
    recipient: string;
    tokenId: string;
};
export type ApproveNftInput = {
    fromChainId: BigNumberish;
    contractAddress: string;
    spender: string;
    tokenId: string;
};
export type MintNftWrapperInput = {
    nftBridgeAddress: string;
    wrapperTokenId: string;
    fromChainId: BigNumberish;
    serialNumber: string;
    supportedChains: number[];
    wrapperTokenIdNonce: number;
};
export type ReclaimNftWrapperInput = {
    nftBridgeAddress: string;
    nftTokenAddress: string;
    tokenId: string;
    fromChainId: BigNumberish;
    serialNumber: string;
    supportedChainIds: BigNumberish[];
    wrapperTokenIdNonce: number;
};
export type SendNftInput = {
    fromChainId: BigNumberish;
    nftBridgeAddress: string;
    contractAddress: string;
    tokenId: string;
    supportedChainIds: BigNumberish[];
    toChainId: BigNumberish;
    recipient: string;
    wrapperTokenIdNonce: number;
};
export type SendNftWrapperInput = {
    nftBridgeAddress: string;
    wrapperTokenId: string;
    fromChainId: BigNumberish;
    serialNumber: string;
    supportedChainIds: BigNumberish[];
    initialRecipient: string;
    toChainId: BigNumberish;
    recipient: string;
    wrapperTokenIdNonce: number;
};
export type GetNftMintPopulatedTxInput = {
    fromChainId: BigNumberish;
    toAddress: string;
    tokenId: string;
};
export type GetNftBurnPopulatedTxInput = {
    fromChainId: BigNumberish;
    tokenId: string;
};
export type GetNftSendPopulatedTxInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    toAddress: string;
    tokenId: string;
};
export type GetNftMintAndSendPopulatedTxInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    toAddress: string;
    tokenId: string;
};
export type GetNftConfirmPopulatedTxInput = {
    fromChainId: BigNumberish;
    tokenId: string;
};
export type NftConfig = BaseConfig;
export declare class Nft extends Base {
    batchBlocks: number;
    constructor(config: NftConfig);
    connect(signer: Signer): Nft;
    get populateTransaction(): {
        mintNft: (input: MintNftInput) => Promise<{
            to: string;
            data: string;
        }>;
        approveNft: (input: ApproveNftInput) => Promise<{
            to: string;
            data: string;
        }>;
    };
    mintNftWrapper(input: MintNftWrapperInput): {
        to: string;
        data: string;
    };
    reclaimNftWrapper(input: ReclaimNftWrapperInput): {
        to: string;
        data: string;
    };
    sendNft(input: SendNftInput): {
        to: string;
        data: string;
    };
    sendNftWrapper(input: SendNftWrapperInput): {
        to: string;
        data: string;
        value: string;
    };
    getNftConfirmationSentEvents(input: GetEventsInput): Promise<ConfirmationSent[]>;
    getNftTokenConfirmedEvents(input: GetEventsInput): Promise<TokenConfirmed[]>;
    getNftTokenSentEvents(input: GetEventsInput): Promise<TokenSent[]>;
    getNftBridgeContractAddress(chainId: BigNumberish): string;
    getNftMintPopulatedTx(input: GetNftMintPopulatedTxInput): Promise<providers.TransactionRequest>;
    getNftBurnPopulatedTx(input: GetNftBurnPopulatedTxInput): Promise<providers.TransactionRequest>;
    getNftSendPopulatedTx(input: GetNftSendPopulatedTxInput): Promise<providers.TransactionRequest>;
    getNftMintAndSendPopulatedTx(input: GetNftMintAndSendPopulatedTxInput): Promise<providers.TransactionRequest>;
    getNftConfirmPopulatedTx(input: GetNftConfirmPopulatedTxInput): Promise<providers.TransactionRequest>;
}
export {};
//# sourceMappingURL=Nft.d.ts.map