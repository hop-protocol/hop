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

    // _token is set to the canonical token of the bridge contract's chain
    address public _committee;
    IERC20 private _canonicalToken;
    mapping(bytes32 => TransferRoot) private _transferRoots;
    mapping(bytes32 => bool) private _spentTransferHashes;

    uint256 private _credit;
    uint256 private _debit;

    event Stake (
        uint256 amount
    );

    event Unstake (
        uint256 amount
    );

    /**
     * Modifiers
     */

    modifier onlyCommittee {
        require(msg.sender == _committee, "BDG: Caller is not committee");
        _;
    }

    constructor(IERC20 canonicalToken_, address committee_) public {
        _canonicalToken = canonicalToken_;
        _committee = committee_;
    }

    /**
     * Virtual functions
     */

    function _transfer(address _recipient, uint256 _amount) internal virtual;

    function _additionalDebit() internal virtual returns (uint256) {
        return 0;
    }

    /**
     * Public getters
     */

    function getTransferHash(
        uint256 _chainId,
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
            _chainId,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
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
        return keccak256(abi.encode("AMOUNT_HASH", _chainIds, _amounts));
    }

    /// @notice getChainId can be overriden by  subclasses if needed for compatability or testing purposes.
    function getChainId() public virtual pure returns (uint256 chainId) {
        assembly {
            chainId := chainid()
        }
    }

    function getTransferRoot(bytes32 _rootHash) public returns (TransferRoot memory) {
        return _transferRoots[_rootHash];
    }

    function getCommitteeBalances() public returns (uint256, uint256) {
        return (_credit, _debit.add(_additionalDebit()));
    }

    function getCanonicalToken() public returns (IERC20) {
        return _canonicalToken;
    }

    /**
     * User/relayer public functions
     */

    function withdraw(
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
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );

        require(_proof.verify(_transferRootHash, transferHash), "BDG: Invalid transfer proof");
        _addToAmountWithdrawn(transferHash, _transferRootHash, _amount);
        _markTransferSpent(transferHash);

        _transfer(_recipient, _amount.sub(_relayerFee));
        _transfer(msg.sender, _relayerFee);
    }

    /**
     * Committee public functions
     */

    function stake(uint256 _amount) public {
        _canonicalToken.transferFrom(msg.sender, address(this), _amount);
        _credit = _credit.add(_amount);
    }

    function unstake(uint256 _amount) public {
        (, uint256 totalDebit) = getCommitteeBalances();
        require(_credit >= totalDebit.add(_amount));
        _debit = _debit.add(_amount);
        _canonicalToken.transfer(_committee, _amount);
    }

    /**
     * Internal functions
     */

    function _markTransferSpent(bytes32 _transferHash) internal {
        require(!_spentTransferHashes[_transferHash], "BDG: The transfer has already been withdrawn");
        _spentTransferHashes[_transferHash] = true;
    }

    function _addToAmountWithdrawn(
        bytes32 _transferHash,
        bytes32 _transferRootHash,
        uint256 _amount
    )
        internal
    {

        TransferRoot storage transferRoot = _transferRoots[_transferRootHash];

        require(transferRoot.total > 0, "BDG: Transfer root not found");
        require(transferRoot.amountWithdrawn.add(_amount) <= transferRoot.total, "BDG: Withdrawal exceeds TransferRoot total");

        transferRoot.amountWithdrawn = transferRoot.amountWithdrawn.add(_amount);
    }

    function _setTransferRoot(bytes32 _transferRootHash, uint256 _amount) internal {
        require(_transferRoots[_transferRootHash].total == 0, "BDG: Transfer root already set");
        _transferRoots[_transferRootHash] = TransferRoot(_amount, 0);
    }

    function _addCredit(uint256 _amount) internal {
        _credit = _credit.add(_amount);
    }

    function _addDebit(uint256 _amount) internal {
        //ToDo: require credit >= debit and add force add debit function
        _debit = _debit.add(_amount);
    }
}
