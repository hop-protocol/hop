pragma solidity 0.6.12;

import "./interfaces/IGlobalInbox.sol";

contract Arbitrum GlobalInbox {

    struct ArbitrumBridgeData {
        address arbChain;
        address l2BridgeAddress;
        uint256 defaultGasLimit;
        uint256 defaultGasPrice;
        uint256 defaultCallValue;
        byte    defaultSubMessageType;
    }

    ArbitrumBridgeData public arbitrumBridgeData;

    function setArbitrumBridgeData (ArbitrumBridgeData _newData) public {
        arbitrumBridgeData = _newData;
    }

    function _sendToArbitrum(address _chainMessenger, bytes memory mintCalldata) internal {
        IGlobalInbox arbitrumMessenger = _chainMessenger;
        bytes memory subMessageWithoutData = abi.encode(
            arbitrumBridgeData.defaultGasLimit,
            arbitrumBridgeData.defaultGasPrice,
            uint256(arbitrumBridgeData.destinationAddress),
            arbitrumBridgeData.callValue
        );
        bytes memory subMessage = abi.encodePacked(
            subMessageWithoutData,
            mintCalldata
        );
        bytes memory prefixedSubMessage = abi.encodePacked(
            arbitrumBridgeData.subMessageType,
            subMessage
        );
        arbitrumMessenger.sendL2Message(
            arbChain,
            prefixedSubMessage
        );
    }
}
