// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

 interface IMessengerWrapper {
    function sendCrossDomainMessage(bytes calldata _calldata) external;
    function verifySender(bytes memory _data) external;
}
