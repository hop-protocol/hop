pragma solidity 0.6.12;

import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./test/mockOVM_CrossDomainMessenger.sol";

import "./libraries/MerkleUtils.sol";

contract Bridge {
    function getTransferHash(
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
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        ));
    }
}
