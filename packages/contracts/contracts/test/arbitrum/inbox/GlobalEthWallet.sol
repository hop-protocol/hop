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

contract GlobalEthWallet {
    mapping(address => uint256) private ethWallets;

    function withdrawEth() external {
        uint256 value = getEthBalance(msg.sender);
        delete ethWallets[msg.sender];
        msg.sender.transfer(value);
    }

    function getEthBalance(address _owner) public view returns (uint256) {
        return ethWallets[_owner];
    }

    function depositEth(address _destination) internal {
        ethWallets[_destination] += msg.value;
    }

    function transferEth(
        address _from,
        address _to,
        uint256 _value
    ) internal returns (bool) {
        if (_value > ethWallets[_from]) {
            return false;
        }
        ethWallets[_from] -= _value;
        ethWallets[_to] += _value;
        return true;
    }
}
