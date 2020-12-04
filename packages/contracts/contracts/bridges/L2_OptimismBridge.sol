pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./L2_Bridge.sol";

contract L2_OptimismBridge is L2_Bridge {
    string constant LAYER_NAME = "optimism";
    mockOVM_CrossDomainMessenger public messenger;

    constructor (mockOVM_CrossDomainMessenger _messenger) public L2_Bridge() {
        messenger = _messenger;
    }

    function getLayerId() public override returns (bytes32) {
        return getMessengerId(LAYER_NAME);
    }

    function _sendMessageToL1Bridge(bytes memory _message) internal override {
        messenger.sendMessage(
            l1BridgeAddress,
            _message,
            200000
        );
    }
}
