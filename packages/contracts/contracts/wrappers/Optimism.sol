pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../test/mockOVM_CrossDomainMessenger.sol";

contract Optimism {

    mockOVM_CrossDomainMessenger public l1MessengerAddress;
    address public l2BridgeAddress;
    uint256 public defaultGasLimit;

    function setL1MessengerAddress(mockOVM_CrossDomainMessenger _l1MessengerAddress) public {
        l1MessengerAddress = _l1MessengerAddress;
    }

    function setL2BridgeAddress(address _l2BridgeAddress) public {
        l2BridgeAddress = _l2BridgeAddress;
    }

    function setDefaultGasLimit(uint256 _defaultGasLimit) public {
        defaultGasLimit = _defaultGasLimit;
    }

    function sendMessageToL2(bytes memory _calldata) public {
        l1MessengerAddress.sendMessage(
            l2BridgeAddress,
            _calldata,
            uint32(defaultGasLimit)
        );
    }
}
