import { ethers } from 'ethers';
import { Event } from '#events/index.js';
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js';
export class FeesSentToHubEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'FeesSentToHub';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.FeesSentToHub();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const amount = decoded.args.amount;
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            amount
        };
    }
}
//# sourceMappingURL=FeesSentToHub.js.map