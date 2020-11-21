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

library ChallengeUtils {
    uint256 public constant INVALID_INBOX_TOP_TYPE = 0;
    uint256 public constant INVALID_EXECUTION_TYPE = 1;
    uint256 public constant VALID_CHILD_TYPE = 2;

    function getInvalidInboxType() internal pure returns (uint256) {
        return INVALID_INBOX_TOP_TYPE;
    }

    function getInvalidExType() internal pure returns (uint256) {
        return INVALID_EXECUTION_TYPE;
    }

    function getValidChildType() internal pure returns (uint256) {
        return VALID_CHILD_TYPE;
    }

    function inboxTopHash(
        bytes32 _lowerHash,
        bytes32 _topHash,
        uint256 _chainLength
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_lowerHash, _topHash, _chainLength));
    }

    struct ExecutionAssertion {
        uint64 numSteps;
        uint64 numArbGas;
        bytes32 beforeMachineHash;
        bytes32 afterMachineHash;
        bytes32 beforeInboxHash;
        bytes32 afterInboxHash;
        bytes32 firstMessageHash;
        bytes32 lastMessageHash;
        uint64 messageCount;
        bytes32 firstLogHash;
        bytes32 lastLogHash;
        uint64 logCount;
    }

    function hash(ExecutionAssertion memory assertion) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    assertion.numSteps,
                    assertion.numArbGas,
                    assertion.beforeMachineHash,
                    assertion.afterMachineHash,
                    assertion.beforeInboxHash,
                    assertion.afterInboxHash,
                    assertion.firstMessageHash,
                    assertion.lastMessageHash,
                    assertion.messageCount,
                    assertion.firstLogHash,
                    assertion.lastLogHash,
                    assertion.logCount
                )
            );
    }
}
