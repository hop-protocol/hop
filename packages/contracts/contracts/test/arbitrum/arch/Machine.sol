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

import "./Marshaling.sol";

import "../libraries/DebugPrint.sol";

library Machine {
    using Hashing for Value.Data;

    uint256 internal constant MACHINE_EXTENSIVE = 0;
    uint256 internal constant MACHINE_ERRORSTOP = 1;
    uint256 internal constant MACHINE_HALT = 2;

    function addStackVal(Value.Data memory stackValHash, Value.Data memory valHash)
        internal
        pure
        returns (Value.Data memory)
    {
        Value.Data[] memory vals = new Value.Data[](2);
        vals[0] = valHash;
        vals[1] = stackValHash;

        return Hashing.getTuplePreImage(vals);
    }

    struct Data {
        bytes32 instructionStackHash;
        Value.Data dataStack;
        Value.Data auxStack;
        Value.Data registerVal;
        Value.Data staticVal;
        uint256 arbGasRemaining;
        bytes32 errHandlerHash;
        Value.Data pendingMessage;
        uint256 status;
    }

    function toString(Data memory machine) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "Machine(",
                    DebugPrint.bytes32string(machine.instructionStackHash),
                    ", \n",
                    DebugPrint.bytes32string(machine.dataStack.hash()),
                    ", \n",
                    DebugPrint.bytes32string(machine.auxStack.hash()),
                    ", \n",
                    DebugPrint.bytes32string(machine.registerVal.hash()),
                    ", \n",
                    DebugPrint.bytes32string(machine.staticVal.hash()),
                    ", \n",
                    DebugPrint.uint2str(machine.arbGasRemaining),
                    ", \n",
                    DebugPrint.bytes32string(machine.errHandlerHash),
                    ", \n",
                    DebugPrint.bytes32string(machine.pendingMessage.hash()),
                    ")\n"
                )
            );
    }

    function setExtensive(Data memory machine) internal pure {
        machine.status = MACHINE_EXTENSIVE;
    }

    function setErrorStop(Data memory machine) internal pure {
        machine.status = MACHINE_ERRORSTOP;
    }

    function setHalt(Data memory machine) internal pure {
        machine.status = MACHINE_HALT;
    }

    function addDataStackValue(Data memory machine, Value.Data memory val) internal pure {
        machine.dataStack = addStackVal(machine.dataStack, val);
    }

    function addAuxStackValue(Data memory machine, Value.Data memory val) internal pure {
        machine.auxStack = addStackVal(machine.auxStack, val);
    }

    function addDataStackInt(Data memory machine, uint256 val) internal pure {
        machine.dataStack = addStackVal(machine.dataStack, Value.newInt(val));
    }

    function machineHash(
        bytes32 instructionStackHash,
        Value.Data memory dataStack,
        Value.Data memory auxStack,
        Value.Data memory registerVal,
        Value.Data memory staticVal,
        uint256 arbGasRemaining,
        bytes32 errHandlerHash,
        Value.Data memory pendingMessage
    ) internal pure returns (bytes32) {
        return
            hash(
                Data(
                    instructionStackHash,
                    dataStack,
                    auxStack,
                    registerVal,
                    staticVal,
                    arbGasRemaining,
                    errHandlerHash,
                    pendingMessage,
                    MACHINE_EXTENSIVE
                )
            );
    }

    function hash(Data memory machine) internal pure returns (bytes32) {
        if (machine.status == MACHINE_HALT) {
            return bytes32(uint256(0));
        } else if (machine.status == MACHINE_ERRORSTOP) {
            return bytes32(uint256(1));
        } else {
            return
                keccak256(
                    abi.encodePacked(
                        machine.instructionStackHash,
                        machine.dataStack.hash(),
                        machine.auxStack.hash(),
                        machine.registerVal.hash(),
                        machine.staticVal.hash(),
                        machine.arbGasRemaining,
                        machine.errHandlerHash,
                        machine.pendingMessage.hash()
                    )
                );
        }
    }

    function clone(Data memory machine) internal pure returns (Data memory) {
        return
            Data(
                machine.instructionStackHash,
                machine.dataStack,
                machine.auxStack,
                machine.registerVal,
                machine.staticVal,
                machine.arbGasRemaining,
                machine.errHandlerHash,
                machine.pendingMessage,
                machine.status
            );
    }

    function deserializeMachine(bytes memory data, uint256 offset)
        internal
        pure
        returns (
            uint256, // offset
            Data memory // machine
        )
    {
        Data memory m;
        m.status = MACHINE_EXTENSIVE;
        uint256 instructionStack;
        uint256 errHandler;
        (offset, instructionStack) = Marshaling.deserializeInt(data, offset);

        (offset, m.dataStack) = Marshaling.deserializeHashPreImage(data, offset);
        (offset, m.auxStack) = Marshaling.deserializeHashPreImage(data, offset);
        (offset, m.registerVal) = Marshaling.deserialize(data, offset);
        (offset, m.staticVal) = Marshaling.deserialize(data, offset);
        (offset, m.arbGasRemaining) = Marshaling.deserializeInt(data, offset);
        (offset, errHandler) = Marshaling.deserializeInt(data, offset);
        (offset, m.pendingMessage) = Marshaling.deserialize(data, offset);

        m.instructionStackHash = bytes32(instructionStack);
        m.errHandlerHash = bytes32(errHandler);
        return (offset, m);
    }
}
