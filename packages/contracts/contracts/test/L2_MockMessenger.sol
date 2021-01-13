// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./MockMessenger.sol";
import "./L1_MockMessenger.sol";

contract L2_MockMessenger is MockMessenger {

    L1_MockMessenger public targetMessenger;

    constructor (IERC20 _canonicalToken) public MockMessenger(_canonicalToken) {}

    function setTargetMessenger(address _targetMessenger) public {
        targetMessenger = L1_MockMessenger(_targetMessenger);
    }

    /* ========== Arbitrum ========== */

    function sendL2Message(
        address _arbChain,
        bytes memory _message
    )
        public
    {
        // TODO: This whole function should be revisited
    }

    /* ========== Optimism ========== */

    function xDomainTransfer(
        address _recipient,
        uint256 _amount,
        address _target
    )
        public
    {
        // TODO: This whole function should be revisited
    }

    function xDomainRelease(address _recipient, uint256 _amount) public {
        // TODO: This whole function should be revisited
    }
}
