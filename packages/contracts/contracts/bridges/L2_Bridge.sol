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
    uint256 public swapDeadlineBuffer;

    bytes32[] public pendingTransfers;
    uint256[] public pendingAmountChainIds;
    mapping(uint256 => uint256) pendingAmountForChainId;

    event TransfersCommitted (
        bytes32 root,
        bytes32 amountHash,
        uint256[] chainIds,
        uint256[] amounts
    );

    event TransferSent (
        bytes32 transferHash,
        address recipient,
        uint256 amount,
        uint256 transferNonce,
        uint256 relayerFee
    );

    constructor (
        IERC20 canonicalToken_,
        address committee_
    )
        public
        Bridge(canonicalToken_, committee_)
        ERC20("DAI Hop Token", "hDAI")
    {}

    function _sendMessageToL1Bridge(bytes memory _message) internal virtual;

    /**
     * Public functions
     */

    function setExchangeValues(
        uint256 _swapDeadlineBuffer,
        address _exchangeAddress
    )
        public
    {
        swapDeadlineBuffer = _swapDeadlineBuffer;
        exchangeAddress = _exchangeAddress;
    }

    function setL1BridgeAddress(address _l1BridgeAddress) public {
        l1BridgeAddress = _l1BridgeAddress;
    }

    /// @notice _amount is the amount the user wants to send plus the relayer fee
    function send(
        uint256 _chainId,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee
    )
        public
    {
        _burn(msg.sender, _amount);

        bytes32 transferHash = getTransferHash(
            _chainId,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );
        pendingTransfers.push(transferHash);

        // ToDo: Require only allowlisted chain ids
        _addToPendingAmount(_chainId, _amount);

        emit TransferSent(transferHash, _recipient, _amount, _transferNonce, _relayerFee);
    }

    /// @notice _amount is the amount the user wants to send plus the relayer fee
    function swapAndSend(
        uint256 _chainId,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        uint256 _amountOutMin
    )
        public
    {
        IERC20 token = getCanonicalToken();
        token.transferFrom(msg.sender, address(this), _amount);

        address[] memory exchangePath = new address[](2);
        exchangePath[0] = address(token);
        exchangePath[1] = address(this);
        uint256[] memory swapAmounts = IUniswapV2Router02(exchangeAddress).getAmountsOut(_amount, exchangePath);
        uint256 swapAmount = swapAmounts[1];

        bytes memory swapCalldata = _getSwapCalldata(_recipient, _amount, _amountOutMin, exchangePath);
        (bool success,) = exchangeAddress.call(swapCalldata);
        require(success, "L2BDG: Swap failed");

        send(_chainId, _recipient, swapAmount, _transferNonce, _relayerFee);
    }

    function commitTransfers() public {
        bytes32 root = MerkleUtils.getMerkleRoot(pendingTransfers);

        uint256[] memory chainAmounts = new uint256[](pendingAmountChainIds.length);
        for (uint256 i = 0; i < pendingAmountChainIds.length; i++) {
            uint256 chainId = pendingAmountChainIds[i];
            chainAmounts[i] = pendingAmountForChainId[chainId];

            // Clean up for the next batch of transfers as pendingAmountChainIds is iterated
            pendingAmountForChainId[chainId] = 0;
        }
        bytes32 amountHash = getAmountHash(pendingAmountChainIds, chainAmounts);

        emit TransfersCommitted(root, amountHash, pendingAmountChainIds, chainAmounts);

        delete pendingAmountChainIds;
        delete pendingTransfers;

        bytes memory confirmTransferRootMessage = abi.encodeWithSignature(
            "confirmTransferRoot(bytes32,bytes32)",
            root,
            amountHash
        );

        _sendMessageToL1Bridge(confirmTransferRootMessage);

    }

    // onlyCrossDomainBridge
    function mint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }

    function mintAndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin) public {
        _mint(address(this), _amount);

        address[] memory exchangePath = new address[](2);
        exchangePath[0] = address(this);
        exchangePath[1] = address(getCanonicalToken());
        bytes memory swapCalldata = _getSwapCalldata(_recipient, _amount, _amountOutMin, exchangePath);
        (bool success,) = exchangeAddress.call(swapCalldata);

        if (!success) {
            _transferFallback(_recipient, _amount);
        }
    }

    function approveExchangeTransfer() public {
        approve(exchangeAddress, uint256(-1));
    }

    function approveODaiExchangeTransfer() public {
        getCanonicalToken().approve(exchangeAddress, uint256(-1));
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

    function _addToPendingAmount(uint256 _chainId, uint256 _amount) internal {
        if (pendingAmountForChainId[_chainId] == 0) {
            pendingAmountChainIds.push(_chainId);
        }

        pendingAmountForChainId[_chainId] = pendingAmountForChainId[_chainId].add(_amount);
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
