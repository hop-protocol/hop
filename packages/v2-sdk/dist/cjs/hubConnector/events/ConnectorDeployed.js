"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorDeployedEventFetcher = void 0;
const ethers_1 = require("ethers");
const index_js_1 = require("#events/index.js");
const HubERC5164ConnectorFactory__factory_js_1 = require("#contracts/factories/HubERC5164ConnectorFactory__factory.js");
class ConnectorDeployedEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'ConnectorDeployed';
    }
    getFilter() {
        const contract = HubERC5164ConnectorFactory__factory_js_1.HubERC5164ConnectorFactory__factory.connect(this.address, this.provider);
        const filter = contract.filters.ConnectorDeployed();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(HubERC5164ConnectorFactory__factory_js_1.HubERC5164ConnectorFactory__factory.abi);
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
exports.ConnectorDeployedEventFetcher = ConnectorDeployedEventFetcher;
//# sourceMappingURL=ConnectorDeployed.js.map