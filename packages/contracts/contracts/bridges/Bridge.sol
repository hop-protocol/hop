pragma solidity 0.6.12;

import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";

import "../libraries/MerkleUtils.sol";

contract Bridge {
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
}
