pragma solidity 0.6.12;

import "./L2_Bridge.sol";

contract L2_ArbitrumBridge is L2_Bridge {

    constructor (mockOVM_CrossDomainMessenger _messenger) public L2_Bridge(_messenger) {}

    function commitTransfers() public {
        (bytes32 root, uint256 pendingAmount, bytes memory setTransferRootMessage) = commitTransfersPreHook();

        // TODO: Add the Arbitrum-specific messaging

        commitTransfersPostHook(root, pendingAmount);
    }
}
