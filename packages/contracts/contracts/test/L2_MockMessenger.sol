// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./L1_MockMessenger.sol";
import "./BytesLib.sol";

contract L2_MockMessenger {
    using SafeERC20 for IERC20;
    using BytesLib for bytes;

    struct Message {
        address target;
        bytes message;
    }

    Message public nextMessage;
    IERC20 public canonicalToken;
    L1_MockMessenger public targetMessenger;

    constructor(IERC20 _canonicalToken) public {
        canonicalToken = _canonicalToken;
    }

    function setTargetMessenger(address _targetMessenger) public {
        targetMessenger = L1_MockMessenger(_targetMessenger);
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
        // bytes memory _messageCalldata = decodeMessage(_message);
        // bytes memory setMessageData = abi.encodeWithSignature("setMessage(address,bytes)", _arbChain, _messageCalldata);
        // address(targetMessengerAddress).call(setMessageData);
        // targetMessenger.sendMessage(
        //     targetBridgeAddress,
        //     _messageCalldata
        // );
    }

    /* ========== Optimism ========== */

    function xDomainTransfer(address _recipient, uint256 _amount, address _target) public {
        canonicalToken.safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory transferMessage = abi.encodeWithSignature(
            "mint(address,uint256)",
            _recipient,
            _amount
        );

        targetMessenger.sendMessage(
            _target,
            transferMessage
        );
    }

    function xDomainRelease(address _recipient, uint256 _amount) public {
        canonicalToken.safeTransfer(_recipient, _amount);
    }
}
