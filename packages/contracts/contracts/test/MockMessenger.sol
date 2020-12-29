// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./BytesLib.sol";

contract MockMessenger {
    using BytesLib for bytes;

    struct Message {
        address arbChain;
        bytes message;
    }

    Message public nextMessage;
    MockMessenger public targetMessengerAddress;
    address public targetBridgeAddress;

    function setTargetBridgeAddress(address _targetBridgeAddress) public {
        targetBridgeAddress = _targetBridgeAddress;
    }

    function setTargetMessengerAddress(MockMessenger _targetMessengerAddress) public {
        targetMessengerAddress = _targetMessengerAddress;
    }

    function sendL2Message(
        address _arbChain,
        bytes memory _message
    )
        public
    {
        bytes memory _messageCalldata = decodeMessage(_message);
        bytes memory setMessageData = abi.encodeWithSignature("setMessage(address,bytes)", _arbChain, _messageCalldata);
        address(targetMessengerAddress).call(setMessageData);
    }

    function setMessage(
        address _arbChain,
        bytes memory _message
    )
        public
    {
        nextMessage = Message(
            _arbChain,
            _message
        );
    }

    function relayNextMessage() public {
        targetBridgeAddress.call(nextMessage.message);
    }

    function decodeMessage(bytes memory _message) public pure returns (bytes memory) {
        uint256 mintStart = 129;
        uint256 mintLength = 68;
        return _message.slice(mintStart, mintLength);
    }
}
