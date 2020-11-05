// SPDX-License-Identifier: Apache-2.0

/*
 * Copyright 2019-2020, Offchain Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

pragma solidity ^0.5.11;

import "./IArbRollup.sol";
import "./NodeGraph.sol";
import "./Staking.sol";
import "../inbox/IGlobalInbox.sol";
import "../libraries/Cloneable.sol";

contract ArbRollup is IArbRollup, Cloneable, NodeGraph, Staking {
    // invalid path proof
    string private constant PLACE_LEAF = "PLACE_LEAF";

    // invalid leaf
    string private constant MOVE_LEAF = "MOVE_LEAF";

    // invalid path proof
    string private constant RECOV_PATH_PROOF = "RECOV_PATH_PROOF";
    // Invalid conflict proof
    string private constant RECOV_CONFLICT_PROOF = "RECOV_CONFLICT_PROOF";
    // Proof must be of nonzero length
    string private constant RECVOLD_LENGTH = "RECVOLD_LENGTH";
    // invalid leaf
    string private constant RECOV_DEADLINE_LEAF = "RECOV_DEADLINE_LEAF";
    // Node is not passed deadline
    string private constant RECOV_DEADLINE_TIME = "RECOV_DEADLINE_TIME";

    // invalid staker location proof
    string private constant MAKE_STAKER_PROOF = "MAKE_STAKER_PROOF";

    // Type is not invalid
    string private constant CONF_INV_TYPE = "CONF_INV_TYPE";
    // Node is not passed deadline
    string private constant CONF_TIME = "CONF_TIME";
    // There must be at least one staker
    string private constant CONF_HAS_STAKER = "CONF_HAS_STAKER";

    // Only callable by owner
    string private constant ONLY_OWNER = "ONLY_OWNER";

    string public constant VERSION = "0.7.2";

    address payable public owner;

    IGlobalInbox public globalInbox;

    event RollupCreated(
        bytes32 initVMHash,
        uint128 gracePeriodTicks,
        uint128 arbGasSpeedLimitPerTick,
        uint64 maxExecutionSteps,
        uint128 stakeRequirement,
        address owner,
        bytes extraConfig
    );

    event ConfirmedAssertion(bytes32[] logsAccHash);

    event ConfirmedValidAssertion(bytes32 indexed nodeHash);

    function init(
        bytes32 _vmState,
        uint128 _gracePeriodTicks,
        uint128 _arbGasSpeedLimitPerTick,
        uint64 _maxExecutionSteps,
        uint128 _stakeRequirement,
        address _stakeToken,
        address payable _owner,
        address _challengeFactoryAddress,
        address _globalInboxAddress,
        bytes calldata _extraConfig
    ) external {
        emit RollupCreated(
            _vmState,
            _gracePeriodTicks,
            _arbGasSpeedLimitPerTick,
            _maxExecutionSteps,
            _stakeRequirement,
            _owner,
            _extraConfig
        );

        NodeGraph.init(_vmState, _gracePeriodTicks, _arbGasSpeedLimitPerTick, _maxExecutionSteps);
        Staking.init(_stakeRequirement, _stakeToken, _challengeFactoryAddress);
        globalInbox = IGlobalInbox(_globalInboxAddress);
        owner = _owner;

        globalInbox.sendInitializationMessage(
            abi.encodePacked(
                uint256(_gracePeriodTicks),
                uint256(_arbGasSpeedLimitPerTick),
                uint256(_maxExecutionSteps),
                uint256(_stakeRequirement),
                bytes32(bytes20(_stakeToken)),
                bytes32(bytes20(_owner)),
                _extraConfig
            )
        );
    }

    /**
     * @notice Place a stake on an existing node at or after the latest confirmed node
     * @param proof1 Node graph proof that the stake location is a decendent of latest confirmed
     * @param proof2 Node graph proof that the stake location is an ancestor of a current leaf
     */
    function placeStake(bytes32[] calldata proof1, bytes32[] calldata proof2) external payable {
        bytes32 location = RollupUtils.calculateLeafFromPath(latestConfirmed(), proof1);
        bytes32 leaf = RollupUtils.calculateLeafFromPath(location, proof2);
        require(isValidLeaf(leaf), PLACE_LEAF);
        createStake(location);
    }

    /**
     * @notice Move an existing stake to an existing leaf that is a decendent of the node the stake exists on
     * @param proof1 Node graph proof that the destination location is a decendent of the current location
     * @param proof2 Node graph proof that the stake location is an ancestor of a current leaf
     */
    function moveStake(bytes32[] calldata proof1, bytes32[] calldata proof2) external {
        bytes32 stakerLocation = getStakerLocation(msg.sender);
        bytes32 newLocation = RollupUtils.calculateLeafFromPath(stakerLocation, proof1);
        bytes32 leaf = RollupUtils.calculateLeafFromPath(newLocation, proof2);
        require(isValidLeaf(leaf), MOVE_LEAF);
        updateStakerLocation(msg.sender, newLocation);
    }

    /**
     * @notice Redeem your stake if it is on or before the current latest confirmed node
     * @param proof Node graph proof your stake is on or before the latest confirmed node
     */
    function recoverStakeConfirmed(bytes32[] calldata proof) external {
        _recoverStakeConfirmed(msg.sender, proof);
    }

    /**
     * @notice Force a stake to be redeemed if it is before the current latest confirmed node
     * @param stakerAddress Address of the staker whose stake will be removed
     * @param proof Node graph proof your stake is before the latest confirmed node
     */
    function recoverStakeOld(address payable stakerAddress, bytes32[] calldata proof) external {
        require(proof.length > 0, RECVOLD_LENGTH);
        _recoverStakeConfirmed(stakerAddress, proof);
    }

    /**
     * @notice Force a stake to be redeemed if it is place on a node which can never be confirmed
     * @dev This method works by showing that the staker's position conflicts with the latest confirmed node
     * @param stakerAddress Address of the staker whose stake will be removed
     * @param node Identifier of a node which is a common ancestor of the latest confirmed node and the staker's location
     * @param latestConfirmedProof Node graph proof that the latest confirmed node is a decendent of the supplied node
     * @param stakerProof Node graph proof that the staker's node is a decendent of the supplied node
     */
    function recoverStakeMooted(
        address payable stakerAddress,
        bytes32 node,
        bytes32[] calldata latestConfirmedProof,
        bytes32[] calldata stakerProof
    ) external {
        bytes32 stakerLocation = getStakerLocation(stakerAddress);
        require(
            latestConfirmedProof[0] != stakerProof[0] &&
                RollupUtils.calculateLeafFromPath(node, latestConfirmedProof) ==
                latestConfirmed() &&
                RollupUtils.calculateLeafFromPath(node, stakerProof) == stakerLocation,
            RECOV_CONFLICT_PROOF
        );
        refundStaker(stakerAddress);
    }

    // Kick off if successor node whose deadline has passed
    // TODO: Add full documentation
    function recoverStakePassedDeadline(
        address payable stakerAddress,
        uint256 deadlineTicks,
        bytes32 disputableNodeHashVal,
        uint256 childType,
        bytes32 vmProtoStateHash,
        bytes32[] calldata proof
    ) external {
        bytes32 stakerLocation = getStakerLocation(stakerAddress);
        bytes32 nextNode = RollupUtils.childNodeHash(
            stakerLocation,
            deadlineTicks,
            disputableNodeHashVal,
            childType,
            vmProtoStateHash
        );
        bytes32 leaf = RollupUtils.calculateLeafFromPath(nextNode, proof);
        require(isValidLeaf(leaf), RECOV_DEADLINE_LEAF);
        require(block.number >= RollupTime.blocksToTicks(deadlineTicks), RECOV_DEADLINE_TIME);

        refundStaker(stakerAddress);
    }

    /**
     * @notice Submit a new assertion to be built on top of the specified leaf if it is validly constructed
     * @dev This method selects an existing leaf to build an assertion on top of. If it succeeds that leaf is eliminated and four new leaves are created. The asserter is automatically moved to stake on the new valid leaf.
     * @param fields Packed data for the following fields
     *   beforeMachineHash The hash of the machine at the end of the previous assertion
     *   afterMachineHash Claimed machine hash after this assertion is completed
     *   beforeInboxTop The hash of the global inbox that the previous assertion had read up to
     *   afterInboxTop Claimed hash of the global inbox at height beforeInboxCount + importedMessageCount
     *   messagesAccHash Claimed commitment to a set of messages output in the assertion
     *   logsAccHash Claimed commitment to a set of logs output in the assertion
     *   prevPrevLeafHash The hash of the leaf that was the ancestor of the leaf we're building on
     *   prevDataHash Type specific data of the node we're on

     * @param fields2 Packed data for the following fields
     *   beforeInboxCount The total number of messages read after the previous assertion executed
     *   prevDeadlineTicks The challenge deadline of the node this assertion builds on
     *   importedMessageCount Argument specifying the number of messages read
     *   beforeMessageCount The total number of messages that have been output by the chain before this assertion
     *   beforeLogCount The total number of messages that have been output by the chain before this assertion
     * @param validBlockHashPrecondition Hash of a known block to invalidate the assertion if too deep a reorg occurs
     * @param validBlockHeightPrecondition Height of the block with hash validBlockHash
     * @param messageCount Claimed number of messages emitted in the assertion
     * @param logCount Claimed number of logs emitted in the assertion
     * @param prevChildType The type of node that this assertion builds on top of
     * @param numSteps Argument specifying the number of steps execuited
     * @param numArbGas Claimed amount of ArbGas used in the assertion
     * @param stakerProof Node graph proof that the asserter is on or can move to the leaf this assertion builds on
     */
    function makeAssertion(
        bytes32[8] calldata fields,
        uint256[5] calldata fields2,
        bytes32 validBlockHashPrecondition,
        uint256 validBlockHeightPrecondition,
        uint64 messageCount,
        uint64 logCount,
        uint32 prevChildType,
        uint64 numSteps,
        uint64 numArbGas,
        bytes32[] calldata stakerProof
    ) external {
        require(
            blockhash(validBlockHeightPrecondition) == validBlockHashPrecondition,
            "invalid known block"
        );
        NodeGraphUtils.AssertionData memory assertData = NodeGraphUtils.makeAssertion(
            fields,
            fields2,
            prevChildType,
            numSteps,
            numArbGas,
            messageCount,
            logCount
        );

        (bytes32 inboxValue, uint256 inboxCount) = globalInbox.getInbox(address(this));

        (bytes32 prevLeaf, bytes32 newValid) = makeAssertion(assertData, inboxValue, inboxCount);

        bytes32 stakerLocation = getStakerLocation(msg.sender);
        require(
            RollupUtils.calculateLeafFromPath(stakerLocation, stakerProof) == prevLeaf,
            MAKE_STAKER_PROOF
        );
        updateStakerLocation(msg.sender, newValid);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, ONLY_OWNER);
        _;
    }

    function ownerShutdown() external onlyOwner {
        safeSelfDestruct(msg.sender);
    }

    function _recoverStakeConfirmed(address payable stakerAddress, bytes32[] memory proof) private {
        bytes32 stakerLocation = getStakerLocation(msg.sender);
        require(
            RollupUtils.calculateLeafFromPath(stakerLocation, proof) == latestConfirmed(),
            RECOV_PATH_PROOF
        );
        refundStaker(stakerAddress);
    }

    /**
     * @notice Confirm an arbitrary number of pending assertions
     * @dev Confirming multiple assertions at once has the advantage that we can skip most checks for all nodes but the final one
     * @dev TODO: An adversary could potentially make this method too expensive to call by creating a large number of validators. This issue could be avoided by providing an interactive confirmation challenge along with this synchronous one.\
     * @param initalProtoStateHash Hash of the protocol state of the predecessor to the first node confirmed
     * @param branches For each node being confirmed, this is the type of node it was
     * @param deadlineTicks For each node being confirmed, this is the deadline for validators challenging it
     * @param challengeNodeData For the invalid nodes being confirmed, this is the hash of the challenge specific data in that node
     * @param logsAcc For the valid nodes being confirmed, this is the claim about what logs were emitted
     * @param vmProtoStateHashes For the valid nodes being confirmed, this is the state after that node is confirmed
     * @param messageCounts The number of messages in each valid assertion confirmed
     * @param messages All the messages output by the confirmed assertions marshaled in order from oldest to newest
     * @param stakerAddresses The list of all currently staked validators
     * @param stakerProofs A concatenated list of proofs for each validator showing that they agree with the given node
     * @param stakerProofOffsets A list of indexes into stakerProofs to break it into pieces for each validator
     */
    function confirm(
        bytes32 initalProtoStateHash,
        uint256 beforeSendCount,
        uint256[] memory branches,
        uint256[] memory deadlineTicks,
        bytes32[] memory challengeNodeData,
        bytes32[] memory logsAcc,
        bytes32[] memory vmProtoStateHashes,
        uint256[] memory messageCounts,
        bytes memory messages,
        address[] memory stakerAddresses,
        bytes32[] memory stakerProofs,
        uint256[] memory stakerProofOffsets
    ) public {
        return
            _confirm(
                RollupUtils.ConfirmData(
                    initalProtoStateHash,
                    beforeSendCount,
                    branches,
                    deadlineTicks,
                    challengeNodeData,
                    logsAcc,
                    vmProtoStateHashes,
                    messageCounts,
                    messages
                ),
                stakerAddresses,
                stakerProofs,
                stakerProofOffsets
            );
    }

    function _confirm(
        RollupUtils.ConfirmData memory data,
        address[] memory stakerAddresses,
        bytes32[] memory stakerProofs,
        uint256[] memory stakerProofOffsets
    ) private {
        uint256 totalNodeCount = data.branches.length;
        // If last node is after deadline, then all nodes are
        require(
            RollupTime.blocksToTicks(block.number) >= data.deadlineTicks[totalNodeCount - 1],
            CONF_TIME
        );

        (bytes32[] memory validNodeHashes, RollupUtils.NodeData memory finalNodeData) = RollupUtils
            .confirm(data, latestConfirmed());

        uint256 validNodeCount = validNodeHashes.length;
        for (uint256 i = 0; i < validNodeCount; i++) {
            emit ConfirmedValidAssertion(validNodeHashes[i]);
        }
        uint256 activeCount = checkAlignedStakers(
            finalNodeData.nodeHash,
            data.deadlineTicks[totalNodeCount - 1],
            stakerAddresses,
            stakerProofs,
            stakerProofOffsets
        );
        require(activeCount > 0, CONF_HAS_STAKER);

        confirmNode(finalNodeData.nodeHash);

        // Send all messages is a single batch
        globalInbox.sendMessages(
            data.messages,
            data.initialSendCount,
            finalNodeData.beforeSendCount
        );

        if (validNodeCount > 0) {
            emit ConfirmedAssertion(data.logsAcc);
        }
    }
}
