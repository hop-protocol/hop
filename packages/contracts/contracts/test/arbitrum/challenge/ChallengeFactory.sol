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

import "../libraries/CloneFactory.sol";

import "./IChallengeFactory.sol";
import "./IBisectionChallenge.sol";
import "./IExecutionChallenge.sol";
import "./ChallengeUtils.sol";

contract ChallengeFactory is CloneFactory, IChallengeFactory {
    // Invalid challenge type
    string public constant INVALID_TYPE_STR = "INVALID_TYPE";

    ICloneable public inboxTopChallengeTemplate;
    ICloneable public executionChallengeTemplate;
    address public oneStepProofAddress;

    constructor(
        address _inboxTopChallengeTemplate,
        address _executionChallengeTemplate,
        address _oneStepProofAddress
    ) public {
        inboxTopChallengeTemplate = ICloneable(_inboxTopChallengeTemplate);
        executionChallengeTemplate = ICloneable(_executionChallengeTemplate);
        oneStepProofAddress = _oneStepProofAddress;
    }

    function generateCloneAddress(
        address asserter,
        address challenger,
        uint256 challengeType
    ) public view returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                bytes1(0xff),
                                address(this),
                                generateNonce(asserter, challenger),
                                cloneCodeHash(getChallengeTemplate(challengeType))
                            )
                        )
                    )
                )
            );
    }

    function createChallenge(
        address payable _asserter,
        address payable _challenger,
        uint256 _challengePeriodTicks,
        bytes32 _challengeHash,
        uint256 challengeType
    ) external returns (address) {
        ICloneable challengeTemplate = getChallengeTemplate(challengeType);
        address clone = createClone(challengeTemplate);
        IBisectionChallenge(clone).initializeBisection(
            msg.sender,
            _asserter,
            _challenger,
            _challengePeriodTicks,
            _challengeHash
        );

        if (challengeType == ChallengeUtils.getInvalidExType()) {
            IExecutionChallenge(clone).connectOneStepProof(oneStepProofAddress);
        }
        return address(clone);
    }

    function generateNonce(address asserter, address challenger) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(asserter, challenger, msg.sender)));
    }

    function getChallengeTemplate(uint256 challengeType) private view returns (ICloneable) {
        if (challengeType == ChallengeUtils.getInvalidInboxType()) {
            return inboxTopChallengeTemplate;
        } else if (challengeType == ChallengeUtils.getInvalidExType()) {
            return executionChallengeTemplate;
        } else {
            require(false, INVALID_TYPE_STR);
        }
    }
}
