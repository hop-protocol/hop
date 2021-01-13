// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

interface IMessengerWrapper {
    function l2BridgeAddress() external view returns (address);
    function defaultGasLimit() external view returns (uint256);

    function setL2BridgeAddress(address _l2BridgeAddress) external;
    function setDefaultGasLimit(uint256 _defaultGasLimit) external;

    function sendCrossDomainMessage(bytes memory _calldata) external;
    function verifySender(bytes memory _data) external;
}
