pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../interfaces/IGlobalInbox.sol";

interface ILayerWrapper {
    function sendMessageToL2(bytes calldata _calldata) external;
}
