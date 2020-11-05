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

import "./RollupUtils.sol";
import "./NodeGraphUtils.sol";
import "./VM.sol";

import "../arch/Value.sol";

import "../libraries/RollupTime.sol";

contract NodeGraph {
    using SafeMath for uint256;
    using Hashing for Value.Data;

    // invalid leaf
    string private constant MAKE_LEAF = "MAKE_LEAF";
    // Can only disputable assert if machine is not errored or halted
    string private constant MAKE_RUN = "MAKE_RUN";
    // Tried to execute too many steps
    string private constant MAKE_STEP = "MAKE_STEP";
    // Tried to import more messages than exist in ethe inbox
    string private constant MAKE_MESSAGE_CNT = "MAKE_MESSAGE_CNT";

    string private constant PRUNE_LEAF = "PRUNE_LEAF";
    string private constant PRUNE_PROOFLEN = "PRUNE_PROOFLEN";
    string private constant PRUNE_CONFLICT = "PRUNE_CONFLICT";

    // Fields
    //  prevLeaf
    //  inboxValue
    //  afterMachineHash
    //  afterInboxHash
    //  messagesAccHash
    //  logsAccHash
    //  validNodeHash

    event RollupAsserted(
        bytes32[7] fields,
        uint256 inboxCount,
        uint256 importedMessageCount,
        uint64 numArbGas,
        uint64 numSteps,
        uint256 beforeMessageCount,
        uint64 messageCount,
        uint256 beforeLogCount,
        uint64 logCount
    );

    event RollupConfirmed(bytes32 nodeHash);

    event RollupPruned(bytes32 leaf);

    VM.Params public vmParams;
    mapping(bytes32 => bool) private leaves;
    bytes32 private latestConfirmedPriv;

    /**
     * @notice Prune an arbitrary number of leaves from the node graph
     * @dev Pruning leaves frees up blockchain storage, but is otherwise unnecessary
     * @notice See _pruneLeaf for parameter documentation
     */
    function pruneLeaves(
        bytes32[] calldata fromNodes,
        bytes32[] calldata leafProofs,
        uint256[] calldata leafProofLengths,
        bytes32[] calldata latestConfProofs,
        uint256[] calldata latestConfirmedProofLengths
    ) external {
        uint256 pruneCount = fromNodes.length;

        require(
            leafProofLengths.length == pruneCount &&
                latestConfirmedProofLengths.length == pruneCount,
            "input length mistmatch"
        );
        uint256 prevLeafOffset = 0;
        uint256 prevConfOffset = 0;

        for (uint256 i = 0; i < pruneCount; i++) {
            (prevLeafOffset, prevConfOffset) = _pruneLeaf(
                fromNodes[i],
                latestConfirmedProofLengths[i],
                leafProofLengths[i],
                leafProofs,
                latestConfProofs,
                prevLeafOffset,
                prevConfOffset
            );
        }
    }

    function latestConfirmed() public view returns (bytes32) {
        return latestConfirmedPriv;
    }

    function isValidLeaf(bytes32 leaf) public view returns (bool) {
        return leaves[leaf];
    }

    function init(
        bytes32 _vmState,
        uint128 _gracePeriodTicks,
        uint128 _arbGasSpeedLimitPerTick,
        uint64 _maxExecutionSteps
    ) internal {
        // VM protocol state
        bytes32 vmProtoStateHash = RollupUtils.protoStateHash(_vmState, 0, 0, 0, 0);
        bytes32 initialNode = RollupUtils.childNodeHash(0, 0, 0, 0, vmProtoStateHash);
        latestConfirmedPriv = initialNode;
        leaves[initialNode] = true;

        // VM parameters
        vmParams.gracePeriodTicks = _gracePeriodTicks;
        vmParams.arbGasSpeedLimitPerTick = _arbGasSpeedLimitPerTick;
        vmParams.maxExecutionSteps = _maxExecutionSteps;
    }

    function makeAssertion(
        NodeGraphUtils.AssertionData memory data,
        bytes32 inboxValue,
        uint256 inboxCount
    ) internal returns (bytes32, bytes32) {
        (bytes32 prevLeaf, bytes32 vmProtoHashBefore) = NodeGraphUtils.computePrevLeaf(data);
        require(isValidLeaf(prevLeaf), MAKE_LEAF);
        _verifyAssertionData(data);

        require(
            data.importedMessageCount <= inboxCount.sub(data.beforeInboxCount),
            MAKE_MESSAGE_CNT
        );

        bytes32 validLeaf = _initializeAssertionLeaves(
            data,
            prevLeaf,
            vmProtoHashBefore,
            inboxValue,
            inboxCount
        );

        delete leaves[prevLeaf];

        emitAssertedEvent(data, prevLeaf, validLeaf, inboxValue, inboxCount);
        return (prevLeaf, validLeaf);
    }

    function confirmNode(bytes32 to) internal {
        latestConfirmedPriv = to;
        emit RollupConfirmed(to);
    }

    function emitAssertedEvent(
        NodeGraphUtils.AssertionData memory data,
        bytes32 prevLeaf,
        bytes32 validLeaf,
        bytes32 inboxValue,
        uint256 inboxCount
    ) private {
        emit RollupAsserted(
            [
                prevLeaf,
                inboxValue,
                data.assertion.afterMachineHash,
                data.assertion.afterInboxHash,
                data.assertion.lastMessageHash,
                data.assertion.lastLogHash,
                validLeaf
            ],
            inboxCount,
            data.importedMessageCount,
            data.assertion.numArbGas,
            data.assertion.numSteps,
            data.beforeMessageCount,
            data.assertion.messageCount,
            data.beforeLogCount,
            data.assertion.logCount
        );
    }

    /**
     * @notice Prune a leaf from the node graph if it conflicts with the latest confirmed node
     * @dev Pruning leaves frees up blockchain storage, but is otherwise unnecessary
     * @param from The node where the leaf we want to prune diverged from the correct path
     * @param latestConfirmedProofLength Length of the proof showing the from is an ancestor of latest confirmed
     * @param leafProofLength Length of the proof showing the the pruned leaf conflicts with the from node
     * @param leafProofs Array containing the leaf conflict proof
     * @param latestConfProofs Array containing the leaf confirmed proof
     * @param prevLeafOffset Index into the leaf proof
     * @param prevConfOffset Index into the confirm proof
     */
    function _pruneLeaf(
        bytes32 from,
        uint256 latestConfirmedProofLength,
        uint256 leafProofLength,
        bytes32[] memory leafProofs,
        bytes32[] memory latestConfProofs,
        uint256 prevLeafOffset,
        uint256 prevConfOffset
    ) private returns (uint256, uint256) {
        require(leafProofLength > 0 && latestConfirmedProofLength > 0, PRUNE_PROOFLEN);
        uint256 nextLeafOffset = prevLeafOffset + leafProofLength;
        uint256 nextConfOffset = prevConfOffset + latestConfirmedProofLength;

        // If the function call was produced valid at any point, either all these checks will pass or all will fail
        bool isValidNode = RollupUtils.calculateLeafFromPath(
            from,
            latestConfProofs,
            prevConfOffset,
            nextConfOffset
        ) == latestConfirmed();

        require(
            isValidNode && leafProofs[prevLeafOffset] != latestConfProofs[prevConfOffset],
            PRUNE_CONFLICT
        );

        bytes32 leaf = RollupUtils.calculateLeafFromPath(
            from,
            leafProofs,
            prevLeafOffset,
            nextLeafOffset
        );
        if (isValidLeaf(leaf)) {
            delete leaves[leaf];
            emit RollupPruned(leaf);
        }

        return (nextLeafOffset, nextConfOffset);
    }

    function _verifyAssertionData(NodeGraphUtils.AssertionData memory data) private view {
        require(
            !VM.isErrored(data.assertion.beforeMachineHash) &&
                !VM.isHalted(data.assertion.beforeMachineHash),
            MAKE_RUN
        );
        require(data.assertion.numSteps <= vmParams.maxExecutionSteps, MAKE_STEP);
    }

    function _initializeAssertionLeaves(
        NodeGraphUtils.AssertionData memory data,
        bytes32 prevLeaf,
        bytes32 vmProtoHashBefore,
        bytes32 inboxValue,
        uint256 inboxCount
    ) private returns (bytes32) {
        (uint256 checkTimeTicks, uint256 deadlineTicks) = NodeGraphUtils.getTimeData(
            vmParams,
            data,
            block.number
        );

        bytes32 invalidInboxLeaf = NodeGraphUtils.generateInvalidInboxTopLeaf(
            data,
            prevLeaf,
            deadlineTicks,
            inboxValue,
            inboxCount,
            vmProtoHashBefore,
            vmParams.gracePeriodTicks
        );
        bytes32 invalidExecLeaf = NodeGraphUtils.generateInvalidExecutionLeaf(
            data,
            prevLeaf,
            deadlineTicks,
            vmProtoHashBefore,
            vmParams.gracePeriodTicks,
            checkTimeTicks
        );
        bytes32 validLeaf = NodeGraphUtils.generateValidLeaf(data, prevLeaf, deadlineTicks);

        leaves[invalidInboxLeaf] = true;
        leaves[invalidExecLeaf] = true;
        leaves[validLeaf] = true;

        return validLeaf;
    }
}
