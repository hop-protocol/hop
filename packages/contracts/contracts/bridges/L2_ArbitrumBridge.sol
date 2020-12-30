// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./L2_Bridge.sol";

contract L2_ArbitrumBridge is L2_Bridge {
    mockOVM_CrossDomainMessenger public messenger;

    constructor (
        mockOVM_CrossDomainMessenger _messenger,
        IERC20 _canonicalToken,
        address _l1BridgeAddress,
        uint256[] memory _supportedChainIds,
        address _committee
    )
        public
        L2_Bridge(_canonicalToken, _l1BridgeAddress, _supportedChainIds, _committee)
    {
        messenger = _messenger;
    }

    // ToDo: Pass in chainId
    function getChainId() public override view returns (uint256) {
        return 152709604825713;
    }

    function _sendCrossDomainMessage(bytes memory _message) internal override {
        // TODO: Add the Arbitrum-specific messaging
    }

    function _verifySender() internal override {
        // ToDo: verify sender with Arbitrum L2 messenger
        // sender should be l1BridgeAddress
    }
}
