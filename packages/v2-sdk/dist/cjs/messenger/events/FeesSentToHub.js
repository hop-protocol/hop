"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesSentToHubEventFetcher = void 0;
const ethers_1 = require("ethers");
const index_js_1 = require("#events/index.js");
const SpokeMessageBridge__factory_js_1 = require("#contracts/factories/SpokeMessageBridge__factory.js");
class FeesSentToHubEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'FeesSentToHub';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.FeesSentToHub();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const amount = decoded.args.amount;
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            amount
        };
    }
}
exports.FeesSentToHubEventFetcher = FeesSentToHubEventFetcher;
//# sourceMappingURL=FeesSentToHub.js.map