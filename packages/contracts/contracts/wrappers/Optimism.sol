pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../test/mockOVM_CrossDomainMessenger.sol";

contract Optimism {

    mockOVM_CrossDomainMessenger public l1CanonicalBridgeBridgeAddress;
    address public l2BridgeAddress;
    uint256 public defaultGasLimit;

    function setL1CanonicalBridgeAddress(mockOVM_CrossDomainMessenger _l1CanonicalBridgeBridgeAddress) public {
        l1CanonicalBridgeBridgeAddress = _l1CanonicalBridgeBridgeAddress;
    }

    function setL2BridgeAddress(address _l2BridgeAddress) public {
        l2BridgeAddress = _l2BridgeAddress;
    }

    function setDefaultGasLimit(uint256 _defaultGasLimit) public {
        defaultGasLimit = _defaultGasLimit;
    }

    function sendMessageToL2(bytes memory _calldata) public {
        l1CanonicalBridgeBridgeAddress.sendMessage(
            l2BridgeAddress,
            _calldata,
            uint32(defaultGasLimit)
        );
    }
}
