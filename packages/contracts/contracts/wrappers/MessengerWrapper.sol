// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/IMessengerWrapper.sol";

abstract contract MessengerWrapper is IMessengerWrapper {

    address public override l2BridgeAddress;
    uint256 public override defaultGasLimit;

    function setL2BridgeAddress(address _l2BridgeAddress) public override {
        l2BridgeAddress = _l2BridgeAddress;
    }

    function setDefaultGasLimit(uint256 _defaultGasLimit) public override {
        defaultGasLimit = _defaultGasLimit;
    }
}
