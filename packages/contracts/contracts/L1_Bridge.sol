pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Bridge.sol";

import "./implementations/Arbitrum.sol";
import "./implementations/Optimism.sol";

import "./libraries/MerkleUtils.sol";

contract L1_Bridge is Bridge, Arbitrum, Optimism {
    using MerkleProof for bytes32[];
    using SafeERC20 for IERC20;

    IERC20 token;

    mapping(bytes32 => address) messenger;
    mapping(bytes32 => address) l2Bridge;
    mapping(bytes32 => bool) transferRoots;

    event DepositsCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor (IERC20 _token) public {
        token = _token;
    }

    function setMessenger(bytes32 _bridgeId, address _messenger) public {
        messenger[_bridgeId] = _messenger;
    }

    function setL2Bridge(bytes32 _bridgeId, address _l2Bridge) public {
        l2Bridge[_bridgeId] = _l2Bridge;
    }

    function sendToL2(bytes32 _bridgeId, address _recipient, uint256 _amount) public {
        address chainMessenger = messenger[_bridgeId]
        bytes memory mintCalldata = abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount);

        if (_bridgeId == keccak256("arbitrum")) {
            _sendToArbitrum(chainMessenger, mintCalldata);
        } else if (_bridgeId == keccak256("optimism")) {
            _sendToOptimism(chainMessenger, mintCalldata);
        }

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
