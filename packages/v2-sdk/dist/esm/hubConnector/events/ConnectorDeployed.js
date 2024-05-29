import { ethers } from 'ethers';
import { Event } from '#events/index.js';
import { HubERC5164ConnectorFactory__factory } from '#contracts/factories/HubERC5164ConnectorFactory__factory.js';
export class ConnectorDeployedEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'ConnectorDeployed';
    }
    getFilter() {
        const contract = HubERC5164ConnectorFactory__factory.connect(this.address, this.provider);
        const filter = contract.filters.ConnectorDeployed();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(HubERC5164ConnectorFactory__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const connector = decoded.args.connector.toString();
        const target = decoded.args.target.toString();
        const counterpartChainId = decoded.args.counterpartChainId.toString();
        const counterpartConnector = decoded.args.counterpartConnector.toString();
        const counterpartTarget = decoded.args.counterpartTarget.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            connector,
            target,
            counterpartChainId,
            counterpartConnector,
            counterpartTarget
        };
    }
}
//# sourceMappingURL=ConnectorDeployed.js.map