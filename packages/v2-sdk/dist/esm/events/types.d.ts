import { BigNumberish } from 'ethers';
import { Event as EthersEvent } from 'ethers';
export type EventContext = {
    chainSlug: string;
    chainId: string;
    transactionHash: string;
    transactionIndex: number;
    logIndex: number;
    blockNumber: number;
    blockTimestamp: number;
    from: string;
    to: string;
    value: string;
    nonce: number;
    gasLimit: number;
    gasUsed: number;
    gasPrice: string;
    data: string;
};
export type EventBase = {
    eventName: string;
    eventLog?: EthersEvent;
    context?: EventContext;
};
export interface Filter {
    address?: string | string[];
    fromBlock?: BigNumberish;
    toBlock?: BigNumberish;
    topics?: Array<string | string[]>;
}
//# sourceMappingURL=types.d.ts.map