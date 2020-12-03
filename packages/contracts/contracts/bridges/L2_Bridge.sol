pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Bridge.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";

import "../libraries/MerkleUtils.sol";

abstract contract L2_Bridge is ERC20, Bridge {
    address public l1BridgeAddress;
    address public exchangeAddress;
    address public oDaiAddress;
    address[] public exchangePath;
    uint256 public swapDeadlineBuffer;

    bytes32[] public pendingTransfers;
    bytes32[] public pendingAmountLayerIds;
    mapping(bytes32 => uint256) pendingAmountForLayerId;

    event TransfersCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor () public ERC20("DAI Hop Token", "hDAI") {}

    function _sendMessageToL1Bridge(bytes memory _message) internal virtual;

    /**
     * Public functions
     */

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
        exchangePath = [address(this), oDaiAddress];
    }

    function setL1BridgeAddress(address _l1BridgeAddress) public {
        l1BridgeAddress = _l1BridgeAddress;
    }

    // ToDo: Rename to Send
    function sendToMainnet(
        bytes32 _layerId,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee
    )
        public
    {
        uint256 totalAmount = _amount.add(_relayerFee);
        _burn(msg.sender, totalAmount);

        bytes32 transferHash = getTransferHash(
            _layerId,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );
        pendingTransfers.push(transferHash);
        // ToDo: Require only allowlisted layer ids
        _addToPendingAmount(_layerId, _amount);
    }

    function commitTransfers() public {
        uint256 pendingAmount = 0;
        uint256[] memory layerAmounts = new uint256[](pendingAmountLayerIds.length);
        for (uint256 i = 0; i < pendingAmountLayerIds.length; i++) {
            bytes32 layerId = pendingAmountLayerIds[i];
            layerAmounts[i] = pendingAmountForLayerId[layerId];
            pendingAmount = pendingAmount.add(pendingAmountForLayerId[layerId]);

            // Clean up for the next batch of transfers as pendingAmountLayerIds is iterated
            pendingAmountForLayerId[layerId] = 0;
        }

        bytes32 root = MerkleUtils.getMerkleRoot(pendingTransfers);
        bytes32 amountHash = getAmountHash(pendingAmountLayerIds, layerAmounts);

        delete pendingAmountLayerIds;
        delete pendingTransfers;

        bytes memory confirmTransferRootMessage = abi.encodeWithSignature(
            "confirmTransferRoot(bytes32,bytes32)",
            root,
            amountHash
        );

        _sendMessageToL1Bridge(confirmTransferRootMessage);

        emit TransfersCommitted(root, pendingAmount);
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

    /**
     * TransferRoots
     */

    // onlyL1Bridge
    function setTransferRoot(bytes32 _rootHash, uint256 _amount) public {
        transferRoots[_rootHash] = TransferRoot(_amount, 0);
    }

    // ToDo: Add withdrawAndAttemptToSwap functionality
    function withdrawAndSwap(
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        bytes32 _transferRoot,
        bytes32[] memory _proof
        // ToDo: Add minimum output param for Uniswap slippage protection
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
        // Mint the tokens to swap
        _mint(address(this), _amount);

        // Do Uniswap swap and get output amount
        // If swap reverts, revert the transaction

        // Transfer output amount of oDaiAddress to recipient
    }

    /**
     * Internal Functions
     */

    function _addToPendingAmount(bytes32 _layerId, uint256 _amount) internal {
        if (pendingAmountForLayerId[_layerId] == 0) {
            pendingAmountLayerIds.push(_layerId);
        }

        pendingAmountForLayerId[_layerId] = pendingAmountForLayerId[_layerId].add(_amount);
    }

    function _transfer(address _recipient, uint256 _amount) internal override {
        _mint(_recipient, _amount);
    }
}
