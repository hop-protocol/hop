pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./Wormhole.sol";

import "./libraries/MerkleUtils.sol";

contract L1_Wormhole is Wormhole {
    using MerkleProof for bytes32[];
    using SafeERC20 for IERC20;

    IERC20 token;

    mapping(bytes32 => address) l1Messenger;
    mapping(bytes32 => bool) transferRoots;

    event DepositsCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor (IERC20 _token) public {
        token = _token;
    }

    function setL1Messenger(bytes32 _messengerId, address _l1Messenger) public {
        l1Messenger[_messengerId] = _l1Messenger;
    }

    function getMessengerId(string calldata _messengerLabel) public pure returns (bytes32) {
        return keccak256(abi.encode(_messengerLabel));
    }

    function sendToL2(bytes32 _messengerId, address _recipient, uint256 _amount) public {
        bytes memory mintCalldata = abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount);
        bytes memory sendMessageCalldata = abi.encodeWithSignature("sendToL2(bytes)", mintCalldata);

        l1Messenger[_messengerId].call(sendMessageCalldata);
        token.safeTransferFrom(msg.sender, address(this), _amount);
    }

    // onlyCrossDomainBridge
    function setTransferRoot(bytes32 _newTransferRoot) public {
        transferRoots[_newTransferRoot] = true;
    }

    function withdraw(uint256 _amount, uint256 _transferNonce, bytes32 _transferRoot, bytes32[] memory _proof) public {
        bytes32 transferHash = getTransferHash(
            _amount,
            _transferNonce,
            msg.sender
        );
        require(_proof.verify(_transferRoot, transferHash), "BDG: Invalid transfer proof");

        token.safeTransfer(msg.sender, _amount);
    }
}
