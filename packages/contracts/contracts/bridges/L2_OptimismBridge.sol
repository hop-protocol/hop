pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./L2_Bridge.sol";

contract L2_OptimismBridge is L2_Bridge {
    mockOVM_CrossDomainMessenger public messenger;

    constructor (
        mockOVM_CrossDomainMessenger _messenger,
        IERC20 canonicalToken_,
        address committee_
    )
        public
        L2_Bridge(canonicalToken_, committee_)
    {
        messenger = _messenger;
    }

    function _sendCrossDomainMessage(bytes memory _message) internal override {
        messenger.sendMessage(
            l1BridgeAddress,
            _message,
            200000
        );
    }

    function _verifySender() internal override {
        // ToDo: verify sender with Optimism L2 messenger
        // sender should be l1BridgeAddress
    }
}
