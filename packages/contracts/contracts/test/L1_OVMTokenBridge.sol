pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./mockOVM_CrossDomainMessenger.sol";
import "./L2_OVMTokenBridge.sol";

contract L1_OVMTokenBridge {
    using SafeERC20 for IERC20;

    IERC20 token;
    mockOVM_CrossDomainMessenger messenger;
    address l2BridgeAddress;

    constructor(mockOVM_CrossDomainMessenger _messenger, IERC20 _token) public {
        messenger = _messenger;
        token = _token;
    }

    function setCrossDomainBridgeAddress(address _l2BridgeAddress) public {
        l2BridgeAddress = _l2BridgeAddress;
    }

    function xDomainTransfer(address _recipient, uint256 _amount) public {
        token.safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory l2TransferMessage = abi.encodeWithSignature(
            "xDomainMint(address,uint256)",
            _recipient,
            _amount
        );

        messenger.sendMessage(
            l2BridgeAddress,
            l2TransferMessage,
            200000
        );
    }

    function xDomainRelease(address _recipient, uint256 _amount) public {
        token.safeTransfer(_recipient, _amount);
    }
}
