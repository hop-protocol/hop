// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../bridges/Accounting.sol";

contract Mock_Accounting is Accounting {
    constructor(address bonder_) public Accounting(bonder_) {}

    function _transferFromBridge(address _recipient, uint256 _amount) internal override {}
    function _transferToBridge(address _from, uint256 _amount) internal override {}
}
