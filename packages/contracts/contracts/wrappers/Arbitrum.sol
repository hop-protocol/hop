pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "../interfaces/IGlobalInbox.sol";

contract Arbitrum {

    address public arbChain;
    address public l2BridgeAddress;
    uint256 public defaultGasLimit;
    uint256 public defaultGasPrice;
    uint256 public defaultCallValue;
    byte  public defaultSubMessageType;
    IGlobalInbox public l1MessengerAddress;

    function setL1MessengerAddress(IGlobalInbox _l1MessengerAddress) public {
        l1MessengerAddress = _l1MessengerAddress;
    }

    function setArbChain(address _arbChain) public {
        arbChain = _arbChain;
    }

    function setL2BridgeAddress(address _l2BridgeAddress) public {
        l2BridgeAddress = _l2BridgeAddress;
    }

    function setDefaultGasLimit(uint256 _defaultGasLimit) public {
        defaultGasLimit = _defaultGasLimit;
    }

    function setDefaultGasPrice(uint256 _defaultGasPrice) public {
        defaultGasPrice = _defaultGasPrice;
    }

    function setDefaultCallValue(uint256 _defaultCallValue) public {
        defaultCallValue = _defaultCallValue;
    }

    function setDefaultSubMessageType(byte _defaultSubMessageType) public {
        defaultSubMessageType = _defaultSubMessageType;
    }

    function sendMessageToL2(bytes memory _calldata) public {
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
}
