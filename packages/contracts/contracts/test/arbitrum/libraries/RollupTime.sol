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

library RollupTime {
    uint256 private constant TICKS_PER_BLOCK = 1000; // 1 tick == 1 milliblock

    function ticksToBlocks(uint256 ticks) internal pure returns (uint128) {
        return uint128(ticks / TICKS_PER_BLOCK);
    }

    function blocksToTicks(uint256 blockNum) internal pure returns (uint256) {
        return uint256(blockNum) * TICKS_PER_BLOCK;
    }
}
