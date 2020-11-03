pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/IGlobalInbox.sol";

contract Arbitrum {

    struct ArbitrumBridgeData {
        address arbChain;
        address l2BridgeAddress;
        uint256 defaultGasLimit;
        uint256 defaultGasPrice;
        uint256 defaultCallValue;
        byte    defaultSubMessageType;
    }

    ArbitrumBridgeData public arbitrumBridgeData;

    function setArbitrumBridgeData (ArbitrumBridgeData memory _newData) public {
        arbitrumBridgeData = _newData;
    }

    function _sendToArbitrum(address _chainMessenger, bytes memory mintCalldata) internal {
        IGlobalInbox messenger = IGlobalInbox(_chainMessenger);
        bytes memory subMessageWithoutData = abi.encode(
            arbitrumBridgeData.defaultGasLimit,
            arbitrumBridgeData.defaultGasPrice,
            uint256(arbitrumBridgeData.l2BridgeAddress),
            arbitrumBridgeData.defaultCallValue
        );
        bytes memory subMessage = abi.encodePacked(
            subMessageWithoutData,
            mintCalldata
        );
        bytes memory prefixedSubMessage = abi.encodePacked(
            arbitrumBridgeData.defaultSubMessageType,
            subMessage
        );
        messenger.sendL2Message(
            arbitrumBridgeData.arbChain,
            prefixedSubMessage
        );
    }
}
