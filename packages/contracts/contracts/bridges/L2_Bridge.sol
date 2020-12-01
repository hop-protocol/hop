pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Bridge.sol";
import "../test/mockOVM_CrossDomainMessenger.sol";

import "../libraries/MerkleUtils.sol";

abstract contract L2_Bridge is ERC20, Bridge {
    using SafeMath for uint256;
    using MerkleProof for bytes32[];

    struct TransferRoot {
        uint256 total;
        uint256 amountWithdrawn;
    }

    address public l1BridgeAddress;
    address public exchangeAddress;
    address public oDaiAddress;
    address[] public exchangePath;
    uint256 public swapDeadlineBuffer;

    bytes32[] public pendingTransfers;
    bytes32[] public pendingAmountLayerIds;
    mapping(bytes32 => uint256) pendingAmountForLayerId;

    mapping(bytes32 => TransferRoot) transferRoots;
    mapping(bytes32 => bool) public spentTransferHashes;

    event TransfersCommitted (
        bytes32 root,
        uint256 amount
    );

    constructor () public ERC20("DAI Hop Token", "hDAI") {}

    /**
     * Abstract functions
     */

    function getLayerId() public virtual returns (bytes32);
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

    function withdraw(
        address _recipient,
        uint256 _amount,
        uint256 _transferNonce,
        uint256 _relayerFee,
        bytes32 _transferRoot,
        bytes32[] memory _proof
    )
        public
    {
        bytes32 transferHash = getTransferHash(
            getLayerId(),
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );
        uint256 totalAmount = _amount.add(_relayerFee);
        TransferRoot storage rootBalance = transferRoots[_transferRoot];

        require(!spentTransferHashes[transferHash], "BDG: The transfer has already been withdrawn");
        require(_proof.verify(_transferRoot, transferHash), "BDG: Invalid transfer proof");
        require(rootBalance.amountWithdrawn.add(totalAmount) <= rootBalance.total, "BDG: Withdrawal exceeds TransferRoot total");

        spentTransferHashes[transferHash] = true;
        rootBalance.amountWithdrawn = rootBalance.amountWithdrawn.add(totalAmount);
        _mint(_recipient, _amount);
        _mint(msg.sender, _relayerFee);
    }

    // ToDo: withdraw and attempt to swap

    /**
     * Internal functions
     */

    function _addToPendingAmount(bytes32 _layerId, uint256 _amount) internal {
        if (pendingAmountForLayerId[_layerId] == 0) {
            pendingAmountLayerIds.push(_layerId);
        }

        pendingAmountForLayerId[_layerId] = pendingAmountForLayerId[_layerId].add(_amount);
    }
}
