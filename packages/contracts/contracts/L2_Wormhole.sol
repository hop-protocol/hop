pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Wormhole.sol";
import "./test/mockOVM_CrossDomainMessenger.sol";

import "./libraries/MerkleUtils.sol";

contract L2_Wormhole is ERC20, Wormhole {
    using MerkleProof for bytes32[];

    mockOVM_CrossDomainMessenger messenger;
    address l1Messenger;
    bytes32[] pendingTransfers;
    uint256 pendingAmount;

    event TransfersCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor (
        mockOVM_CrossDomainMessenger _messenger
    )
        public
        ERC20("DAI Liquidity Pool Token", "LDAI")
    {
        messenger = _messenger;
    }

    function setL1Messenger(address _l1Messenger) public {
        l1Messenger = _l1Messenger;
    }

    function sendToMainnet(address _recipient, uint256 _amount, uint256 _transferNonce) public {
        _burn(msg.sender, _amount);

        bytes32 transferHash = getTransferHash(_amount, _transferNonce, _recipient);
        pendingTransfers.push(transferHash);
        pendingAmount = pendingAmount.add(_amount);
    }

    // relayer 
    function commitTransfers() public {
        bytes32[] memory _pendingTransfers = pendingTransfers;
        bytes32 root = MerkleUtils.getMerkleRoot(_pendingTransfers);
        uint256 _pendingAmount = pendingAmount;

        delete pendingTransfers;
        pendingAmount = 0;

        bytes memory setTransferRootMessage = abi.encodeWithSignature("setTransferRoot(bytes32)", root);

        messenger.sendMessage(
            l1Messenger,
            setTransferRootMessage,
            200000
        );

        emit TransfersCommitted(root, _pendingAmount);
    }

    // onlyCrossDomainBridge
    function mint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }

    // function mintAndAttemptSwap(address _recipient, uint256 _amount) public {
    //     _mint(address(this), _amount);
    //     // todo: slippage protection
    //     //          L1 bridge = transferAndAttemptToSwap takes slippage #
    //     exchange.swapAndTransfer(_amount, address(this), _recipient);
    //     // (, bool success) = call(calldata)
    //     // if (!success), just transfer
    // }
}
