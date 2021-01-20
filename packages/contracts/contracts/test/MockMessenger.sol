// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./BytesLib.sol";

abstract contract MockMessenger {
    using SafeERC20 for IERC20;
    using BytesLib for bytes;

    struct Message {
        address target;
        bytes message;
    }

    Message public nextMessage;
    IERC20 public canonicalToken;

    constructor(IERC20 _canonicalToken) public {
        canonicalToken = _canonicalToken;
    }

    function relayNextMessage() public {
        nextMessage.target.call(nextMessage.message);
    }

    function receiveMessage(
        address _target,
        bytes memory _message
    )
        public
    {
        nextMessage = Message(
            _target,
            _message
        );
    }
}
