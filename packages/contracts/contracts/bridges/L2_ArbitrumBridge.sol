pragma solidity 0.6.12;

import "./L2_Bridge.sol";

contract L2_ArbitrumBridge is L2_Bridge {
    string constant LAYER_NAME = "arbitrum";
    mockOVM_CrossDomainMessenger public messenger;

    constructor (mockOVM_CrossDomainMessenger _messenger) public L2_Bridge() {
        messenger = _messenger;
    }

    function getLayerId() public override returns (bytes32) {
        return getMessengerId(LAYER_NAME);
    }

    function _sendMessageToL1Bridge(bytes memory _message) internal override {
        // TODO: Add the Arbitrum-specific messaging
    }
}
