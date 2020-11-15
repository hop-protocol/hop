pragma solidity 0.6.12;

import "./L2_Bridge.sol";

contract L2_ArbitrumBridge is ERC20, L2_Bridge {

    constructor (mockOVM_CrossDomainMessenger _canonicalBridge) public L2_Bridge("DAI Liquidity Pool Token", "LDAI") {
        canonicalBridge = _canonicalBridge;
    }

    function commitTransfers() public {
        (bytes32 root, uint256 pendingAmount, bytes memory setTransferRootMessage) = commitTransfersPreHook();

        canonicalBridge.sendMessage(
            l1BridgeAddress,
            setTransferRootMessage,
            200000
        );

        commitTransfersPostHook(root, pendingAmount);
    }
}
