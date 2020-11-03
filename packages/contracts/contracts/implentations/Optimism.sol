pragma solidity 0.6.12;

import "./test/mockOVM_CrossDomainMessenger.sol";

contract Optimism {

    struct OptimismBridgeData {
        address l2BridgeAddress;
        uint256 defaultGasLimit;
    }

    OptimismBridgeData public optimismBridgeData;

    function setOptimismBridgeData (OptimismBridgeData _newData) public {
        optimismBridgeData = _newData;
    }

    function _sendToOptimism(address _chainMessenger, bytes memory mintCalldata) internal {
        mockOVM_CrossDomainMessenger optimismMessenger = _chainMessenger;
        optimismMessenger.sendMessage(
            optimismBridgeData.l2BridgeAddress,
            mintCalldata,
            optimismBridgeData.gasLimit
        );
    }
}
