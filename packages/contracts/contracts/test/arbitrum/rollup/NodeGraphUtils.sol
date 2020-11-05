// SPDX-License-Identifier: Apache-2.0

/*
 * Copyright 2020, Offchain Labs, Inc.
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
import "../libraries/RollupTime.sol";
import "../challenge/ChallengeUtils.sol";
import "./VM.sol";

library NodeGraphUtils {
    using Hashing for Value.Data;

    struct AssertionData {
        uint256 beforeInboxCount;
        bytes32 prevPrevLeafHash;
        uint256 prevDeadlineTicks;
        bytes32 prevDataHash;
        uint32 prevChildType;
        uint256 importedMessageCount;
        uint256 beforeMessageCount;
        uint256 beforeLogCount;
        ChallengeUtils.ExecutionAssertion assertion;
    }

    function makeAssertion(
        bytes32[8] memory fields,
        uint256[5] memory fields2,
        uint32 prevChildType,
        uint64 numSteps,
        uint64 numArbGas,
        uint64 messageCount,
        uint64 logCount
    ) internal pure returns (AssertionData memory) {
        ChallengeUtils.ExecutionAssertion memory assertion = ChallengeUtils.ExecutionAssertion(
            numSteps,
            numArbGas,
            fields[0],
            fields[1],
            fields[2],
            fields[3],
            0,
            fields[4],
            messageCount,
            0,
            fields[5],
            logCount
        );
        return
            AssertionData(
                fields2[0],
                fields[6],
                fields2[1],
                fields[7],
                prevChildType,
                fields2[2],
                fields2[3],
                fields2[4],
                assertion
            );
    }

    function computePrevLeaf(AssertionData memory data)
        internal
        pure
        returns (bytes32 prevLeaf, bytes32 vmProtoHashBefore)
    {
        vmProtoHashBefore = RollupUtils.protoStateHash(
            data.assertion.beforeMachineHash,
            data.assertion.beforeInboxHash,
            data.beforeInboxCount,
            data.beforeMessageCount,
            data.beforeLogCount
        );
        prevLeaf = RollupUtils.childNodeHash(
            data.prevPrevLeafHash,
            data.prevDeadlineTicks,
            data.prevDataHash,
            data.prevChildType,
            vmProtoHashBefore
        );
    }

    function getTimeData(
        VM.Params memory vmParams,
        AssertionData memory data,
        uint256 blockNum
    ) internal pure returns (uint256, uint256) {
        uint256 checkTimeTicks = data.assertion.numArbGas / vmParams.arbGasSpeedLimitPerTick;
        uint256 deadlineTicks = RollupTime.blocksToTicks(blockNum) + vmParams.gracePeriodTicks;
        if (deadlineTicks < data.prevDeadlineTicks) {
            deadlineTicks = data.prevDeadlineTicks;
        }
        deadlineTicks += checkTimeTicks;

        return (checkTimeTicks, deadlineTicks);
    }

    function generateInvalidInboxTopLeaf(
        AssertionData memory data,
        bytes32 prevLeaf,
        uint256 deadlineTicks,
        bytes32 inboxValue,
        uint256 inboxCount,
        bytes32 vmProtoHashBefore,
        uint256 gracePeriodTicks
    ) internal pure returns (bytes32) {
        bytes32 challengeHash = ChallengeUtils.inboxTopHash(
            data.assertion.afterInboxHash,
            inboxValue,
            inboxCount - (data.beforeInboxCount + data.importedMessageCount)
        );
        return
            RollupUtils.childNodeHash(
                prevLeaf,
                deadlineTicks,
                RollupUtils.challengeDataHash(
                    challengeHash,
                    gracePeriodTicks + RollupTime.blocksToTicks(1)
                ),
                ChallengeUtils.getInvalidInboxType(),
                vmProtoHashBefore
            );
    }

    function generateInvalidExecutionLeaf(
        AssertionData memory data,
        bytes32 prevLeaf,
        uint256 deadlineTicks,
        bytes32 vmProtoHashBefore,
        uint256 gracePeriodTicks,
        uint256 checkTimeTicks
    ) internal pure returns (bytes32 leaf) {
        return
            RollupUtils.childNodeHash(
                prevLeaf,
                deadlineTicks,
                RollupUtils.challengeDataHash(
                    ChallengeUtils.hash(data.assertion),
                    gracePeriodTicks + checkTimeTicks
                ),
                ChallengeUtils.getInvalidExType(),
                vmProtoHashBefore
            );
    }

    function generateValidLeaf(
        AssertionData memory data,
        bytes32 prevLeaf,
        uint256 deadlineTicks
    ) internal pure returns (bytes32) {
        return
            RollupUtils.childNodeHash(
                prevLeaf,
                deadlineTicks,
                RollupUtils.validDataHash(
                    data.beforeMessageCount,
                    data.assertion.lastMessageHash,
                    data.assertion.lastLogHash
                ),
                ChallengeUtils.getValidChildType(),
                RollupUtils.protoStateHash(
                    data.assertion.afterMachineHash,
                    data.assertion.afterInboxHash,
                    data.beforeInboxCount + data.importedMessageCount,
                    data.beforeMessageCount + data.assertion.messageCount,
                    data.beforeLogCount + data.assertion.logCount
                )
            );
    }
}
