// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/IL1_OptimismMessenger.sol";

contract Optimism {
    IL1_OptimismMessenger public l1MessengerAddress;
    address public l2BridgeAddress;
    uint256 public defaultGasLimit;

    function setL1MessengerAddress(IL1_OptimismMessenger _l1MessengerAddress) public {
        l1MessengerAddress = _l1MessengerAddress;
    }

    function setL2BridgeAddress(address _l2BridgeAddress) public {
        l2BridgeAddress = _l2BridgeAddress;
    }

    function setDefaultGasLimit(uint256 _defaultGasLimit) public {
        defaultGasLimit = _defaultGasLimit;
    }

    function sendCrossDomainMessage(bytes memory _calldata) public {
        l1MessengerAddress.sendMessage(
            l2BridgeAddress,
            _calldata,
            uint32(defaultGasLimit)
        );
    }

    function verifySender(bytes memory _data) public {
        // ToDo: Verify sender with Optimism L1 messenger
        // Verify that sender is l2BridgeAddress
    }
}
