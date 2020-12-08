pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./Bridge.sol";

import "../libraries/MerkleUtils.sol";
import "../interfaces/IMessengerWrapper.sol";

contract L1_Bridge is Bridge {

    struct TransferBond {
        uint256 createdAt;
        bytes32 amountHash;
        bool confirmed;
        uint256 challengeStartTime;
        address challenger;
    }

    /**
     * Constants
     */

    uint256 constant CHALLENGE_AMOUNT_MULTIPLIER = 1;
    uint256 constant CHALLENGE_AMOUNT_DIVISOR = 10;
    uint256 constant TIME_SLOT_SIZE = 1 hours;
    uint256 constant CHALLENGE_PERIOD = 4 hours;
    uint256 constant CHALLENGE_RESOLUTION_PERIOD = 8 days;

    /**
     * State
     */

    IERC20 public token;
    mapping(uint256 => IMessengerWrapper) public l1Messenger;

    mapping(bytes32 => TransferBond) transferBonds;

    address public committee;
    uint256 public committeeBond;
    mapping(uint256 => uint256) public timeSlotToAmountBonded;
    uint256 public amountChallenged;

    /**
     * Events
     */

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

    /**
     * Public Management Functions
     */

    function setL1MessengerWrapper(uint256 _chainId, IMessengerWrapper _l1Messenger) public {
        l1Messenger[_chainId] = _l1Messenger;
    }

    /**
     * Public Transfers Functions
     */

    function sendToL2(
        uint256 _chainId,
        address _recipient,
        uint256 _amount
    )
        public
    {
        bytes memory mintCalldata = abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount);

        token.safeTransferFrom(msg.sender, address(this), _amount);
        l1Messenger[_chainId].sendMessageToL2(mintCalldata);
    }

    function sendToL2AndAttemptSwap(
        uint256 _chainId,
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

        l1Messenger[_chainId].sendMessageToL2(mintAndAttemptSwapCalldata);
        token.safeTransferFrom(msg.sender, address(this), _amount);
    }

    /**
     * Public Committee Staking Functions
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
     * Public Transfer Root Functions
     */

    /**
     * Setting a TransferRoot is a two step process.
     *   1. The TransferRoot is bonded with `bondTransferRoot`. Withdrawals can now begin on L1
     *      and recipient L2's
     *   2. The TransferRoot is confirmed after `confirmTransferRoot` is called by the l2 bridge
     *      where the TransferRoot originated.
     */

    // onlyCommittee
    function bondTransferRoot(bytes32 _transferRootHash, uint256[] memory _chainIds, uint256[] memory _chainAmounts) public {
        require(_chainIds.length == _chainAmounts.length, "BDG: chainIds and chainAmounts must be the same length");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _chainAmounts.length; i++) {
            totalAmount = totalAmount.add(_chainAmounts[i]);
        }
        require(getTotalBondedWith(totalAmount) <= committeeBond, "BDG: Amount exceeds committee bond");

        uint256 currentTimeSlot = getTimeSlot(now);
        timeSlotToAmountBonded[currentTimeSlot] = timeSlotToAmountBonded[currentTimeSlot].add(totalAmount);

        bytes32 amountHash = getAmountHash(_chainIds, _chainAmounts);

        transferBonds[_transferRootHash] = TransferBond(now, amountHash, false, 0, address(0));

        for (uint256 i = 0; i < _chainIds.length; i++) {
            if (_chainIds[i] == getChainId()) {
                // Set L1 transfer root
                _setTransferRoot(_transferRootHash, _chainAmounts[i]);
            } else {
                // Set L2 transfer root
                bytes memory setTransferRootMessage = abi.encodeWithSignature(
                    "setTransferRoot(bytes32,uint256)",
                    _transferRootHash,
                    _chainAmounts[i]
                );

                l1Messenger[_chainIds[i]].sendMessageToL2(setTransferRootMessage);
            }
        }

        emit TransferRootBonded(_transferRootHash, totalAmount);
    }

    // onlyCrossDomainBridge
    function confirmTransferRoot(bytes32 _transferRootHash, bytes32 _amountHash) public {
        TransferBond storage transferBond = transferBonds[_transferRootHash];
        require(transferBond.amountHash == _amountHash, "BDG: Amount hash is invalid");
        transferBond.confirmed = true;
    }

    /**
     * Public TransferRoot Challenges
     */

    function challengeTransferBond(bytes32 _transferRootHash) public {
        TransferRoot memory transferRoot = getTransferRoot(_transferRootHash);
        TransferBond storage transferBond = transferBonds[_transferRootHash];
        // Require it's within 4 hour period 
        require(!transferBond.confirmed, "BDG: Transfer root has already been confirmed");

        // Get stake for challenge
        uint256 challengeStakeAmount = transferRoot.total
            .mul(CHALLENGE_AMOUNT_MULTIPLIER)
            .div(CHALLENGE_AMOUNT_DIVISOR);
        token.transferFrom(msg.sender, address(this), challengeStakeAmount);

        transferBond.challengeStartTime = now;
        transferBond.challenger = msg.sender;

        // Move amount from timeSlotToAmountBonded to amountChallenged
        uint256 timeSlot = getTimeSlot(transferBond.createdAt);
        timeSlotToAmountBonded[timeSlot] = timeSlotToAmountBonded[timeSlot].sub(transferRoot.total);
        amountChallenged = amountChallenged.add(transferRoot.total);
    }

    function resolveChallenge(bytes32 _transferRootHash) public {
        TransferRoot memory transferRoot = getTransferRoot(_transferRootHash);
        TransferBond storage transferBond = transferBonds[_transferRootHash];

        require(transferBond.challengeStartTime != 0, "BDG: Transfer root has not been challenged");
        require(now > transferBond.challengeStartTime.add(CHALLENGE_RESOLUTION_PERIOD), "BDG: Challenge period has not ended");

        uint256 challengeStakeAmount = transferRoot.total
            .mul(CHALLENGE_AMOUNT_MULTIPLIER)
            .div(CHALLENGE_AMOUNT_DIVISOR);

        if (transferBond.confirmed) {
            // Invalid challenge, send challengers stake to committee
            token.transfer(committee, challengeStakeAmount);
        } else {
            // Valid challenge, reward challenger with their stake times 2 and slash committee by the
            // transfer root amount plus the challenge stake
            token.transfer(transferBond.challenger, challengeStakeAmount.mul(2));
            committeeBond = committeeBond.sub(transferRoot.total).sub(challengeStakeAmount);
        }

        amountChallenged = amountChallenged.sub(transferRoot.total);
    }

    /**
     * Public Getters
     */

    function getTotalBonded() public view returns (uint256) {
        uint256 currentTimeSlot = getTimeSlot(now);
        uint256 bonded = 0;

        for (uint256 i = 0; i < CHALLENGE_PERIOD/TIME_SLOT_SIZE; i++) {
            bonded = bonded.add(timeSlotToAmountBonded[currentTimeSlot - i]);
        }

        // Add any amount that's currently being challenged
        bonded = bonded.add(amountChallenged);

        // Add amount needed to pay any challengers
        bonded = bonded.add(bonded.mul(CHALLENGE_AMOUNT_MULTIPLIER).div(CHALLENGE_AMOUNT_DIVISOR));

        return bonded;
    }

    function getTotalBondedWith(uint256 _amount) public view returns (uint256) {
        // Bond covers _amount plus a bounty to pay a potential challenger
        uint256 bondForAmount = _amount.add(_amount.mul(CHALLENGE_AMOUNT_MULTIPLIER).div(CHALLENGE_AMOUNT_DIVISOR));
        return getTotalBonded().add(bondForAmount);
    }

    function getTimeSlot(uint256 _time) public pure returns (uint256) {
        return _time / TIME_SLOT_SIZE;
    }

    function getChainId() public override pure returns (uint256) {
        return 1;
    }

    /**
     * Internal functions
     */

    function _transfer(address _recipient, uint256 _amount) internal override {
        token.safeTransfer(_recipient, _amount);
    }
}
