// SPDX-License-Identifier: MIT

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
    IERC20 public l2CanonicalToken;

    bytes32[] public pendingTransfers;
    uint256[] public pendingAmountChainIds;
    mapping(uint256 => uint256) pendingAmountForChainId;
    mapping(bytes32 => uint256) bondedWithdrawalAmounts;

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

    modifier onlyL1Bridge {
        _verifySender();
        _;
    }

    constructor (
        IERC20 _l2CanonicalToken,
        address committee_
    )
        public
        Bridge(IERC20(this), committee_)
        ERC20("DAI Hop Token", "hDAI")
    {
        l2CanonicalToken = _l2CanonicalToken;
    }

    function _sendCrossDomainMessage(bytes memory _message) internal virtual;
    function _verifySender() internal virtual; 

    /* ========== Public functions ========== */

    function setExchangeAddress(address _exchangeAddress) public {
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
        uint256 _relayerFee,
        uint256 _amountOutMin,
        uint256 _deadline
    )
        public
    {
        require(_amount >= _relayerFee, "BDG: relayer fee cannot exceed amount");
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
        uint256 _amountOutMin,
        uint256 _deadline,
        uint256 _destinationAmountOutMin,
        uint256 _destinationDeadline
    )
        public
    {
        require(_amount >= _relayerFee, "BDG: relayer fee cannot exceed amount");

        l2CanonicalToken.transferFrom(msg.sender, address(this), _amount);

        address[] memory exchangePath = new address[](2);
        exchangePath[0] = address(l2CanonicalToken);
        exchangePath[1] = address(this);
        uint256[] memory swapAmounts = IUniswapV2Router02(exchangeAddress).getAmountsOut(_amount, exchangePath);
        uint256 swapAmount = swapAmounts[1];

        bytes memory swapCalldata = _getSwapCalldata(
            _recipient,
            _amount,
            _amountOutMin,
            exchangePath,
            _deadline
        );
        (bool success,) = exchangeAddress.call(swapCalldata);
        require(success, "L2BDG: Swap failed");

        send(_chainId, _recipient, swapAmount, _transferNonce, _relayerFee, _destinationAmountOutMin, _destinationDeadline);
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

        _sendCrossDomainMessage(confirmTransferRootMessage);
    }

    function mint(address _recipient, uint256 _amount) public onlyL1Bridge {
        _mint(_recipient, _amount);
    }

    function mintAndAttemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin, uint256 _deadline) public onlyL1Bridge {
        _mint(address(this), _amount);
        _attemptSwap(_recipient, _amount, _amountOutMin, _deadline);
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

        require(_proof.verify(_transferRootHash, transferHash), "BDG: Invalid transfer proof");
        _addToAmountWithdrawn(_transferRootHash, _amount);
        _markTransferSpent(transferHash);

        _transfer(msg.sender, _relayerFee);
        _attemptSwap(_recipient, _amount.sub(_relayerFee), _amountOutMin, _deadline);
    }

    function _attemptSwap(address _recipient, uint256 _amount, uint256 _amountOutMin, uint256 _deadline) public {
        address[] memory exchangePath = new address[](2);
        exchangePath[0] = address(this);
        exchangePath[1] = address(l2CanonicalToken);
        bytes memory swapCalldata = _getSwapCalldata(_recipient, _amount, _amountOutMin, exchangePath, _deadline);
        (bool success,) = exchangeAddress.call(swapCalldata);

        if (!success) {
            _transferFallback(_recipient, _amount);
        }
    }

    function approveExchangeTransfer() public {
        approve(exchangeAddress, uint256(-1));
    }

    function approveODaiExchangeTransfer() public {
        l2CanonicalToken.approve(exchangeAddress, uint256(-1));
    }

    function _transferFallback(address _recipient, uint256 _amount) internal {
        _transfer(address(this), _recipient, _amount);
    }

    /* ========== TransferRoots ========== */

    function setTransferRoot(bytes32 _rootHash, uint256 _amount) public onlyL1Bridge {
        _setTransferRoot(_rootHash, _amount);
    }

    /* ========== Transfers ========== */

    function bondWithdrawal(
        address _sender,
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee
    )
        public
        onlyCommittee
        requirePositiveBalance
    {
        bytes32 transferHash = getTransferHash(
            getChainId(),
            _sender,
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee,
            0,
            0
        );

        _addDebit(_amount);
        bondedWithdrawalAmounts[transferHash] = _amount;

        _markTransferSpent(transferHash);

        _transfer(_recipient, _amount.sub(_relayerFee));
        _transfer(msg.sender, _relayerFee);
    }

    function settleBondedWithdrawal(
        bytes32 _transferHash,
        bytes32 _transferRootHash,
        bytes32[] memory _proof
    )
        public
    {
        require(_proof.verify(_transferRootHash, _transferHash), "BDG: Invalid transfer proof");

        uint256 amount = bondedWithdrawalAmounts[_transferHash];
        _addToAmountWithdrawn(_transferRootHash, amount);

        bondedWithdrawalAmounts[_transferRootHash] = 0;
        _addCredit(amount);
    }

    /* ========== Internal Functions ========== */

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
        address[] memory _exchangePath,
        uint256 _deadline
    )
        internal
        returns (bytes memory)
    {
        return abi.encodeWithSignature(
            "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
            _amount,
            _amountOutMin,
            _exchangePath,
            _recipient,
            _deadline
        );
    }
}
