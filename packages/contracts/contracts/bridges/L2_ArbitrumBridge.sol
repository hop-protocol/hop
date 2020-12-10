pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./L2_Bridge.sol";

contract L2_ArbitrumBridge is L2_Bridge {
    mockOVM_CrossDomainMessenger public messenger;

    constructor (mockOVM_CrossDomainMessenger _messenger) public L2_Bridge() {
        messenger = _messenger;
    }

    // ToDo: Pass in chainId
    function getChainId() public override pure returns (uint256) {
        return 152709604825713;
    }

    function _sendMessageToL1Bridge(bytes memory _message) internal override {
        // TODO: Add the Arbitrum-specific messaging
    }
}
