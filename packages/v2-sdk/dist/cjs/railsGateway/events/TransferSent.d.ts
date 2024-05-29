import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers';
import { Event, EventBase } from '#events/index.js';
export interface TransferSent extends EventBase {
    pathId: string;
    transferId: string;
    checkpoint: string;
    to: string;
    amount: BigNumber;
    attestationFee: BigNumber;
    totalSent: BigNumber;
    nonce: BigNumber;
    attestedCheckpoint: string;
}
export declare class TransferSentEventFetcher extends Event<TransferSent> {
    eventName: string;
    getFilter(): EventFilter;
    getPathIdFilter(pathId: string): EventFilter;
    getTransferIdFilter(transferId: string): EventFilter;
    getCheckpointFilter(checkpoint: string): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): TransferSent;
}
//# sourceMappingURL=TransferSent.d.ts.map