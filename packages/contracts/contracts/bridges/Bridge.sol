// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";

import "./Accounting.sol";

abstract contract Bridge is Accounting {
    using MerkleProof for bytes32[];

    struct TransferRoot {
        uint256 total;
        uint256 amountWithdrawn;
    }

    mapping(bytes32 => TransferRoot) private _transferRoots;
    mapping(bytes32 => bool) private _spentTransferHashes;
    mapping(bytes32 => uint256) private _bondedWithdrawalAmounts;

    constructor(address _committee) public Accounting(_committee) {}

    /* ========== Public getters ========== */

    function getTransferHash(
        uint256 _chainId,
        address _sender,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        uint256 _amountOutMin,
        uint256 _deadline
    )
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(
            _chainId,
            _sender,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            _amountOutMin,
            _deadline
        ));
    }

    function getAmountHash(
        uint256[] memory _chainIds,
        uint256[] memory _amounts
    )
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(_chainIds, _amounts));
    }

    /// @notice getChainId can be overridden by subclasses if needed for compatibility or testing purposes.
    function getChainId() public virtual view returns (uint256 chainId) {
        this; // Silence state mutability warning without generating any additional byte code
        assembly {
            chainId := chainid()
        }
    }

    function getTransferRoot(bytes32 _rootHash) public view returns (TransferRoot memory) {
        return _transferRoots[_rootHash];
    }

    function getBondedWithdrawalAmount(bytes32 _rootHash) external view returns (uint256) {
        return _bondedWithdrawalAmounts[_rootHash];
    }

    /* ========== User/relayer public functions ========== */

    function withdraw(
        address _sender,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        bytes32 _transferRootHash,
        bytes32[] memory _proof
    )
        public
    {
        bytes32 transferHash = getTransferHash(
            getChainId(),
            _sender,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            0,
            0
        );

        require(_proof.verify(_transferRootHash, transferHash), "BRG: Invalid transfer proof");
        _addToAmountWithdrawn(_transferRootHash, _amount);

        _markTransferSpent(transferHash);
        _transferFromBridge(_recipient, _amount.sub(_relayerFee));
        _transferFromBridge(msg.sender, _relayerFee);
    }

    function bondWithdrawal(
        address _sender,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee
    )
        public
        onlyCommittee
        requirePositiveBalance
    {
        bytes32 transferHash = getTransferHash(
            getChainId(),
            _sender,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            0,
            0
        );

        _addDebit(_amount);
        _setBondedWithdrawalAmount(transferHash, _amount);

        _markTransferSpent(transferHash);
        _transferFromBridge(_recipient, _amount.sub(_relayerFee));
        _transferFromBridge(msg.sender, _relayerFee);
    }

    function settleBondedWithdrawal(
        bytes32 _transferHash,
        bytes32 _transferRootHash,
        bytes32[] memory _proof
    )
        public
    {
        require(_proof.verify(_transferRootHash, _transferHash), "L2_BRG: Invalid transfer proof");

        uint256 amount = _bondedWithdrawalAmounts[_transferHash];
        _addToAmountWithdrawn(_transferRootHash, amount);

        _bondedWithdrawalAmounts[_transferRootHash] = 0;
        _addCredit(amount);
    }

    /* ========== Internal functions ========== */

    function _markTransferSpent(bytes32 _transferHash) internal {
        require(!_spentTransferHashes[_transferHash], "BRG: The transfer has already been withdrawn");
        _spentTransferHashes[_transferHash] = true;
    }

    function _addToAmountWithdrawn(
        bytes32 _transferRootHash,
        uint256 _amount
    )
        internal
    {
        TransferRoot storage transferRoot = _transferRoots[_transferRootHash];

        require(transferRoot.total > 0, "BRG: Transfer root not found");
        require(transferRoot.amountWithdrawn.add(_amount) <= transferRoot.total, "BRG: Withdrawal exceeds TransferRoot total");

        transferRoot.amountWithdrawn = transferRoot.amountWithdrawn.add(_amount);
    }

    function _setTransferRoot(bytes32 _transferRootHash, uint256 _amount) internal {
        require(_transferRoots[_transferRootHash].total == 0, "BRG: Transfer root already set");
        _transferRoots[_transferRootHash] = TransferRoot(_amount, 0);
    }

    function _setBondedWithdrawalAmount(bytes32 _transferHash, uint256 _amount) internal {
        require(_bondedWithdrawalAmounts[_transferHash] == 0, "BRG: Withdrawal has already been bonded");
        _bondedWithdrawalAmounts[_transferHash] = _amount;
    }
}
