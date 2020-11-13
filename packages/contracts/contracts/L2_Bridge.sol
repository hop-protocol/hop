pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Bridge.sol";
import "./test/mockOVM_CrossDomainMessenger.sol";

import "./libraries/MerkleUtils.sol";

contract L2_Bridge is ERC20, Bridge {
    using SafeMath for uint256;
    using MerkleProof for bytes32[];

    mockOVM_CrossDomainMessenger public messenger;
    address   public l1Messenger;
    bytes32[] public pendingTransfers;
    uint256   public pendingAmount;
    uint256   public swapDeadlineBuffer;
    address   public exchangeAddress;
    address   public oDaiAddress;
    address[] public exchangePath;

    event TransfersCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor (
        mockOVM_CrossDomainMessenger _messenger,
        uint256 _swapDeadlineBuffer,
        address _exchangeAddress,
        address _oDaiAddress
    )
        public
        ERC20("DAI Liquidity Pool Token", "LDAI")
    {
        messenger = _messenger;
        swapDeadlineBuffer = _swapDeadlineBuffer;
        exchangeAddress = _exchangeAddress;
        oDaiAddress = _oDaiAddress;
        exchangePath = [address(this), oDaiAddress];
    }

    function setL1Messenger(address _l1Messenger) public {
        l1Messenger = _l1Messenger;
    }

    function sendToMainnet(
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee
    )
        public
    {
        uint256 totalAmount = _amount + _relayerFee;
        _burn(msg.sender, totalAmount);

        bytes32 transferHash = getTransferHash(_recipient, _amount, _transferNonce, _relayerFee);
        pendingTransfers.push(transferHash);
        pendingAmount = pendingAmount.add(totalAmount);
    }

    // relayer 
    function commitTransfers() public {
        bytes32[] memory _pendingTransfers = pendingTransfers;
        bytes32 root = MerkleUtils.getMerkleRoot(_pendingTransfers);
        uint256 _pendingAmount = pendingAmount;

        delete pendingTransfers;
        pendingAmount = 0;

        bytes memory setTransferRootMessage = abi.encodeWithSignature("setTransferRoot(bytes32,uint256)", root, _pendingAmount);

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

    function mintAndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin) public {
        _mint(address(this), _amount);

        uint256 swapDeadline = block.timestamp + swapDeadlineBuffer;
        bytes memory swapCalldata = abi.encodeWithSignature(
            "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
            _amount,
            _amountOutMin,
            exchangePath,
            _recipient,
            swapDeadline
        );

        (bool success,) = exchangeAddress.call(swapCalldata);
        if (!success) {
            transferFallback(_recipient, _amount);
        }
    }

    function approveExchangeTransfer() public {
        _approve(address(this), exchangeAddress, uint256(-1));
    }

    function transferFallback(address _recipient, uint256 _amount) public {
        _transfer(address(this), _recipient, _amount);
    }
}
