// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/optimism/messengers/iOVM_L2CrossDomainMessenger.sol";
import "./L2_Bridge.sol";

contract L2_OptimismBridge is L2_Bridge {
    iOVM_L2CrossDomainMessenger public messenger;

    constructor (
        iOVM_L2CrossDomainMessenger _messenger,
        address _l1Governance,
        IERC20 _canonicalToken,
        address _l1BridgeAddress,
        uint256[] memory _supportedChainIds,
        address bonder_
    )
        public
        L2_Bridge(_l1Governance, _canonicalToken, _l1BridgeAddress, _supportedChainIds, bonder_)
    {
        messenger = _messenger;
    }

    function _sendCrossDomainMessage(bytes memory _message) internal override {
        // TODO: Add the Optimism-specific messaging
    }

    function _verifySender(address _expectedSender) internal override {
        // ToDo: verify sender with Optimism L2 messenger
        // sender should be l1BridgeAddress
    }
}
