pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";

import "../libraries/MerkleUtils.sol";

abstract contract Bridge {
    using SafeMath for uint256;
    using MerkleProof for bytes32[];
    using SafeERC20 for IERC20;

    struct TransferRoot {
        uint256 total;
        uint256 amountWithdrawn;
    }

    mapping(bytes32 => TransferRoot) private transferRoots;
    mapping(bytes32 => bool) private spentTransferHashes;

    /**
     * Abstract functions
     */

    function getLayerId() public virtual returns (bytes32);
    function _transfer(address _recipient, uint256 _amount) internal virtual;

    /**
     * Public getters
     */

    function getTransferHash(
        bytes32 _layerId,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee
    )
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(
            _layerId,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        ));
    }

    function getAmountHash(
        bytes32[] memory _layerIds,
        uint256[] memory _amounts
    )
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("AMOUNT_HASH", _layerIds, _amounts));
    }

    function getMessengerId(string memory _messengerLabel) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_messengerLabel));
    }

    function getTransferRoot(bytes32 _rootHash) public returns (TransferRoot memory) {
        return transferRoots[_rootHash];
    }

    /**
     * Public functions
     */

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
        _preWithdraw(
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            _transferRoot,
            _proof
        );

        _transfer(_recipient, _amount);
        _transfer(msg.sender, _relayerFee);
    }

    /**
     * Internal functions
     */

    function _preWithdraw(
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
            getLayerId(),
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );
        TransferRoot storage transferRoot = transferRoots[_transferRoot];

        require(!spentTransferHashes[transferHash], "BDG: The transfer has already been withdrawn");
        require(transferRoot.total > 0, "BDG: Transfer root not found");
        require(_proof.verify(_transferRoot, transferHash), "BDG: Invalid transfer proof");
        require(transferRoot.amountWithdrawn.add(_amount) <= transferRoot.total, "BDG: Withdrawal exceeds TransferRoot total");

        spentTransferHashes[transferHash] = true;
        transferRoot.amountWithdrawn = transferRoot.amountWithdrawn.add(_amount);
    }

    function _setTransferRoot(bytes32 _transferRoot, uint256 _amount) internal {
        require(transferRoots[_transferRoot].total == 0, "BDG: Transfer root already set");
        transferRoots[_transferRoot] = TransferRoot(_amount, 0);
    }
}
