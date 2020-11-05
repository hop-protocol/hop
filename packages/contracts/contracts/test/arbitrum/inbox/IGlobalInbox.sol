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

interface IGlobalInbox {
    event MessageDelivered(
        address indexed chain,
        uint8 indexed kind,
        address indexed sender,
        uint256 inboxSeqNum,
        bytes data
    );

    event MessageDeliveredFromOrigin(
        address indexed chain,
        uint8 indexed kind,
        address indexed sender,
        uint256 inboxSeqNum
    );

    event BuddyContractDeployed(address indexed sender, bytes data);
    event BuddyContractPair(address indexed sender, address data);

    function getInbox(address account) external view returns (bytes32, uint256);

    function sendMessages(
        bytes calldata _messages,
        uint256 initialMaxSendCount,
        uint256 finalMaxSendCount
    ) external;

    function sendInitializationMessage(bytes calldata messageData) external;

    function sendL2Message(address chain, bytes calldata messageData) external;

    function deployL2ContractPair(
        address chain,
        uint256 maxGas,
        uint256 gasPriceBid,
        uint256 payment,
        bytes calldata contractData
    ) external;
}
