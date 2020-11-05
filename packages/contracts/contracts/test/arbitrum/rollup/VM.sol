// SPDX-License-Identifier: Apache-2.0

/*
 * Copyright 2019, Offchain Labs, Inc.
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

import "../arch/Value.sol";
import "../libraries/SafeMath.sol";

library VM {
    using SafeMath for uint256;

    bytes32 private constant MACHINE_HALT_HASH = bytes32(0);
    bytes32 private constant MACHINE_ERROR_HASH = bytes32(uint256(1));

    struct Params {
        // these are defined just once for each vM
        uint256 gracePeriodTicks;
        uint256 arbGasSpeedLimitPerTick;
        uint64 maxExecutionSteps;
    }

    function isErrored(bytes32 vmStateHash) internal pure returns (bool) {
        return vmStateHash == MACHINE_ERROR_HASH;
    }

    function isHalted(bytes32 vmStateHash) internal pure returns (bool) {
        return vmStateHash == MACHINE_HALT_HASH;
    }
}
