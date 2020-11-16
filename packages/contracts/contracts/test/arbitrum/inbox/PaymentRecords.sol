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

contract PaymentRecords {
    mapping(bytes32 => address) private payments;

    event PaymentTransfer(
        uint256 messageIndex,
        address originalOwner,
        address prevOwner,
        address newOwner
    );

    function transferPayment(
        address originalOwner,
        address newOwner,
        uint256 messageIndex
    ) external {
        address currentOwner = getPaymentOwner(originalOwner, messageIndex);
        require(msg.sender == currentOwner, "Must be payment owner.");

        payments[keccak256(abi.encodePacked(messageIndex, originalOwner))] = newOwner;

        emit PaymentTransfer(messageIndex, originalOwner, currentOwner, newOwner);
    }

    function getPaymentOwner(address originalOwner, uint256 messageIndex)
        public
        view
        returns (address)
    {
        address currentOwner = payments[keccak256(abi.encodePacked(messageIndex, originalOwner))];

        if (currentOwner == address(0)) {
            return originalOwner;
        } else {
            return currentOwner;
        }
    }

    function deletePayment(address originalOwner, uint256 messageIndex) internal {
        delete payments[keccak256(abi.encodePacked(messageIndex, originalOwner))];
    }
}
