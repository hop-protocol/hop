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

import "./IExecutionChallenge.sol";
import "./BisectionChallenge.sol";
import "./ChallengeUtils.sol";

import "../arch/IOneStepProof.sol";

import "../libraries/MerkleLib.sol";

contract ExecutionChallenge is IExecutionChallenge, BisectionChallenge {
    using ChallengeUtils for ChallengeUtils.ExecutionAssertion;

    event BisectedAssertion(bytes32[] assertionHashes, uint256 deadlineTicks);

    event OneStepProofCompleted();

    IOneStepProof private executor;

    // Incorrect previous state
    string private constant BIS_INPLEN = "BIS_INPLEN";
    // Proof was incorrect
    string private constant OSP_PROOF = "OSP_PROOF";

    struct BisectAssertionData {
        bytes32[] machineHashes;
        bytes32[] inboxAccs;
        bytes32[] messageAccs;
        bytes32[] logAccs;
        uint64[] outCounts;
        uint64[] gases;
        uint64 totalSteps;
    }

    function connectOneStepProof(address oneStepProof) external {
        executor = IOneStepProof(oneStepProof);
    }

    function bisectAssertion(
        bytes32[] memory _machineHashes,
        bytes32[] memory _inboxAccs,
        bytes32[] memory _messageAccs,
        bytes32[] memory _logAccs,
        uint64[] memory _outCounts,
        uint64[] memory _gases,
        uint64 _totalSteps
    ) public asserterAction {
        BisectAssertionData memory bisection = BisectAssertionData(
            _machineHashes,
            _inboxAccs,
            _messageAccs,
            _logAccs,
            _outCounts,
            _gases,
            _totalSteps
        );
        _bisectAssertion(bisection);
    }

    function _checkBisectionPrecondition(BisectAssertionData memory _data) private view {
        uint256 bisectionCount = _data.machineHashes.length - 1;
        require(bisectionCount + 1 == _data.inboxAccs.length, BIS_INPLEN);
        require(bisectionCount + 1 == _data.messageAccs.length, BIS_INPLEN);
        require(bisectionCount + 1 == _data.logAccs.length, BIS_INPLEN);
        require(bisectionCount == _data.gases.length, BIS_INPLEN);
        require(bisectionCount * 2 == _data.outCounts.length, BIS_INPLEN);
        uint64 totalGas = 0;
        uint64 totalMessageCount = 0;
        uint64 totalLogCount = 0;
        for (uint256 i = 0; i < bisectionCount; i++) {
            totalGas += _data.gases[i];
            totalMessageCount += _data.outCounts[i];
            totalLogCount += _data.outCounts[bisectionCount + i];
        }

        requireMatchesPrevState(
            _generateAssertionHash(
                _data,
                _data.totalSteps,
                0,
                bisectionCount,
                totalGas,
                totalMessageCount,
                totalLogCount
            )
        );
    }

    function _generateBisectionHash(
        BisectAssertionData memory data,
        uint64 stepCount,
        uint256 bisectionCount,
        uint256 i
    ) private pure returns (bytes32) {
        return
            _generateAssertionHash(
                data,
                stepCount,
                i,
                i + 1,
                data.gases[i],
                data.outCounts[i],
                data.outCounts[bisectionCount + i]
            );
    }

    function _generateAssertionHash(
        BisectAssertionData memory data,
        uint64 stepCount,
        uint256 start,
        uint256 end,
        uint64 gas,
        uint64 messageCount,
        uint64 logCount
    ) private pure returns (bytes32) {
        return
            ChallengeUtils
                .ExecutionAssertion(
                stepCount,
                gas,
                data.machineHashes[start],
                data.machineHashes[end],
                data.inboxAccs[start],
                data.inboxAccs[end],
                data.messageAccs[start],
                data.messageAccs[end],
                messageCount,
                data.logAccs[start],
                data.logAccs[end],
                logCount
            )
                .hash();
    }

    function _bisectAssertion(BisectAssertionData memory _data) private {
        uint256 bisectionCount = _data.machineHashes.length - 1;
        _checkBisectionPrecondition(_data);
        bytes32[] memory hashes = new bytes32[](bisectionCount);
        hashes[0] = _generateBisectionHash(
            _data,
            uint64(firstSegmentSize(uint256(_data.totalSteps), bisectionCount)),
            bisectionCount,
            0
        );
        for (uint256 i = 1; i < bisectionCount; i++) {
            hashes[i] = _generateBisectionHash(
                _data,
                uint64(otherSegmentSize(uint256(_data.totalSteps), bisectionCount)),
                bisectionCount,
                i
            );
        }

        commitToSegment(hashes);
        asserterResponded();

        emit BisectedAssertion(hashes, deadlineTicks);
    }

    function oneStepProofWithMessage(
        bytes32 _firstInbox,
        bytes32 _firstMessage,
        bytes32 _firstLog,
        bytes memory _proof,
        uint8 _kind,
        uint256 _blockNumber,
        uint256 _timestamp,
        address _sender,
        uint256 _inboxSeqNum,
        bytes memory _msgData
    ) public asserterAction {
        (uint64 gas, bytes32[5] memory fields) = executor.executeStepWithMessage(
            _firstInbox,
            _firstMessage,
            _firstLog,
            _proof,
            _kind,
            _blockNumber,
            _timestamp,
            _sender,
            _inboxSeqNum,
            _msgData
        );

        checkProof(gas, _firstInbox, _firstMessage, _firstLog, fields);
    }

    function oneStepProof(
        bytes32 _firstInbox,
        bytes32 _firstMessage,
        bytes32 _firstLog,
        bytes memory _proof
    ) public asserterAction {
        (uint64 gas, bytes32[5] memory fields) = executor.executeStep(
            _firstInbox,
            _firstMessage,
            _firstLog,
            _proof
        );

        checkProof(gas, _firstInbox, _firstMessage, _firstLog, fields);
    }

    function checkProof(
        uint64 gas,
        bytes32 firstInbox,
        bytes32 firstMessage,
        bytes32 firstLog,
        bytes32[5] memory fields
    ) private {
        bytes32 startMachineHash = fields[0];
        bytes32 endMachineHash = fields[1];
        bytes32 afterInboxHash = fields[2];
        bytes32 afterMessagesHash = fields[3];
        bytes32 afterLogsHash = fields[4];
        // The one step proof already guarantees us that firstMessage and lastMessage
        // are either one or 0 messages apart and the same is true for logs. Therefore
        // we can infer the message count and log count based on whether the fields
        // are equal or not
        ChallengeUtils.ExecutionAssertion memory assertion = ChallengeUtils.ExecutionAssertion(
            1,
            gas,
            startMachineHash,
            endMachineHash,
            firstInbox,
            afterInboxHash,
            firstMessage,
            afterMessagesHash,
            firstMessage == afterMessagesHash ? 0 : 1,
            firstLog,
            afterLogsHash,
            firstLog == afterLogsHash ? 0 : 1
        );
        requireMatchesPrevState(assertion.hash());

        emit OneStepProofCompleted();
        _asserterWin();
    }
}
