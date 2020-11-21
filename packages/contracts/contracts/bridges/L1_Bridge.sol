pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./Bridge.sol";

import "../libraries/MerkleUtils.sol";

contract L1_Bridge is Bridge {
    using SafeMath for uint256;
    using MerkleProof for bytes32[];
    using SafeERC20 for IERC20;

    /**
     * Constants
     */
    uint256 constant CHALLENGE_AMOUNT_MULTIPLIER = 1;
    uint256 constant CHALLENGE_AMOUNT_DIVISOR = 10;
    uint256 constant TIME_SLOT_SIZE = 1 hours;
    uint256 constant CHALLENGE_PERIOD = 4 hours;
    uint256 constant CHALLENGE_RESOLUTION_PERIOD = 8 days;

    struct TransferRoot {
        uint256 createdAt;
        uint256 total;
        uint256 amountWithdrawn;
        bool confirmed;
        uint256 challengeStartTime;
        address challenger;
    }

    IERC20 token;

    mapping(bytes32 => address) public l1Messenger;

    address public committee;
    uint256 public committeeBond;
    mapping(uint256 => uint256) public timeSlotToAmountBonded;
    uint256 public amountChallenged;

    mapping(bytes32 => TransferRoot) public transferRoots;
    mapping(bytes32 => bool) public spentTransferHashes;

    event DepositsCommitted (
        bytes32 root,
        uint256 amount
    );

    event TransferRootBonded (
        bytes32 root,
        uint256 amount
    );

    constructor (IERC20 _token) public {
        token = _token;
    }

    function setL1MessengerWrapper(bytes32 _messengerId, address _l1Messenger) public {
        l1Messenger[_messengerId] = _l1Messenger;
    }

    function getMessengerId(string calldata _messengerLabel) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_messengerLabel));
    }

    function sendToL2(
        bytes32 _messengerId,
        address _recipient,
        uint256 _amount
    )
        public
    {
        bytes memory mintCalldata = abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount);
        bytes memory sendMessageCalldata = abi.encodeWithSignature("sendMessageToL2(bytes)", mintCalldata);

        l1Messenger[_messengerId].call(sendMessageCalldata);
        token.safeTransferFrom(msg.sender, address(this), _amount);
    }

    function sendToL2AndAttemptSwap(
        bytes32 _messengerId,
        address _recipient,
        uint256 _amount,
        uint256 _amountOutMin
    )
        public
    {
        bytes memory mintAndAttemptSwapCalldata = abi.encodeWithSignature(
            "mintAndAttemptSwap(address,uint256,uint256)",
            _recipient,
            _amount,
            _amountOutMin
        );
        bytes memory sendMessageCalldata = abi.encodeWithSignature("sendMessageToL2(bytes)", mintAndAttemptSwapCalldata);

        l1Messenger[_messengerId].call(sendMessageCalldata);
        token.safeTransferFrom(msg.sender, address(this), _amount);
    }

    /**
     * Committee
     */

    function committeeStake(uint256 _amount) public {
        token.transferFrom(msg.sender, address(this), _amount);
        committeeBond = committeeBond.add(_amount);
    }

    // onlyCommittee
    // ToDo: Add time delay to unstake
    function committeeUnstake(uint256 _amount) public {
        committeeBond = committeeBond.sub(_amount, "BDG: Amount exceeds total stake");
        token.transfer(committee, _amount);
    }

    /**
     * Transfer Roots
     */

    // onlyCrossDomainBridge
    function setTransferRoot(bytes32 _transferRootHash, uint256 _amount) public {
        transferRoots[_transferRootHash] = TransferRoot(now, _amount, 0, false, 0, address(0));
    }

    // onlyCommittee
    function bondTransferRoot(bytes32 _transferRootHash, uint256 _amount) public {
        require(totalBondedWith(_amount) <= committeeBond, "BDG: Amount exceeds committee bond");

        uint256 currentTimeSlot = timeToTimeSlot(now);
        timeSlotToAmountBonded[currentTimeSlot] = timeSlotToAmountBonded[currentTimeSlot].add(_amount);

        transferRoots[_transferRootHash] = TransferRoot(now, _amount, 0, false, 0, address(0));

        emit TransferRootBonded(_transferRootHash, _amount);
    }

    // onlyCrossDomainBridge
    function confirmTransferRoot(bytes32 _transferRootHash, uint256 _amount) public {
        TransferRoot storage transferRoot = transferRoots[_transferRootHash];
        transferRoot.confirmed = true;
    }

    /**
     * Transfer Root Challenges
     */

    function challengeTransferRoot(bytes32 _transferRootHash) public {
        TransferRoot storage transferRoot = transferRoots[_transferRootHash];
        // Require it's within 4 hour period 
        require(!transferRoot.confirmed, "BDG: Transfer root has already been confirmed");

        // Get stake for challenge
        uint256 challengeStakeAmount = transferRoot.total
            .mul(CHALLENGE_AMOUNT_MULTIPLIER)
            .div(CHALLENGE_AMOUNT_DIVISOR);
        token.transferFrom(msg.sender, address(this), challengeStakeAmount);

        transferRoot.challengeStartTime = now;
        transferRoot.challenger = msg.sender;

        // Move amount from timeSlotToAmountBonded to amountChallenged
        uint256 timeSlot = timeToTimeSlot(transferRoot.createdAt);
        timeSlotToAmountBonded[timeSlot] = timeSlotToAmountBonded[timeSlot].sub(transferRoot.total);
        amountChallenged = amountChallenged.add(transferRoot.total);
    }

    function resolveChallenge(bytes32 _transferRootHash) public {
        TransferRoot storage transferRoot = transferRoots[_transferRootHash];
        require(transferRoot.challengeStartTime != 0, "BDG: Transfer root has not been challenged");
        require(now > transferRoot.challengeStartTime.add(CHALLENGE_RESOLUTION_PERIOD), "BDG: Challenge period has not ended");

        uint256 challengeStakeAmount = transferRoot.total
            .mul(CHALLENGE_AMOUNT_MULTIPLIER)
            .div(CHALLENGE_AMOUNT_DIVISOR);

        if (transferRoot.confirmed) {
            // Invalid challenge, send challengers stake to committee
            token.transfer(committee, challengeStakeAmount);
        } else {
            // Valid challenge, reward challenger with their stake times 2 and slash committee by the
            // transfer root amount plus the challenge stake
            token.transfer(transferRoot.challenger, challengeStakeAmount.mul(2));
            committeeBond = committeeBond.sub(transferRoot.total).sub(challengeStakeAmount);
        }

        amountChallenged = amountChallenged.sub(transferRoot.total);
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
            _recipient,
            _amount,
            _transferNonce,
            _relayerFee
        );
        uint256 totalAmount = _amount + _relayerFee;
        TransferRoot storage rootBalance = transferRoots[_transferRoot];

        require(!spentTransferHashes[transferHash], "BDG: The transfer has already been withdrawn");
        require(_proof.verify(_transferRoot, transferHash), "BDG: Invalid transfer proof");
        require(rootBalance.amountWithdrawn.add(totalAmount) <= rootBalance.total, "BDG: Withdrawal exceeds TransferRoot total");

        spentTransferHashes[transferHash] = true;
        rootBalance.amountWithdrawn = rootBalance.amountWithdrawn.add(totalAmount);
        token.safeTransfer(_recipient, _amount);
        token.safeTransfer(msg.sender, _relayerFee);
    }

    // TODO: How else should we have user's deposit funds for fee
    receive () external payable {}

    /**
     * Helpers
     */

    function totalBonded() public view returns (uint256) {
        uint256 currentTimeSlot = timeToTimeSlot(now);
        uint256 bonded = 0;
        // ToDo: Make number of iterations a variable
        for (uint256 i = 0; i < CHALLENGE_PERIOD/TIME_SLOT_SIZE; i++) {
            bonded = bonded.add(timeSlotToAmountBonded[currentTimeSlot - i]);
        }

        // Add any amount that's currently being challenged
        bonded = bonded.add(amountChallenged);

        // Add amount needed to pay any challengers
        bonded = bonded.add(bonded.mul(CHALLENGE_AMOUNT_MULTIPLIER).div(CHALLENGE_AMOUNT_DIVISOR));

        return bonded;
    }

    function totalBondedWith(uint256 _amount) public view returns (uint256) {
        // Bond covers _amount plus a bounty to pay a potential challenger
        uint256 bondForAmount = _amount.add(_amount.mul(CHALLENGE_AMOUNT_MULTIPLIER).div(CHALLENGE_AMOUNT_DIVISOR));
        return totalBonded().add(bondForAmount);
    }

    function timeToTimeSlot(uint256 _time) public pure returns (uint256) {
        return _time / TIME_SLOT_SIZE;
    }
}
