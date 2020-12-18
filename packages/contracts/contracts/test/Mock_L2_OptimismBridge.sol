pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../bridges/L2_OptimismBridge.sol";

contract Mock_L2_OptimismBridge is L2_OptimismBridge {
    uint256 private _chainId;

    constructor (
        uint256 chainId_,
        mockOVM_CrossDomainMessenger _messenger,
        IERC20 _canonicalToken,
        address _committee
    )
        public
        L2_OptimismBridge(_messenger, _canonicalToken, _committee)
    {
        _chainId = chainId_;
    }

    function getChainId() public override view returns (uint256) {
        return _chainId;
    }
}
