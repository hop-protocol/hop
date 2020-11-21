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

import "../rollup/IStaking.sol";
import "../libraries/RollupTime.sol";
import "../libraries/Cloneable.sol";

contract Challenge is Cloneable {
    enum State { NoChallenge, AsserterTurn, ChallengerTurn }

    event InitiatedChallenge(uint256 deadlineTicks);

    event AsserterTimedOut();
    event ChallengerTimedOut();

    // Can online initialize once
    string private constant CHAL_INIT_STATE = "CHAL_INIT_STATE";
    // Can only continue challenge in response to bisection

    string private constant CON_STATE = "CON_STATE";
    // deadline expired
    string private constant CON_DEADLINE = "CON_DEADLINE";
    // Only original challenger can continue challenge
    string private constant CON_SENDER = "CON_SENDER";

    // Can only bisect assertion in response to a challenge
    string private constant BIS_STATE = "BIS_STATE";
    // deadline expired
    string private constant BIS_DEADLINE = "BIS_DEADLINE";
    // Only original asserter can continue bisect
    string private constant BIS_SENDER = "BIS_SENDER";

    address internal rollupAddress;
    address payable internal asserter;
    address payable internal challenger;

    uint256 internal deadlineTicks;

    // The current deadline at which the challenge timeouts and a winner is
    // declared. This deadline resets at each step in the challenge
    uint256 private challengePeriodTicks;

    State private state;

    modifier asserterAction {
        require(State.AsserterTurn == state, BIS_STATE);
        require(RollupTime.blocksToTicks(block.number) <= deadlineTicks, BIS_DEADLINE);
        require(msg.sender == asserter, BIS_SENDER);
        _;
    }

    modifier challengerAction {
        require(State.ChallengerTurn == state, CON_STATE);
        require(RollupTime.blocksToTicks(block.number) <= deadlineTicks, CON_DEADLINE);
        require(msg.sender == challenger, CON_SENDER);
        _;
    }

    function timeoutChallenge() public {
        require(RollupTime.blocksToTicks(block.number) > deadlineTicks, "Deadline hasn't expired");

        if (state == State.AsserterTurn) {
            emit AsserterTimedOut();
            _challengerWin();
        } else {
            emit ChallengerTimedOut();
            _asserterWin();
        }
    }

    function initializeChallenge(
        address _rollupAddress,
        address payable _asserter,
        address payable _challenger,
        uint256 _challengePeriodTicks
    ) internal {
        require(state == State.NoChallenge, CHAL_INIT_STATE);

        rollupAddress = _rollupAddress;
        asserter = _asserter;
        challenger = _challenger;
        challengePeriodTicks = _challengePeriodTicks;
        state = State.AsserterTurn;
        updateDeadline();

        emit InitiatedChallenge(deadlineTicks);
    }

    function updateDeadline() internal {
        deadlineTicks = RollupTime.blocksToTicks(block.number) + challengePeriodTicks;
    }

    function asserterResponded() internal {
        state = State.ChallengerTurn;
        updateDeadline();
    }

    function challengerResponded() internal {
        state = State.AsserterTurn;
        updateDeadline();
    }

    function _asserterWin() internal {
        IStaking(rollupAddress).resolveChallenge(asserter, challenger);
        safeSelfDestruct(msg.sender);
    }

    function _challengerWin() internal {
        IStaking(rollupAddress).resolveChallenge(challenger, asserter);
        safeSelfDestruct(msg.sender);
    }
}
