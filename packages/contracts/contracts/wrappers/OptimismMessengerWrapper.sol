// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/optimism/messengers/iOVM_L1CrossDomainMessenger.sol";
import "./MessengerWrapper.sol";

contract OptimismMessengerWrapper is MessengerWrapper {

    iOVM_L1CrossDomainMessenger public l1MessengerAddress;

    constructor(
        address _l1BridgeAddress,
        address _l2BridgeAddress,
        uint256 _defaultGasLimit,
        iOVM_L1CrossDomainMessenger _l1MessengerAddress
    )
        public
    {
        l1BridgeAddress = _l1BridgeAddress;
        l2BridgeAddress = _l2BridgeAddress;
        defaultGasLimit = _defaultGasLimit;
        l1MessengerAddress = _l1MessengerAddress;
    }

    function sendCrossDomainMessage(bytes memory _calldata) public override onlyL1Bridge {
        l1MessengerAddress.sendMessage(
            l2BridgeAddress,
            _calldata,
            uint32(defaultGasLimit)
        );
    }

    function verifySender(bytes memory _data) public override {
        // ToDo: Verify sender with Optimism L1 messenger
        // Verify that sender is l2BridgeAddress
    }
}
