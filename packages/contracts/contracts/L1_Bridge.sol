pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Bridge.sol";
import "./test/mockOVM_CrossDomainMessenger.sol";

import "./libraries/MerkleUtils.sol";

contract L1_Bridge is Bridge {
    using SafeMath for uint256;
    using MerkleProof for bytes32[];
    using SafeERC20 for IERC20;

    struct TransferRootBalance {
        uint256 total;
        uint256 amountWithdrawn;
    }

    IERC20 token;
    mockOVM_CrossDomainMessenger messenger;
    address l2Bridge;

    mapping(bytes32 => TransferRootBalance) transferRootBalances;
    mapping(bytes32 => bool) spentTransferHashes;

    event DepositsCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor (
        mockOVM_CrossDomainMessenger _messenger,
        IERC20 _token
    )
        public
    {
        messenger = _messenger;
        token = _token;
    }

    function setL2Bridge(address _l2Bridge) public {
        l2Bridge = _l2Bridge;
    }

    function sendToL2(address _recipient, uint256 _amount) public {
        token.safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory message = abi.encodeWithSignature(
            "mint(address,uint256)",
            _recipient,
            _amount
        );
        _sendMessage(message);
    }

    function sendToL2AndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin) public {
        token.safeTransferFrom(msg.sender, address(this), _amount);

        bytes memory message = abi.encodeWithSignature(
            "mintAndAttemptSwap(address,uint256,uint256)",
            _recipient,
            _amount,
            _amountOutMin
        );
        _sendMessage(message);
    }

    function _sendMessage(bytes memory _message) internal {
        messenger.sendMessage(
            l2Bridge,
            _message,
            200000
        );
    }

    // onlyCrossDomainBridge
    function setTransferRoot(bytes32 _newTransferRoot, uint256 _amount) public {
        transferRootBalances[_newTransferRoot] = TransferRootBalance(_amount, 0);
    }

    function withdraw(
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        bytes32 _transferRoot,
        bytes32[] memory _proof
    )
        public
    {
        bytes32 transferHash = getTransferHash(
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );
        uint256 totalAmount = _amount + _relayerFee;
        TransferRootBalance storage rootBalance = transferRootBalances[_transferRoot];

        require(!spentTransferHashes[transferHash], "BDG: The transfer has already been withdrawn");
        require(_proof.verify(_transferRoot, transferHash), "BDG: Invalid transfer proof");
        require(rootBalance.amountWithdrawn.add(totalAmount) <= rootBalance.total, "BDG: Withdrawal exceeds TransferRoot total");

        spentTransferHashes[transferHash] = true;
        rootBalance.amountWithdrawn = rootBalance.amountWithdrawn.add(totalAmount);
        token.safeTransfer(_recipient, _amount);
        msg.sender.transfer(_relayerFee);
    }

    // TODO: How else should we have user's deposit funds for fee
    receive () external payable {}
}
