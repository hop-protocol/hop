// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/arbitrum/messengers/IGlobalInbox.sol";
import "./MessengerWrapper.sol";

contract ArbitrumMessengerWrapper is MessengerWrapper {

    IGlobalInbox public l1MessengerAddress;
    address public arbChain;
    byte public defaultSubMessageType;
    uint256 public defaultGasPrice;
    uint256 public defaultCallValue;

    function setL1MessengerAddress(IGlobalInbox _l1MessengerAddress) public {
        l1MessengerAddress = _l1MessengerAddress;
    }

    function setArbChain(address _arbChain) public {
        arbChain = _arbChain;
    }

    function setDefaultSubMessageType(byte _defaultSubMessageType) public {
        defaultSubMessageType = _defaultSubMessageType;
    }

    function setDefaultGasPrice(uint256 _defaultGasPrice) public {
        defaultGasPrice = _defaultGasPrice;
    }

    function setDefaultCallValue(uint256 _defaultCallValue) public {
        defaultCallValue = _defaultCallValue;
    }

    function sendCrossDomainMessage(bytes memory _calldata) public override {
        bytes memory subMessageWithoutData = abi.encode(
            defaultGasLimit,
            defaultGasPrice,
            uint256(l2BridgeAddress),
            defaultCallValue
        );
        bytes memory subMessage = abi.encodePacked(
            subMessageWithoutData,
            _calldata
        );
        bytes memory prefixedSubMessage = abi.encodePacked(
            defaultSubMessageType,
            subMessage
        );
        l1MessengerAddress.sendL2Message(
            arbChain,
            prefixedSubMessage
        );
    }

    function verifySender(bytes memory _data) public override {
        // ToDo: Verify sender with Arbitrum L1 messenger
        // Verify that sender is l2BridgeAddress
    }
}
