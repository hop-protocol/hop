import { ethers } from 'ethers';
import { Event } from '#events/index.js';
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js';
export class TransferSentEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'TransferSent';
    }
    getFilter() {
        const railsGateway = RailsGateway__factory.connect(this.address, this.provider);
        const filter = railsGateway.filters.TransferSent();
        return filter;
    }
    getPathIdFilter(pathId) {
        const railsGateway = RailsGateway__factory.connect(this.address, this.provider);
        const filter = railsGateway.filters.TransferSent(pathId);
        return filter;
    }
    getTransferIdFilter(transferId) {
        const railsGateway = RailsGateway__factory.connect(this.address, this.provider);
        // TODO: currently transferId is not indexed by contract, so this doesn't work
        const filter = railsGateway.filters.TransferSent(transferId);
        return filter;
    }
    getCheckpointFilter(checkpoint) {
        const railsGateway = RailsGateway__factory.connect(this.address, this.provider);
        const filter = railsGateway.filters.TransferSent(null, null, checkpoint);
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(RailsGateway__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const pathId = decoded.args.pathId.toString();
        const transferId = decoded.args.transferId.toString();
        const checkpoint = decoded.args.checkpoint.toString();
        const to = decoded.args.to;
        const amount = decoded.args.amount;
        const attestationFee = decoded.args.attestationFee;
        const totalSent = decoded.args.totalSent;
        const nonce = decoded.args.nonce;
        const attestedCheckpoint = decoded.args.attestedCheckpoint.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            pathId,
            transferId,
            checkpoint,
            to,
            amount,
            attestationFee,
            totalSent,
            nonce,
            attestedCheckpoint
        };
    }
}
//# sourceMappingURL=TransferSent.js.map