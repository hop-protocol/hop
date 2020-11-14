pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";
import "./mockOVM_CrossDomainMessenger.sol";

contract L2_OVMTokenBridge is ERC20 {
    address l1BridgeAddress;
    mockOVM_CrossDomainMessenger canonicalBridge;

    constructor(mockOVM_CrossDomainMessenger _canonicalBridge) public ERC20('OVM DAI', "ODAI") {
        canonicalBridge = _canonicalBridge;
    }

    function setCrossDomainBridgeAddress(address _l1BridgeAddress) public {
        l1BridgeAddress = _l1BridgeAddress;
    }

    function xDomainTransfer(address _recipient, uint256 _amount) public {
        _transfer(msg.sender, address(this), _amount);

        bytes memory l1TransferMessage = abi.encodeWithSignature(
            "xDomainRelease(address,uint256)",
            _recipient,
            _amount
        );

        canonicalBridge.sendMessage(
            l1BridgeAddress,
            l1TransferMessage,
            200000
        );
    }

    function xDomainMint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }
}