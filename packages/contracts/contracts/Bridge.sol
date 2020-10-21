pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Bridge is ERC20 {
    using MerkleProof for bytes32[];

    IERC20 poolToken;
    mapping(bytes32 => bool) withdrawalRoots;

    constructor(
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

    function bridgeDeposit() public {
        // ToDo: Implement function
    }

    function bridgeWithdraw(uint256 _amount, uint256 _withdrawalNonce, bytes32 _withdrawalRoot, bytes32[] memory _proof) public {
        bytes32 withdrawalHash = getWithdrawalHash(
            _amount,
            _withdrawalNonce,
            msg.sender
        );
        require(_proof.verify(_withdrawalRoot, withdrawalHash), "BDG: Invalid withdrawal proof");

        _mint(msg.sender, _amount);
    }

    function getWithdrawalHash(uint256 _amount, uint256 _withdrawalNonce, address _sender) public pure returns (bytes32) {
        return keccak256(abi.encode(
            _amount,
            _withdrawalNonce,
            _sender
        ));
    }

    function price() public view returns(uint256) {
        return 1;
    }
}
