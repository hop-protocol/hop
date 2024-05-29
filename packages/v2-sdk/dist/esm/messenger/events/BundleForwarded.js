import { Event } from '#events/index.js';
import { ethers } from 'ethers';
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js';
export class BundleForwardedEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleForwarded';
    }
    getFilter() {
        const hubMessageBridge = HubMessageBridge__factory.connect(this.address, this.provider);
        const filter = hubMessageBridge.filters.BundleForwarded();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(HubMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const bundleId = decoded.args.bundleId.toString();
        const bundleRoot = decoded.args.bundleRoot.toString();
        const fromChainId = decoded.args.fromChainId.toString();
        const toChainId = decoded.args.toChainId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            bundleId,
            bundleRoot,
            fromChainId,
            toChainId
        };
    }
}
//# sourceMappingURL=BundleForwarded.js.map