"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferBondedEventFetcher = void 0;
const ethers_1 = require("ethers");
const index_js_1 = require("#events/index.js");
const RailsGateway__factory_js_1 = require("#contracts/factories/RailsGateway__factory.js");
class TransferBondedEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'TransferBonded';
    }
    getFilter() {
        const railsGateway = RailsGateway__factory_js_1.RailsGateway__factory.connect(this.address, this.provider);
        const filter = railsGateway.filters.TransferBonded();
        return filter;
    }
    getPathIdFilter(pathId) {
        const railsGateway = RailsGateway__factory_js_1.RailsGateway__factory.connect(this.address, this.provider);
        const filter = railsGateway.filters.TransferBonded(pathId);
        return filter;
    }
    getTransferIdFilter(transferId) {
        const railsGateway = RailsGateway__factory_js_1.RailsGateway__factory.connect(this.address, this.provider);
        // TODO: currently transferId is not indexed by contract, so this doesn't work
        const filter = railsGateway.filters.TransferBonded(transferId);
        return filter;
    }
    getCheckpointFilter(checkpoint) {
        const railsGateway = RailsGateway__factory_js_1.RailsGateway__factory.connect(this.address, this.provider);
        const filter = railsGateway.filters.TransferBonded(null, null, checkpoint);
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(RailsGateway__factory_js_1.RailsGateway__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const pathId = decoded.args.pathId.toString();
        const transferId = decoded.args.transferId.toString();
        const checkpoint = decoded.args.checkpoint.toString();
        const to = decoded.args.to;
        const amountOut = decoded.args.amountOut;
        const totalSent = decoded.args.totalSent;
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            pathId,
            transferId,
            checkpoint,
            to,
            amountOut,
            totalSent
        };
    }
}
exports.TransferBondedEventFetcher = TransferBondedEventFetcher;
//# sourceMappingURL=TransferBonded.js.map