// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./Bridge.sol";

import "../libraries/MerkleUtils.sol";
import "../interfaces/IMessengerWrapper.sol";
import "./L1_BridgeConfig.sol";

/**
 * @dev L1_Bridge is responsible for the bonding and challenging of TransferRoots. All TransferRoots
 * originate in the L1_Bridge through `bondTransferRoot` and are propogated up to destination L2s.
 */

contract L1_Bridge is Bridge, L1_BridgeConfig {

    struct TransferBond {
        uint256 createdAt;
        bytes32 amountHash;
        bool confirmed;
        uint256 challengeStartTime;
        address challenger;
    }

    /* ========== State ========== */

    IERC20 public l1CanonicalToken;
    mapping(bytes32 => TransferBond) transferBonds;
    mapping(uint256 => uint256) public timeSlotToAmountBonded;
    uint256 public amountChallenged;

    /* ========== Events ========== */

    event TransferRootBonded (
        bytes32 root,
        uint256 amount
    );

    /* ========== Modifiers ========== */

    modifier onlyL2Bridge {
        // ToDo: Figure out how to check sender against an allowlist
        // IMessengerWrapper messengerWrapper = crossDomainMessenger[_chainId];
        // messengerWrapper.verifySender(msg.data);
        _;
    }

    constructor (IERC20 _l1CanonicalToken, address committee_) public Bridge(committee_) {
        l1CanonicalToken = _l1CanonicalToken;
    }

    /* ========== Public Transfers Functions ========== */

    function sendToL2(
        uint256 _chainId,
        address _recipient,
        uint256 _amount
    )
        public
    {
        bytes memory mintCalldata = abi.encodeWithSignature("mint(address,uint256)", _recipient, _amount);

        l1CanonicalToken.safeTransferFrom(msg.sender, address(this), _amount);
        getCrossDomainMessenger(_chainId).sendCrossDomainMessage(mintCalldata);
    }

    function sendToL2AndAttemptSwap(
        uint256 _chainId,
        address _recipient,
        uint256 _amount,
        uint256 _amountOutMin,
        uint256 _deadline
    )
        public
    {
        bytes memory mintAndAttemptSwapCalldata = abi.encodeWithSignature(
            "mintAndAttemptSwap(address,uint256,uint256,uint256)",
            _recipient,
            _amount,
            _amountOutMin,
            _deadline
        );

        getCrossDomainMessenger(_chainId).sendCrossDomainMessage(mintAndAttemptSwapCalldata);
        l1CanonicalToken.safeTransferFrom(msg.sender, address(this), _amount);
    }

    /* ========== Public Transfer Root Functions ========== */

    /**
     * @dev Setting a TransferRoot is a two step process.
     * @dev   1. The TransferRoot is bonded with `bondTransferRoot`. Withdrawals can now begin on L1
     * @dev      and recipient L2's
     * @dev   2. The TransferRoot is confirmed after `confirmTransferRoot` is called by the l2 bridge
     * @dev      where the TransferRoot originated.
     */

    /**
     * @dev Used by the committee to bond a TransferRoot and propogate it up to destination L2s
     * @param _transferRootHash The Merkle root of the TransferRoot Merkle tree
     * @param _chainIds The ids of the destination chains
     * @param _chainAmounts The amounts desitned for each desitination chain
     */
    function bondTransferRoot(
        bytes32 _transferRootHash,
        uint256[] memory _chainIds,
        uint256[] memory _chainAmounts
    )
        public
        onlyCommittee
        requirePositiveBalance
    {
        require(_chainIds.length == _chainAmounts.length, "L1_BRG: chainIds and chainAmounts must be the same length");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _chainAmounts.length; i++) {
            totalAmount = totalAmount.add(_chainAmounts[i]);
        }

        uint256 currentTimeSlot = getTimeSlot(now);
        uint256 bondAmount = getBondForTransferAmount(totalAmount);
        timeSlotToAmountBonded[currentTimeSlot] = timeSlotToAmountBonded[currentTimeSlot].add(bondAmount);

        bytes32 amountHash = getAmountHash(_chainIds, _chainAmounts);
        transferBonds[_transferRootHash] = TransferBond(now, amountHash, false, 0, address(0));

        // Set TransferRoots on recipient Bridges
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

                IMessengerWrapper messenger = getCrossDomainMessenger(_chainIds[i]);
                messenger.sendCrossDomainMessage(setTransferRootMessage);
            }
        }

        emit TransferRootBonded(_transferRootHash, totalAmount);
    }

    /**
     * @dev Used by an L2 bridge to confirm a TransferRoot via cross-domain message. Once a TransferRoot
     * has been confirmed, any challenge against that TransferRoot can be resolved as unsuccessful.
     * @param _transferRootHash The Merkle root of the TransferRoot Merkle tree
     * @param _amountHash The hash of the destination chainIds and amounts
     */
    function confirmTransferRoot(bytes32 _transferRootHash, bytes32 _amountHash) public onlyL2Bridge {
        TransferBond storage transferBond = transferBonds[_transferRootHash];
        require(transferBond.amountHash == _amountHash, "L1_BRG: Amount hash is invalid");
        transferBond.confirmed = true;
    }

    /* ========== Public TransferRoot Challenges ========== */

    function challengeTransferBond(bytes32 _transferRootHash) public {
        TransferRoot memory transferRoot = getTransferRoot(_transferRootHash);
        TransferBond storage transferBond = transferBonds[_transferRootHash];
        // Require it's within 4 hour period 
        require(!transferBond.confirmed, "L1_BRG: Transfer root has already been confirmed");

        // Get stake for challenge
        uint256 challengeStakeAmount = getChallengeAmountForTransferAmount(transferRoot.total);
        l1CanonicalToken.transferFrom(msg.sender, address(this), challengeStakeAmount);

        transferBond.challengeStartTime = now;
        transferBond.challenger = msg.sender;

        // Move amount from timeSlotToAmountBonded to debit
        uint256 timeSlot = getTimeSlot(transferBond.createdAt);
        uint256 bondAmount = getBondForTransferAmount(transferRoot.total);
        timeSlotToAmountBonded[timeSlot] = timeSlotToAmountBonded[timeSlot].sub(bondAmount);

        _addDebit(bondAmount);
    }

    function resolveChallenge(bytes32 _transferRootHash) public {
        TransferRoot memory transferRoot = getTransferRoot(_transferRootHash);
        TransferBond storage transferBond = transferBonds[_transferRootHash];

        require(transferBond.challengeStartTime != 0, "L1_BRG: Transfer root has not been challenged");
        require(now > transferBond.challengeStartTime.add(getChallengeResolutionPeriod()), "L1_BRG: Challenge period has not ended");

        uint256 challengeStakeAmount = getChallengeAmountForTransferAmount(transferRoot.total);

        if (transferBond.confirmed) {
            // Invalid challenge
            // Credit the committee back with the bond amount plus the challenger's stake
            _addCredit(getBondForTransferAmount(transferRoot.total).add(challengeStakeAmount));
        } else {
            // Valid challenge
            // Reward challenger with their stake times two
            l1CanonicalToken.transfer(transferBond.challenger, challengeStakeAmount.mul(2));
        }
    }

    /* ========== Internal functions ========== */

    function _transferFromBridge(address _recipient, uint256 _amount) internal override {
        l1CanonicalToken.safeTransfer(_recipient, _amount);
    }

    function _transferToBridge(address _from, uint256 _amount) internal override {
        l1CanonicalToken.safeTransferFrom(_from, address(this), _amount);
    }

    function _additionalDebit() internal view override returns (uint256) {
        uint256 currentTimeSlot = getTimeSlot(now);
        uint256 bonded = 0;

        for (uint256 i = 0; i < getNumberOfChallengeableTimeSlots(); i++) {
            bonded = bonded.add(timeSlotToAmountBonded[currentTimeSlot - i]);
        }

        return bonded;
    }
}
