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

    // ToDo: Make internal function for distributing token and move this logic to withdraw()
    function _preWithdraw(
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        bytes32 _transferRoot,
        bytes32[] memory _proof
    )
        internal
    {
        bytes32 transferHash = getTransferHash(
            getChainId(),
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );
        TransferRoot storage transferRoot = _transferRoots[_transferRoot];

        require(!_spentTransferHashes[transferHash], "BDG: The transfer has already been withdrawn");
        require(transferRoot.total > 0, "BDG: Transfer root not found");
        require(_proof.verify(_transferRoot, transferHash), "BDG: Invalid transfer proof");
        require(transferRoot.amountWithdrawn.add(_amount) <= transferRoot.total, "BDG: Withdrawal exceeds TransferRoot total");

        _spentTransferHashes[transferHash] = true;
        transferRoot.amountWithdrawn = transferRoot.amountWithdrawn.add(_amount);
    }

    function _setTransferRoot(bytes32 _transferRoot, uint256 _amount) internal {
        require(_transferRoots[_transferRoot].total == 0, "BDG: Transfer root already set");
        _transferRoots[_transferRoot] = TransferRoot(_amount, 0);
    }

    function _addCredit(uint256 _amount) internal {
        _credit = _credit.add(_amount);
    }

    function _addDebit(uint256 _amount) internal {
        _debit = _debit.add(_amount);
    }
}
