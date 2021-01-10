// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./L2_MockMessenger.sol";
import "./BytesLib.sol";

contract L1_MockMessenger {
    using SafeERC20 for IERC20;
    using BytesLib for bytes;

    struct Message {
        address target;
        bytes message;
    }

    Message public nextMessage;
    IERC20 public canonicalToken;
    L2_MockMessenger public targetMessenger;

    constructor(IERC20 _canonicalToken) public {
        canonicalToken = _canonicalToken;
    }

    function setTargetMessenger(address _targetMessenger) public {
        targetMessenger = L2_MockMessenger(_targetMessenger);
    }

    function sendMessage(
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

    function relayNextMessage() public {
        nextMessage.target.call(nextMessage.message);
    }

    /* ========== Arbitrum ========== */

    function sendL2Message(
        address _arbChain,
        bytes memory _message
    )
        public
    {
        (address decodedTarget, bytes memory decodedMessage) = decodeMessage(_message);

        targetMessenger.sendMessage(
            decodedTarget,
            decodedMessage
        );
    }

    function decodeMessage(bytes memory _message) internal pure returns (address, bytes memory) {
        uint256 targetAddressStart = 77; // 154 / 2
        uint256 targetAddressLength = 20; // 40 / 2
        bytes memory decodedTargetBytes = _message.slice(targetAddressStart, targetAddressLength);
        address decodedTarget;
        assembly {
            decodedTarget := mload(add(decodedTargetBytes,20))
        }

        uint256 mintStart = 129;
        uint256 mintLength = 68; // mint = 136 / 2
        // uint256 mintLength = 132; // mint = 264 / 2
        bytes memory decodedMessage = _message.slice(mintStart, mintLength);

        return (decodedTarget, decodedMessage);
    }

    /* ========== Optimism ========== */

    // TODO: We might have to take _target out in order to mimic Optimism
    function xDomainTransfer(address _recipient, uint256 _amount, address _target) public {
        canonicalToken.safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory message = abi.encodeWithSignature(
            "mint(address,uint256)",
            _recipient,
            _amount
        );

        targetMessenger.sendMessage(
            _target,
            message
        );
    }

    // TODO: I believe this should go in L2_MockMessenger
    function xDomainRelease(address _recipient, uint256 _amount) public {
        canonicalToken.safeTransfer(_recipient, _amount);
    }
}
