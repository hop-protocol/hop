pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import "./Bridge.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";

import "../libraries/MerkleUtils.sol";

abstract contract L2_Bridge is ERC20, Bridge {
    address public l1BridgeAddress;
    address public exchangeAddress;
    address public oDaiAddress;
    address[] public exchangePath;
    uint256 public swapDeadlineBuffer;
    address[] public CH_exchangePath;
    address[] public HC_exchangePath;

    bytes32[] public pendingTransfers;
    bytes32[] public pendingAmountLayerIds;
    mapping(bytes32 => uint256) pendingAmountForLayerId;

    event TransfersCommitted (
        bytes32 root,
        uint256[] amounts
    );

    event TransferSent (
        address recipient,
        uint256 amount,
        uint256 transferNonce,
        uint256 relayerFee
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
        CH_exchangePath = [oDaiAddress, address(this)];
        HC_exchangePath = [address(this), oDaiAddress];
    }

    function setL1BridgeAddress(address _l1BridgeAddress) public {
        l1BridgeAddress = _l1BridgeAddress;
    }

    // ToDo: Rename to Send
    /// @notice _amount is the amount the user wants to send plus the relayer fee
    function send(
        bytes32 _layerId,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee
    )
        public
    {
        _burn(msg.sender, _amount);

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

        emit TransferSent(_recipient, _amount, _transferNonce, _relayerFee);
    }

    /// @notice _amount is the amount the user wants to send plus the relayer fee
    function swapAndSend(
        bytes32 _layerId,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        uint256 _amountOutMin
    )
        public
    {
        ERC20(oDaiAddress).transferFrom(msg.sender, address(this), _amount);

        address[] memory exchangePath = CH_exchangePath;
        uint256[] memory swapAmounts = IUniswapV2Router02(exchangeAddress).getAmountsOut(_amount, exchangePath);
        uint256 swapAmount = swapAmounts[swapAmounts.length - 1];

        bytes memory swapCalldata = _getSwapCalldata(_recipient, _amount, _amountOutMin, exchangePath);
        (bool success,) = exchangeAddress.call(swapCalldata);
        require(success, "L2BDG: Swap failed");

        send(getMessengerId('kovan'), _recipient, swapAmount, _transferNonce, _relayerFee);
    }

    function commitTransfers() public {
        uint256[] memory layerAmounts = new uint256[](pendingAmountLayerIds.length);
        for (uint256 i = 0; i < pendingAmountLayerIds.length; i++) {
            bytes32 layerId = pendingAmountLayerIds[i];
            layerAmounts[i] = pendingAmountForLayerId[layerId];

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

        emit TransfersCommitted(root, layerAmounts);
    }

    // onlyCrossDomainBridge
    function mint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }

    function mintAndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin) public {
        _mint(address(this), _amount);

        bytes memory swapCalldata = _getSwapCalldata(_recipient, _amount, _amountOutMin, HC_exchangePath);
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

    /**
     * TransferRoots
     */

    // onlyL1Bridge
    function setTransferRoot(bytes32 _rootHash, uint256 _amount) public {
        _setTransferRoot(_rootHash, _amount);
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

    function _getSwapCalldata(
        address _recipient,
        uint256 _amount,
        uint256 _amountOutMin,
        address[] memory _exchangePath
    )
        internal
        returns (bytes memory)
    {
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
