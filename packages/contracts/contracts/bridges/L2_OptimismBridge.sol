// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/IL2_OptimismMessenger.sol";
import "./L2_Bridge.sol";

contract L2_OptimismBridge is L2_Bridge {
    IL2_OptimismMessenger public messenger;

    constructor (
        IL2_OptimismMessenger _messenger,
        address _l1Governance,
        IERC20 _canonicalToken,
        address _l1BridgeAddress,
        uint256[] memory _supportedChainIds,
        address committee_
    )
        public
        L2_Bridge(_l1Governance, _canonicalToken, _l1BridgeAddress, _supportedChainIds, committee_)
    {
        messenger = _messenger;
    }

    function _sendCrossDomainMessage(bytes memory _message) internal override {
        // TODO
    }

    function _verifySender(address _expectedSender) internal override {
        // ToDo: verify sender with Optimism L2 messenger
        // sender should be l1BridgeAddress
    }
}
