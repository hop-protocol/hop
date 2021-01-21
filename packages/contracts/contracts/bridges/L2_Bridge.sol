// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

import "./Bridge.sol";
import "../libraries/MerkleUtils.sol";

abstract contract L2_Bridge is ERC20, Bridge {
    address public l1Governance;
    address public l1BridgeAddress;
    address public exchangeAddress;
    IERC20 public l2CanonicalToken;
    mapping(uint256 => bool) public supportedChainIds;

    bytes32[] public pendingTransfers;
    uint256[] public pendingAmountChainIds;
    mapping(uint256 => uint256) public pendingAmountForChainId;

    event TransfersCommitted (
        bytes32 indexed root,
        uint256[] chainIds,
        uint256[] amounts
    );

    event TransferSent (
        bytes32 indexed transferHash,
        address indexed recipient,
        uint256 amount,
        uint256 indexed transferNonce,
        uint256 relayerFee
    );

    modifier onlyL1Bridge {
        _verifySender(l1BridgeAddress);
        _;
    }

    modifier onlyGovernance {
        _verifySender(l1Governance);
        _;
    }

    constructor (
        address _l1Governance,
        IERC20 _l2CanonicalToken,
        address _l1BridgeAddress,
        uint256[] memory _supportedChainIds,
        address _committee
    )
        public
        Bridge(_committee)
        ERC20("DAI Hop Token", "hDAI")
    {
        l1Governance = _l1Governance;
        l2CanonicalToken = _l2CanonicalToken;
        l1BridgeAddress = _l1BridgeAddress;

        for (uint256 i = 0; i < _supportedChainIds.length; i++) {
            supportedChainIds[_supportedChainIds[i]] = true;
        }
    }

    /* ========== Virtual functions ========== */

    function _sendCrossDomainMessage(bytes memory _message) internal virtual;
    function _verifySender(address _expectedSender) internal virtual; 

    /* ========== Public functions ========== */

    function setExchangeAddress(address _exchangeAddress) public onlyGovernance {
        exchangeAddress = _exchangeAddress;
    }

    function setL1BridgeAddress(address _l1BridgeAddress) public onlyGovernance {
        l1BridgeAddress = _l1BridgeAddress;
    }

    function addSupportedChainId(uint256 _chainIds) public onlyGovernance {
        supportedChainIds[_chainIds] = true;
    }

    function removeSupportedChainId(uint256 _chainIds) public onlyGovernance {
        supportedChainIds[_chainIds] = false;
    }

    /// @notice _amount is the amount the user wants to send plus the relayer fee
    function send(
        uint256 _chainId,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        uint256 _amountOutMin,
        uint256 _deadline
    )
        public
    {
        require(_amount > 0, "L2_BRG: Must transfer a non-zero amount");
        require(_amount >= _relayerFee, "L2_BRG: Relayer fee cannot exceed amount");
        require(supportedChainIds[_chainId], "L2_BRG: _chainId is not supported");

        if (pendingTransfers.length >= 100) {
            commitTransfers();
        }

        _burn(msg.sender, _amount);

        bytes32 transferHash = getTransferHash(
            _chainId,
            msg.sender,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            _amountOutMin,
            _deadline
        );
        pendingTransfers.push(transferHash);

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
        uint256 _amountOutMin,
        uint256 _deadline,
        uint256 _destinationAmountOutMin,
        uint256 _destinationDeadline
    )
        public
    {
        require(_amount >= _relayerFee, "L2_BRG: relayer fee cannot exceed amount");

        l2CanonicalToken.transferFrom(msg.sender, address(this), _amount);

        address[] memory exchangePath = _getCHPath();
        uint256[] memory swapAmounts = IUniswapV2Router02(exchangeAddress).getAmountsOut(_amount, exchangePath);
        uint256 swapAmount = swapAmounts[1];

        l2CanonicalToken.approve(exchangeAddress, swapAmount);
        IUniswapV2Router02(exchangeAddress).swapExactTokensForTokens(
            _amount,
            _amountOutMin,
            exchangePath,
            _recipient,
            _deadline
        );

        send(_chainId, _recipient, swapAmount, _transferNonce, _relayerFee, _destinationAmountOutMin, _destinationDeadline);
    }

    function commitTransfers() public {
        require(pendingTransfers.length > 0, "L2_BRG: Must commit at least 1 Transfer");

        bytes32 root = MerkleUtils.getMerkleRoot(pendingTransfers);

        uint256[] memory chainAmounts = new uint256[](pendingAmountChainIds.length);
        for (uint256 i = 0; i < pendingAmountChainIds.length; i++) {
            uint256 chainId = pendingAmountChainIds[i];
            chainAmounts[i] = pendingAmountForChainId[chainId];

            // Clean up for the next batch of transfers as pendingAmountChainIds is iterated
            pendingAmountForChainId[chainId] = 0;
        }

        emit TransfersCommitted(root, pendingAmountChainIds, chainAmounts);

        bytes memory confirmTransferRootMessage = abi.encodeWithSignature(
            "confirmTransferRoot(bytes32,uint256[],uint256[])",
            root,
            pendingAmountChainIds,
            chainAmounts
        );

        delete pendingAmountChainIds;
        delete pendingTransfers;

        _sendCrossDomainMessage(confirmTransferRootMessage);
    }

    function mint(address _recipient, uint256 _amount) public onlyL1Bridge {
        _mint(_recipient, _amount);
    }

    function mintAndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin, uint256 _deadline) public onlyL1Bridge {
        _mintAndAttemptSwap(_recipient, _amount, _amountOutMin, _deadline);
    }

    function withdrawAndAttemptSwap(
        address _sender,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        bytes32 _transferRootHash,
        bytes32[] memory _proof,
        uint256 _amountOutMin,
        uint256 _deadline
    )
        public
    {
        bytes32 transferHash = getTransferHash(
            getChainId(),
            _sender,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            _amountOutMin,
            _deadline
        );

        require(_proof.verify(_transferRootHash, transferHash), "L2_BRG: Invalid transfer proof");
        _addToAmountWithdrawn(_transferRootHash, _amount);
        _withdrawAndAttemptSwap(transferHash, _recipient, _amount, _relayerFee, _amountOutMin, _deadline);
    }

    function bondWithdrawalAndAttemptSwap(
        address _sender,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        uint256 _amountOutMin,
        uint256 _deadline
    )
        public
    {
        bytes32 transferHash = getTransferHash(
            getChainId(),
            _sender,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            _amountOutMin,
            _deadline
        );

        _addDebit(_amount);
        _setBondedWithdrawalAmount(transferHash, _amount);
        _withdrawAndAttemptSwap(transferHash, _recipient, _amount, _relayerFee, _amountOutMin, _deadline);
    }

    function setTransferRoot(bytes32 _rootHash, uint256 _amount) public onlyL1Bridge {
        _setTransferRoot(_rootHash, _amount);
    }

    /* ========== Helper Functions ========== */

    function _addToPendingAmount(uint256 _chainId, uint256 _amount) internal {
        if (pendingAmountForChainId[_chainId] == 0) {
            pendingAmountChainIds.push(_chainId);
        }

        pendingAmountForChainId[_chainId] = pendingAmountForChainId[_chainId].add(_amount);
    }

    function _mintAndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin, uint256 _deadline) internal {
        _mint(address(this), _amount);
        _approve(address(this), exchangeAddress, _amount);

        try IUniswapV2Router02(exchangeAddress).swapExactTokensForTokens(
            _amount,
            _amountOutMin,
            _getHCPath(),
            _recipient,
            _deadline
        ) returns (uint[] memory) {} catch {
            // Transfer hToken to recipient if swap fails
            _transfer(address(this), _recipient, _amount);
        }
    }

    function _withdrawAndAttemptSwap(
        bytes32 _transferHash,
        address _recipient,
        uint256 _amount,
        uint256 _relayerFee,
        uint256 _amountOutMin,
        uint256 _deadline
    ) internal {
        _markTransferSpent(_transferHash);
        // distribute fee
        _transferFromBridge(msg.sender, _relayerFee);
        // Attempt swap to recipient
        uint256 amountAfterFee = _amount.sub(_relayerFee);
        _mintAndAttemptSwap(_recipient, amountAfterFee, _amountOutMin, _deadline);
    }

    function _getHCPath() internal view returns (address[] memory) {
        address[] memory exchangePath = new address[](2);
        exchangePath[0] = address(this);
        exchangePath[1] = address(l2CanonicalToken);
        return exchangePath;
    }

    function _getCHPath() internal view returns (address[] memory) {
        address[] memory exchangePath = new address[](2);
        exchangePath[0] = address(l2CanonicalToken);
        exchangePath[1] = address(this);
        return exchangePath;
    }

    /* ========== Override Functions ========== */

    function _transferFromBridge(address _recipient, uint256 _amount) internal override {
        _mint(_recipient, _amount);
    }

    function _transferToBridge(address _from, uint256 _amount) internal override {
        _burn(_from, _amount);
    }
}
