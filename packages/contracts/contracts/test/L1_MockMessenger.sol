// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./MockMessenger.sol";
import "./L2_MockMessenger.sol";

contract L1_MockMessenger is MockMessenger {

    L2_MockMessenger public targetMessenger;

    constructor (IERC20 _canonicalToken) public MockMessenger(_canonicalToken) {}

    function setTargetMessenger(address _targetMessenger) public {
        targetMessenger = L2_MockMessenger(_targetMessenger);
    }

    /* ========== Arbitrum ========== */

    function sendL2Message(
        address _arbChain,
        bytes memory _message
    )
        public
    {
        (address decodedTarget, bytes memory decodedMessage) = decodeMessage(_message);

        targetMessenger.receiveMessage(
            decodedTarget,
            decodedMessage
        );
    }

    function decodeMessage(bytes memory _message) internal pure returns (address, bytes memory) {
        uint256 targetAddressStart = 77; // 154 / 2
        uint256 targetAddressLength = 20; // 40 / 2
        bytes memory decodedTargetBytes = _message.slice(targetAddressStart, targetAddressLength);
        address decodedTarget;
        assembly {
            decodedTarget := mload(add(decodedTargetBytes,20))
        }

        uint256 mintLength;
        uint256 mintStart = 129;
        uint256 expectedMintMessageLength = 197;
        if (_message.length == expectedMintMessageLength) {
            mintLength = 68; // mint(address,uint256) = 136/2
        } else {
            mintLength = 132; // mintAndAttemptSwap(address,uint256,uint256,uint256) = 264/2
        }

        bytes memory decodedMessage = _message.slice(mintStart, mintLength);

        return (decodedTarget, decodedMessage);
    }

    /* ========== Optimism ========== */

    function sendMessage(
        address _target,
        bytes calldata _message,
        uint32 _gasLimit
    )
        public
    {
        targetMessenger.receiveMessage(
            _target,
            _message
        );
    }

    // TODO: I believe this should go in L2_MockMessenger
    function xDomainRelease(address _recipient, uint256 _amount) public {
        canonicalToken.safeTransfer(_recipient, _amount);
    }

    /* ========== Chain Agnostic ========== */

    /// @dev This function is L2 agnostic and should be used only during testing
    /// @dev when sending tokens over the canonical bridge.
    /// @dev This basically replaces the canonical bridge.
    function sendMessageFromL1Bridge(
        address _target,
        address _recipient,
        uint256 _amount
    )
        public
    {
        bytes memory mintCalldata = abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount);

        canonicalToken.safeTransferFrom(msg.sender, address(this), _amount);
        targetMessenger.receiveMessage(
            _target,
            mintCalldata
        );
    }
}
