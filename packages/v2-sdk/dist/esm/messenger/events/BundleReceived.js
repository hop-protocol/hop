import { ethers } from 'ethers';
import { Event } from '#events/index.js';
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js';
export class BundleReceivedEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleReceived';
    }
    getFilter() {
        const hubMessageBridge = HubMessageBridge__factory.connect(this.address, this.provider);
        const filter = hubMessageBridge.filters.BundleReceived();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(HubMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const bundleId = decoded.args.bundleId.toString();
        const bundleRoot = decoded.args.bundleRoot.toString();
        const bundleFees = decoded.args.bundleFees;
        const fromChainId = decoded.args.fromChainId.toString();
        const toChainId = decoded.args.toChainId.toString();
        const relayWindowStart = Number(decoded.args.relayWindowStart.toString());
        const relayer = decoded.args.relayer.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            bundleId,
            bundleRoot,
            bundleFees,
            fromChainId,
            toChainId,
            relayWindowStart,
            relayer
        };
    }
}
//# sourceMappingURL=BundleReceived.js.map