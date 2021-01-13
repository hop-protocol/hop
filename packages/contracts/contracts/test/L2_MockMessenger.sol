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
        // TODO
    }

    /* ========== Optimism ========== */

    function xDomainTransfer(address _recipient, uint256 _amount, address _target) public {
        canonicalToken.safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory transferMessage = abi.encodeWithSignature(
            "mint(address,uint256)",
            _recipient,
            _amount
        );

        targetMessenger.receiveMessage(
            _target,
            transferMessage
        );
    }

    function xDomainRelease(address _recipient, uint256 _amount) public {
        canonicalToken.safeTransfer(_recipient, _amount);
    }
}
