pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Bridge.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";

import "../libraries/MerkleUtils.sol";

contract L2_Bridge is ERC20, Bridge {
    using SafeMath for uint256;
    using MerkleProof for bytes32[];

    mockOVM_CrossDomainMessenger public messenger;
    address   public l1BridgeAddress;
    bytes32[] public pendingTransfers;
    uint256   public pendingAmount;
    uint256   public swapDeadlineBuffer;
    address   public exchangeAddress;
    address   public oDaiAddress;
    address[] public OH_exchangePath;
    address[] public HO_exchangePath;

    event TransfersCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor (mockOVM_CrossDomainMessenger _messenger) public ERC20("DAI Liquidity Pool Token", "LDAI") {
        messenger = _messenger;
    }

    function setExchangeValues(
        uint256 _swapDeadlineBuffer,
        address _exchangeAddress,
        address _oDaiAddress
    )
        public
    {
        swapDeadlineBuffer = _swapDeadlineBuffer;
        exchangeAddress = _exchangeAddress;
        oDaiAddress = _oDaiAddress;
        OH_exchangePath = [oDaiAddress, address(this)];
        HO_exchangePath = [address(this), oDaiAddress];
    }

    function setL1BridgeAddress(address _l1BridgeAddress) public {
        l1BridgeAddress = _l1BridgeAddress;
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

    function swapAndSendToMainnet(
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        uint256 _amountOutMin
    )
        public
    {
        ERC20(oDaiAddress).transferFrom(msg.sender, address(this), _amount);

        bytes memory swapCalldata = _getSwapCalldata(_recipient, _amount, _amountOutMin, OH_exchangePath);
        (bool success,) = exchangeAddress.call(swapCalldata);
        require(success, "L2BDG: Swap failed");

        uint256 totalAmount = _amount + _relayerFee;
        uint256 senderBalance = balanceOf(msg.sender);
        uint256 senderAmount = totalAmount >= senderBalance ? senderBalance : _amount;

        sendToMainnet(_recipient, senderAmount, _transferNonce, _relayerFee);
    }

    function commitTransfersPreHook() internal returns (bytes32, uint256, bytes memory) {
        bytes32[] memory _pendingTransfers = pendingTransfers;
        bytes32 root = MerkleUtils.getMerkleRoot(_pendingTransfers);
        uint256 _pendingAmount = pendingAmount;

        delete pendingTransfers;
        pendingAmount = 0;

        bytes memory setTransferRootMessage = abi.encodeWithSignature("confirmTransferRoot(bytes32,uint256)", root, _pendingAmount);
        return (
            root,
            _pendingAmount,
            setTransferRootMessage
        );
    }

    function commitTransfersPostHook(bytes32 _root, uint256 _pendingAmount) internal {
        emit TransfersCommitted(_root, _pendingAmount);
    }

    // onlyCrossDomainBridge
    function mint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }

    function mintAndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin) public {
        _mint(address(this), _amount);

        bytes memory swapCalldata = _getSwapCalldata(_recipient, _amount, _amountOutMin, HO_exchangePath);
        (bool success,) = exchangeAddress.call(swapCalldata);

        if (!success) {
            _transferFallback(_recipient, _amount);
        }
    }

    function approveExchangeTransfer() public {
        approve(exchangeAddress, uint256(-1));
    }

    function approveODaiExchangeTransfer() public {
        ERC20(oDaiAddress).approve(exchangeAddress, uint256(-1));
    }

    function _transferFallback(address _recipient, uint256 _amount) internal {
        _transfer(address(this), _recipient, _amount);
    }

    function _getSwapCalldata(address _recipient, uint256 _amount, uint256 _amountOutMin, address[] memory _exchangePath) internal returns (bytes memory) {
        uint256 swapDeadline = block.timestamp + swapDeadlineBuffer;
        return abi.encodeWithSignature(
            "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
            _amount,
            _amountOutMin,
            _exchangePath,
            _recipient,
            swapDeadline
        );
    }
}
