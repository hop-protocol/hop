// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../bridges/L2_OptimismBridge.sol";

contract Mock_L2_OptimismBridge is L2_OptimismBridge {
    uint256 private _chainId;

    constructor (
        uint256 chainId_,
        iOVM_L2CrossDomainMessenger _messenger,
        address _l1Governance,
        IERC20 _canonicalToken,
        address _l1BridgeAddress,
        uint256[] memory _supportedChainIds,
        address _committee
    )
        public
        L2_OptimismBridge(_messenger, _l1Governance, _canonicalToken, _l1BridgeAddress, _supportedChainIds, _committee)
    {
        _chainId = chainId_;
    }

    function getChainId() public override view returns (uint256) {
        return _chainId;
    }
}
