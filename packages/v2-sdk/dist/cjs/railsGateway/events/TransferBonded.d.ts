import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers';
import { Event, EventBase } from '#events/index.js';
export interface TransferBonded extends EventBase {
    pathId: string;
    transferId: string;
    checkpoint: string;
    to: string;
    amountOut: BigNumber;
    totalSent: BigNumber;
}
export declare class TransferBondedEventFetcher extends Event<TransferBonded> {
    eventName: string;
    getFilter(): EventFilter;
    getPathIdFilter(pathId: string): EventFilter;
    getTransferIdFilter(transferId: string): EventFilter;
    getCheckpointFilter(checkpoint: string): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): TransferBonded;
}
//# sourceMappingURL=TransferBonded.d.ts.map