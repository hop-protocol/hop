pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/MerkleUtils.sol";


contract Bridge is ERC20 {
    using MerkleProof for bytes32[];

    IERC20 poolToken;
    mapping(bytes32 => bool) withdrawalRoots;
    bytes32[] pendingDeposits;
    uint256 pendingAmount;

    event DepositsCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor (
        IERC20 _poolToken
    )
        public
        ERC20("DAI Liquidity Pool Token", "LDAI")
    {
        poolToken = _poolToken;
    }

    function setWithdrawalRoot(bytes32 _newWithdrawalRoot) public {
        withdrawalRoots[_newWithdrawalRoot] = true;
    }

    function deposit(uint256 _amount, uint256 _withdrawalNonce, address _recipient) public {
        _burn(msg.sender, _amount);

        bytes32 withdrawalHash = getWithdrawalHash(_amount, _withdrawalNonce, _recipient);
        pendingDeposits.push(withdrawalHash);
        pendingAmount = pendingAmount.add(_amount);
    }

    function commitDeposits() public returns (bytes32) {
        bytes32[] memory _pendingDeposits = pendingDeposits;
        bytes32 root = MerkleUtils.getMerkleRoot(_pendingDeposits);
        uint256 _pendingAmount = pendingAmount;

        delete pendingDeposits;
        pendingAmount = 0;

        emit DepositsCommitted(root, _pendingAmount);
        return root;
    }

    function withdraw(uint256 _amount, uint256 _withdrawalNonce, bytes32 _withdrawalRoot, bytes32[] memory _proof) public {
        bytes32 withdrawalHash = getWithdrawalHash(
            _amount,
            _withdrawalNonce,
            msg.sender
        );
        require(_proof.verify(_withdrawalRoot, withdrawalHash), "BDG: Invalid withdrawal proof");

        _mint(msg.sender, _amount);
    }

    function getWithdrawalHash(uint256 _amount, uint256 _withdrawalNonce, address _recipient) public pure returns (bytes32) {
        return keccak256(abi.encode(
            _amount,
            _withdrawalNonce,
            _recipient
        ));
    }

    function price() public view returns(uint256) {
        return 1;
    }
}
