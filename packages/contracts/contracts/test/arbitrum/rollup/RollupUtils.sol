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

import "../arch/Marshaling.sol";
import "../libraries/RollupTime.sol";

import "../challenge/ChallengeUtils.sol";

library RollupUtils {
    using Hashing for Value.Data;

    string private constant CONF_INP = "CONF_INP";

    struct ConfirmData {
        bytes32 initalProtoStateHash;
        uint256 initialSendCount;
        uint256[] branches;
        uint256[] deadlineTicks;
        bytes32[] challengeNodeData;
        bytes32[] logsAcc;
        bytes32[] vmProtoStateHashes;
        uint256[] messageCounts;
        bytes messages;
    }

    struct NodeData {
        uint256 validNum;
        uint256 invalidNum;
        uint256 messagesOffset;
        bytes32 vmProtoStateHash;
        uint256 beforeSendCount;
        bytes32 nodeHash;
    }

    function getInitialNodeData(
        bytes32 vmProtoStateHash,
        uint256 beforeSendCount,
        bytes32 confNode
    ) private pure returns (NodeData memory) {
        return NodeData(0, 0, 0, vmProtoStateHash, beforeSendCount, confNode);
    }

    function confirm(ConfirmData memory data, bytes32 confNode)
        internal
        pure
        returns (bytes32[] memory validNodeHashes, NodeData memory)
    {
        verifyDataLength(data);

        uint256 nodeCount = data.branches.length;
        uint256 validNodeCount = data.messageCounts.length;
        validNodeHashes = new bytes32[](validNodeCount);
        NodeData memory currentNodeData = getInitialNodeData(
            data.initalProtoStateHash,
            data.initialSendCount,
            confNode
        );

        for (uint256 nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
            bool isValidChildType = processNode(data, currentNodeData, nodeIndex);

            if (isValidChildType) {
                validNodeHashes[currentNodeData.validNum - 1] = currentNodeData.nodeHash;
            }
        }
        return (validNodeHashes, currentNodeData);
    }

    function processNode(
        ConfirmData memory data,
        NodeData memory nodeData,
        uint256 nodeIndex
    ) private pure returns (bool) {
        uint256 branchType = data.branches[nodeIndex];
        bool isValidChildType = (branchType == ChallengeUtils.getValidChildType());
        bytes32 nodeDataHash;

        if (isValidChildType) {
            (
                nodeData.beforeSendCount,
                nodeData.messagesOffset,
                nodeDataHash,
                nodeData.vmProtoStateHash
            ) = processValidNode(
                data,
                nodeData.validNum,
                nodeData.beforeSendCount,
                nodeData.messagesOffset
            );
            nodeData.validNum++;
        } else {
            nodeDataHash = data.challengeNodeData[nodeData.invalidNum];
            nodeData.invalidNum++;
        }

        nodeData.nodeHash = childNodeHash(
            nodeData.nodeHash,
            data.deadlineTicks[nodeIndex],
            nodeDataHash,
            branchType,
            nodeData.vmProtoStateHash
        );

        return isValidChildType;
    }

    function processValidNode(
        ConfirmData memory data,
        uint256 validNum,
        uint256 beforeSendCount,
        uint256 startOffset
    )
        internal
        pure
        returns (
            uint256,
            uint256,
            bytes32,
            bytes32
        )
    {
        uint256 sendCount = data.messageCounts[validNum];
        (bytes32 lastMsgHash, uint256 messagesOffset) = generateLastMessageHash(
            data.messages,
            startOffset,
            sendCount
        );
        bytes32 nodeDataHash = validDataHash(beforeSendCount, lastMsgHash, data.logsAcc[validNum]);
        bytes32 vmProtoStateHash = data.vmProtoStateHashes[validNum];
        return (beforeSendCount + sendCount, messagesOffset, nodeDataHash, vmProtoStateHash);
    }

    function generateLastMessageHash(
        bytes memory messages,
        uint256 startOffset,
        uint256 count
    ) internal pure returns (bytes32, uint256) {
        bytes32 hashVal = 0x00;
        Value.Data memory messageVal;
        uint256 offset = startOffset;
        for (uint256 i = 0; i < count; i++) {
            (offset, messageVal) = Marshaling.deserialize(messages, offset);
            hashVal = keccak256(abi.encodePacked(hashVal, messageVal.hash()));
        }
        return (hashVal, offset);
    }

    function verifyDataLength(RollupUtils.ConfirmData memory data) private pure {
        uint256 nodeCount = data.branches.length;
        uint256 validNodeCount = data.messageCounts.length;
        require(data.vmProtoStateHashes.length == validNodeCount, CONF_INP);
        require(data.logsAcc.length == validNodeCount, CONF_INP);
        require(data.deadlineTicks.length == nodeCount, CONF_INP);
        require(data.challengeNodeData.length == nodeCount - validNodeCount, CONF_INP);
    }

    function protoStateHash(
        bytes32 machineHash,
        bytes32 inboxTop,
        uint256 inboxCount,
        uint256 messageCount,
        uint256 logCount
    ) internal pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(machineHash, inboxTop, inboxCount, messageCount, logCount));
    }

    function validDataHash(
        uint256 beforeSendCount,
        bytes32 messagesAcc,
        bytes32 logsAcc
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(beforeSendCount, messagesAcc, logsAcc));
    }

    function challengeDataHash(bytes32 challenge, uint256 challengePeriod)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(challenge, challengePeriod));
    }

    function childNodeHash(
        bytes32 prevNodeHash,
        uint256 deadlineTicks,
        bytes32 nodeDataHash,
        uint256 childType,
        bytes32 vmProtoStateHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    prevNodeHash,
                    keccak256(
                        abi.encodePacked(vmProtoStateHash, deadlineTicks, nodeDataHash, childType)
                    )
                )
            );
    }

    function calculateLeafFromPath(bytes32 from, bytes32[] memory proof)
        internal
        pure
        returns (bytes32)
    {
        return calculateLeafFromPath(from, proof, 0, proof.length);
    }

    function calculateLeafFromPath(
        bytes32 from,
        bytes32[] memory proof,
        uint256 start,
        uint256 end
    ) internal pure returns (bytes32) {
        bytes32 node = from;
        for (uint256 i = start; i < end; i++) {
            node = keccak256(abi.encodePacked(node, proof[i]));
        }
        return node;
    }
}
