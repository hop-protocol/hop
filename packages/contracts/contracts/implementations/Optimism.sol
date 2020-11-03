pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../test/mockOVM_CrossDomainMessenger.sol";

contract Optimism {

    struct OptimismBridgeData {
        address l2BridgeAddress;
        uint256 defaultGasLimit;
    }

    OptimismBridgeData public optimismBridgeData;

    function setOptimismBridgeData (OptimismBridgeData memory _newData) public {
        optimismBridgeData = _newData;
    }

    function _sendToOptimism(address _chainMessenger, bytes memory mintCalldata) internal {
        mockOVM_CrossDomainMessenger optimismMessenger = mockOVM_CrossDomainMessenger(_chainMessenger);
        optimismMessenger.sendMessage(
            optimismBridgeData.l2BridgeAddress,
            mintCalldata,
            uint32(optimismBridgeData.defaultGasLimit)
        );
    }
}
