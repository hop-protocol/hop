pragma solidity 0.6.12;

import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./test/mockOVM_CrossDomainMessenger.sol";

import "./libraries/MerkleUtils.sol";

contract Bridge {
    function getTransferHash(uint256 _amount, uint256 _transferNonce, address _recipient) public pure returns (bytes32) {
        return keccak256(abi.encode(
            _amount,
            _transferNonce,
            _recipient
            // relayer fee
        ));
    }
}
