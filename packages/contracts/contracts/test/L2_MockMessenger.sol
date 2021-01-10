// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./L1_MockMessenger.sol";
import "./BytesLib.sol";

contract L2_MockMessenger is ERC20 {
    using SafeERC20 for IERC20;
    using BytesLib for bytes;

    struct Message {
        address target;
        bytes message;
    }

    Message public nextMessage;
    IERC20 public canonicalToken;
    L1_MockMessenger public targetMessenger;

    constructor(IERC20 _canonicalToken) public ERC20("OVM DAI", "ODAI") {
        canonicalToken = _canonicalToken;
    }

    function setTargetMessenger(address _targetMessenger) public {
        targetMessenger = L1_MockMessenger(_targetMessenger);
    }

    function sendMessage(
        address _target,
        bytes memory _message
    )
        public
    {
        nextMessage = Message(
            _target,
            _message
        );
    }

    address public aaa;
    bytes public bbb;
    function relayNextMessage() public {
        aaa = nextMessage.target;
        bbb = nextMessage.message;
        nextMessage.target.call(nextMessage.message);
    }

    function mint(address _account, uint256 _amount) public {
        _mint(_account, _amount);
    }

    /* ========== Arbitrum ========== */

    function decodeMessage(bytes memory _message) public pure returns (bytes memory) {
        uint256 mintStart = 129;
        uint256 mintLength = 68; // mint = 136/2
        // uint256 mintLength = 132; // mint = 264/2
        return _message.slice(mintStart, mintLength);
    }

    bytes public l2t;
    function sendL2Message(
        address _arbChain,
        bytes memory _message
    )
        public
    {
        bytes memory _messageCalldata = decodeMessage(_message);
        l2t = _message;
        // bytes memory setMessageData = abi.encodeWithSignature("setMessage(address,bytes)", _arbChain, _messageCalldata);
        // address(targetMessengerAddress).call(setMessageData);
        // targetMessenger.sendMessage(
        //     targetBridgeAddress,
        //     _messageCalldata
        // );
    }

    /* ========== Optimism ========== */

    function xDomainTransfer(address _recipient, uint256 _amount, address _target) public {
        canonicalToken.safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory transferMessage = abi.encodeWithSignature(
            "mint(address,uint256)",
            _recipient,
            _amount
        );

        targetMessenger.sendMessage(
            _target,
            transferMessage
        );
    }

    function xDomainRelease(address _recipient, uint256 _amount) public {
        canonicalToken.safeTransfer(_recipient, _amount);
    }
}
