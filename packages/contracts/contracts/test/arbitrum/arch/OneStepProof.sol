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

import "./IOneStepProof.sol";
import "./Value.sol";
import "./Machine.sol";
import "../inbox/Messages.sol";
import "../libraries/Precompiles.sol";

// Originally forked from https://github.com/leapdao/solEVM-enforcer/tree/master

contract OneStepProof is IOneStepProof {
    using Machine for Machine.Data;
    using Hashing for Value.Data;
    using Value for Value.Data;

    uint256 private constant SEND_SIZE_LIMIT = 10000;

    uint256 private constant MAX_UINT256 = ((1 << 128) + 1) * ((1 << 128) - 1);
    uint256 private constant MAX_PAIRING_COUNT = 30;

    string private constant BAD_IMM_TYP = "BAD_IMM_TYP";
    string private constant NO_IMM = "NO_IMM";
    string private constant STACK_MISSING = "STACK_MISSING";
    string private constant AUX_MISSING = "AUX_MISSING";
    string private constant STACK_MANY = "STACK_MANY";
    string private constant AUX_MANY = "AUX_MANY";
    string private constant INBOX_VAL = "INBOX_VAL";

    function executeStep(
        bytes32 inboxAcc,
        bytes32 messagesAcc,
        bytes32 logsAcc,
        bytes calldata proof
    ) external view returns (uint64 gas, bytes32[5] memory fields) {
        AssertionContext memory context = initializeExecutionContext(
            inboxAcc,
            messagesAcc,
            logsAcc,
            proof
        );

        executeOp(context);

        return returnContext(context);
    }

    function executeStepWithMessage(
        bytes32 inboxAcc,
        bytes32 messagesAcc,
        bytes32 logsAcc,
        bytes calldata proof,
        uint8 _kind,
        uint256 _blockNumber,
        uint256 _timestamp,
        address _sender,
        uint256 _inboxSeqNum,
        bytes calldata _msgData
    ) external view returns (uint64 gas, bytes32[5] memory fields) {
        AssertionContext memory context = initializeExecutionContext(
            inboxAcc,
            messagesAcc,
            logsAcc,
            proof
        );

        context.inboxMessageHash = Messages.messageHash(
            _kind,
            _sender,
            _blockNumber,
            _timestamp,
            _inboxSeqNum,
            keccak256(_msgData)
        );

        context.inboxMessage = Messages.messageValue(
            _kind,
            _blockNumber,
            _timestamp,
            _sender,
            _inboxSeqNum,
            _msgData
        );
        executeOp(context);
        return returnContext(context);
    }

    // fields
    // startMachineHash,
    // endMachineHash,
    // afterInboxHash,
    // afterMessagesHash,
    // afterLogsHash

    function returnContext(AssertionContext memory context)
        private
        pure
        returns (uint64 gas, bytes32[5] memory fields)
    {
        return (
            context.gas,
            [
                Machine.hash(context.startMachine),
                Machine.hash(context.afterMachine),
                context.inboxAcc,
                context.messageAcc,
                context.logAcc
            ]
        );
    }

    struct ValueStack {
        uint256 length;
        Value.Data[] values;
    }

    function popVal(ValueStack memory stack) private pure returns (Value.Data memory) {
        Value.Data memory val = stack.values[stack.length - 1];
        stack.length--;
        return val;
    }

    function pushVal(ValueStack memory stack, Value.Data memory val) private pure {
        stack.values[stack.length] = val;
        stack.length++;
    }

    struct AssertionContext {
        Machine.Data startMachine;
        Machine.Data afterMachine;
        bytes32 inboxAcc;
        bytes32 messageAcc;
        bytes32 logAcc;
        uint64 gas;
        Value.Data inboxMessage;
        bytes32 inboxMessageHash;
        ValueStack stack;
        ValueStack auxstack;
        bool hadImmediate;
        uint8 opcode;
        bytes proof;
        uint256 offset;
    }

    function handleError(AssertionContext memory context) private pure {
        if (context.afterMachine.errHandlerHash == CODE_POINT_ERROR) {
            context.afterMachine.setErrorStop();
        } else {
            context.afterMachine.instructionStackHash = context.afterMachine.errHandlerHash;
        }
    }

    function deductGas(AssertionContext memory context, uint64 amount) private pure returns (bool) {
        context.gas += amount;
        if (context.afterMachine.arbGasRemaining < amount) {
            context.afterMachine.arbGasRemaining = MAX_UINT256;
            handleError(context);
            return true;
        } else {
            context.afterMachine.arbGasRemaining -= amount;
            return false;
        }
    }

    function handleOpcodeError(AssertionContext memory context) private pure {
        handleError(context);
        // Also clear the stack and auxstack
        context.stack.length = 0;
        context.auxstack.length = 0;
    }

    function initializeExecutionContext(
        bytes32 inboxAcc,
        bytes32 messagesAcc,
        bytes32 logsAcc,
        bytes memory proof
    ) internal pure returns (AssertionContext memory) {
        uint8 stackCount = uint8(proof[0]);
        uint8 auxstackCount = uint8(proof[1]);
        uint256 offset = 2;

        // Leave some extra space for values pushed on the stack in the proofs
        Value.Data[] memory stackVals = new Value.Data[](stackCount + 4);
        Value.Data[] memory auxstackVals = new Value.Data[](auxstackCount + 4);
        for (uint256 i = 0; i < stackCount; i++) {
            (offset, stackVals[i]) = Marshaling.deserialize(proof, offset);
        }
        for (uint256 i = 0; i < auxstackCount; i++) {
            (offset, auxstackVals[i]) = Marshaling.deserialize(proof, offset);
        }
        Machine.Data memory mach;
        (offset, mach) = Machine.deserializeMachine(proof, offset);

        uint8 immediate = uint8(proof[offset]);
        uint8 opCode = uint8(proof[offset + 1]);
        offset += 2;
        AssertionContext memory context = AssertionContext(
            mach,
            mach.clone(),
            inboxAcc,
            messagesAcc,
            logsAcc,
            0,
            Value.newEmptyTuple(),
            0,
            ValueStack(stackCount, stackVals),
            ValueStack(auxstackCount, auxstackVals),
            immediate == 1,
            opCode,
            proof,
            offset
        );

        require(immediate == 0 || immediate == 1, BAD_IMM_TYP);
        Value.Data memory cp;
        if (immediate == 0) {
            cp = Value.newCodePoint(uint8(opCode), context.startMachine.instructionStackHash);
        } else {
            // If we have an immediate, there must be at least one stack value
            require(stackVals.length > 0, NO_IMM);
            cp = Value.newCodePoint(
                uint8(opCode),
                context.startMachine.instructionStackHash,
                stackVals[stackCount - 1]
            );
        }
        context.startMachine.instructionStackHash = cp.hash();

        // Add the stack and auxstack values to the start machine
        uint256 i = 0;
        for (i = 0; i < stackCount - immediate; i++) {
            context.startMachine.addDataStackValue(stackVals[i]);
        }
        for (i = 0; i < auxstackCount; i++) {
            context.startMachine.addAuxStackValue(auxstackVals[i]);
        }

        return context;
    }

    function executeOp(AssertionContext memory context) internal view {
        (
            uint256 dataPopCount,
            uint256 auxPopCount,
            uint64 gasCost,
            function(AssertionContext memory) internal view impl
        ) = opInfo(context.opcode);

        // Update end machine gas remaining before running opcode
        if (deductGas(context, gasCost)) {
            return;
        }

        if (context.stack.length < dataPopCount) {
            // If we have insufficient values, reject the proof unless the stack has been fully exhausted
            require(
                context.afterMachine.dataStack.hash() == Value.newEmptyTuple().hash(),
                STACK_MISSING
            );
            // If the stack is empty, the instruction underflowed so we have hit an error
            handleError(context);
            return;
        }

        if (context.auxstack.length < auxPopCount) {
            // If we have insufficient values, reject the proof unless the auxstack has been fully exhausted
            require(
                context.afterMachine.auxStack.hash() == Value.newEmptyTuple().hash(),
                AUX_MISSING
            );
            // If the auxstack is empty, the instruction underflowed so we have hit an error
            handleError(context);
            return;
        }

        // Require the prover to submit the minimal number of stack items
        require(
            ((dataPopCount > 0 || !context.hadImmediate) && context.stack.length == dataPopCount) ||
                (context.hadImmediate && dataPopCount == 0 && context.stack.length == 1),
            STACK_MANY
        );
        require(context.auxstack.length == auxPopCount, AUX_MANY);

        impl(context);

        // Add the stack and auxstack values to the start machine
        uint256 i = 0;

        for (i = 0; i < context.stack.length; i++) {
            context.afterMachine.addDataStackValue(context.stack.values[i]);
        }

        for (i = 0; i < context.auxstack.length; i++) {
            context.afterMachine.addAuxStackValue(context.auxstack.values[i]);
        }
    }

    /* solhint-disable no-inline-assembly */

    // Arithmetic

    function binaryMathOp(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        if (!val1.isInt() || !val2.isInt()) {
            handleOpcodeError(context);
            return;
        }
        uint256 a = val1.intVal;
        uint256 b = val2.intVal;

        uint256 c;
        if (context.opcode == OP_ADD) {
            assembly {
                c := add(a, b)
            }
        } else if (context.opcode == OP_MUL) {
            assembly {
                c := mul(a, b)
            }
        } else if (context.opcode == OP_SUB) {
            assembly {
                c := sub(a, b)
            }
        } else if (context.opcode == OP_EXP) {
            assembly {
                c := exp(a, b)
            }
        } else if (context.opcode == OP_SIGNEXTEND) {
            assembly {
                c := signextend(a, b)
            }
        } else if (context.opcode == OP_LT) {
            assembly {
                c := lt(a, b)
            }
        } else if (context.opcode == OP_GT) {
            assembly {
                c := gt(a, b)
            }
        } else if (context.opcode == OP_SLT) {
            assembly {
                c := slt(a, b)
            }
        } else if (context.opcode == OP_SGT) {
            assembly {
                c := sgt(a, b)
            }
        } else if (context.opcode == OP_AND) {
            assembly {
                c := and(a, b)
            }
        } else if (context.opcode == OP_OR) {
            assembly {
                c := or(a, b)
            }
        } else if (context.opcode == OP_XOR) {
            assembly {
                c := xor(a, b)
            }
        } else if (context.opcode == OP_BYTE) {
            assembly {
                c := byte(a, b)
            }
        } else if (context.opcode == OP_SHL) {
            assembly {
                c := shl(a, b)
            }
        } else if (context.opcode == OP_SHR) {
            assembly {
                c := shr(a, b)
            }
        } else if (context.opcode == OP_SAR) {
            assembly {
                c := sar(a, b)
            }
        } else if (context.opcode == OP_ETHHASH2) {
            c = uint256(keccak256(abi.encodePacked(a, b)));
        } else {
            assert(false);
        }

        pushVal(context.stack, Value.newInt(c));
    }

    function binaryMathOpZero(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        if (!val1.isInt() || !val2.isInt() || val2.intVal == 0) {
            handleOpcodeError(context);
            return;
        }
        uint256 a = val1.intVal;
        uint256 b = val2.intVal;

        uint256 c;
        if (context.opcode == OP_DIV) {
            assembly {
                c := div(a, b)
            }
        } else if (context.opcode == OP_SDIV) {
            assembly {
                c := sdiv(a, b)
            }
        } else if (context.opcode == OP_MOD) {
            assembly {
                c := mod(a, b)
            }
        } else if (context.opcode == OP_SMOD) {
            assembly {
                c := smod(a, b)
            }
        } else {
            assert(false);
        }

        pushVal(context.stack, Value.newInt(c));
    }

    function executeMathModInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        if (!val1.isInt() || !val2.isInt() || !val3.isInt() || val3.intVal == 0) {
            handleOpcodeError(context);
            return;
        }
        uint256 a = val1.intVal;
        uint256 b = val2.intVal;
        uint256 m = val3.intVal;

        uint256 c;

        if (context.opcode == OP_ADDMOD) {
            assembly {
                c := addmod(a, b, m)
            }
        } else if (context.opcode == OP_MULMOD) {
            assembly {
                c := mulmod(a, b, m)
            }
        } else {
            assert(false);
        }

        pushVal(context.stack, Value.newInt(c));
    }

    function executeEqInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        pushVal(context.stack, Value.newBoolean(val1.hash() == val2.hash()));
    }

    function executeIszeroInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        if (!val1.isInt()) {
            pushVal(context.stack, Value.newInt(0));
        } else {
            uint256 a = val1.intVal;
            uint256 c;
            assembly {
                c := iszero(a)
            }
            pushVal(context.stack, Value.newInt(c));
        }
    }

    function executeNotInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        if (!val1.isInt()) {
            handleOpcodeError(context);
            return;
        }
        uint256 a = val1.intVal;
        uint256 c;
        assembly {
            c := not(a)
        }
        pushVal(context.stack, Value.newInt(c));
    }

    /* solhint-enable no-inline-assembly */

    // Hash

    function executeHashInsn(AssertionContext memory context) internal pure {
        Value.Data memory val = popVal(context.stack);
        pushVal(context.stack, Value.newInt(uint256(val.hash())));
    }

    function executeTypeInsn(AssertionContext memory context) internal pure {
        Value.Data memory val = popVal(context.stack);
        pushVal(context.stack, val.typeCodeVal());
    }

    function executeKeccakFInsn(AssertionContext memory context) internal pure {
        Value.Data memory val = popVal(context.stack);
        if (!val.isTuple() || val.tupleVal.length != 7) {
            handleOpcodeError(context);
            return;
        }

        Value.Data[] memory values = val.tupleVal;
        for (uint256 i = 0; i < 7; i++) {
            if (!values[i].isInt()) {
                handleOpcodeError(context);
                return;
            }
        }
        uint256[25] memory data;
        for (uint256 i = 0; i < 25; i++) {
            data[5 * (i % 5) + i / 5] = uint256(uint64(values[i / 4].intVal >> ((i % 4) * 64)));
        }

        data = Precompiles.keccakF(data);

        Value.Data[] memory outValues = new Value.Data[](7);
        for (uint256 i = 0; i < 7; i++) {
            outValues[i] = Value.newInt(0);
        }

        for (uint256 i = 0; i < 25; i++) {
            outValues[i / 4].intVal |= data[5 * (i % 5) + i / 5] << ((i % 4) * 64);
        }

        pushVal(context.stack, Value.newTuple(outValues));
    }

    function executeSha256FInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        if (!val1.isInt() || !val2.isInt() || !val3.isInt()) {
            handleOpcodeError(context);
            return;
        }
        uint256 a = val1.intVal;
        uint256 b = val2.intVal;
        uint256 c = val3.intVal;

        pushVal(context.stack, Value.newInt(Precompiles.sha256Block([b, c], a)));
    }

    // Stack ops

    function executePopInsn(AssertionContext memory context) internal pure {
        popVal(context.stack);
    }

    function executeSpushInsn(AssertionContext memory context) internal pure {
        pushVal(context.stack, context.afterMachine.staticVal);
    }

    function executeRpushInsn(AssertionContext memory context) internal pure {
        pushVal(context.stack, context.afterMachine.registerVal);
    }

    function executeRsetInsn(AssertionContext memory context) internal pure {
        context.afterMachine.registerVal = popVal(context.stack);
    }

    function executeJumpInsn(AssertionContext memory context) internal pure {
        Value.Data memory val = popVal(context.stack);
        if (!val.isCodePoint()) {
            handleOpcodeError(context);
            return;
        }
        context.afterMachine.instructionStackHash = val.hash();
    }

    function executeCjumpInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        if (!val1.isCodePoint() || !val2.isInt()) {
            handleOpcodeError(context);
            return;
        }
        if (val2.intVal != 0) {
            context.afterMachine.instructionStackHash = val1.hash();
        }
    }

    function executeStackemptyInsn(AssertionContext memory context) internal pure {
        bool empty = context.stack.length == 0 &&
            context.afterMachine.dataStack.hash() == Value.newEmptyTuple().hash();
        pushVal(context.stack, Value.newBoolean(empty));
    }

    function executePcpushInsn(AssertionContext memory context) internal pure {
        pushVal(context.stack, Value.newHashedValue(context.startMachine.instructionStackHash, 1));
    }

    function executeAuxpushInsn(AssertionContext memory context) internal pure {
        pushVal(context.auxstack, popVal(context.stack));
    }

    function executeAuxpopInsn(AssertionContext memory context) internal pure {
        pushVal(context.stack, popVal(context.auxstack));
    }

    function executeAuxstackemptyInsn(AssertionContext memory context) internal pure {
        bool empty = context.auxstack.length == 0 &&
            context.afterMachine.auxStack.hash() == Value.newEmptyTuple().hash();
        pushVal(context.stack, Value.newBoolean(empty));
    }

    function executeNopInsn(AssertionContext memory) internal pure {}

    function executeErrpushInsn(AssertionContext memory context) internal pure {
        pushVal(context.stack, Value.newHashedValue(context.afterMachine.errHandlerHash, 1));
    }

    function executeErrsetInsn(AssertionContext memory context) internal pure {
        Value.Data memory val = popVal(context.stack);
        if (!val.isCodePoint()) {
            handleOpcodeError(context);
            return;
        }
        context.afterMachine.errHandlerHash = val.hash();
    }

    // Dup ops

    function executeDup0Insn(AssertionContext memory context) internal pure {
        Value.Data memory val = popVal(context.stack);
        pushVal(context.stack, val);
        pushVal(context.stack, val);
    }

    function executeDup1Insn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        pushVal(context.stack, val2);
        pushVal(context.stack, val1);
        pushVal(context.stack, val2);
    }

    function executeDup2Insn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        pushVal(context.stack, val3);
        pushVal(context.stack, val2);
        pushVal(context.stack, val1);
        pushVal(context.stack, val3);
    }

    // Swap ops

    function executeSwap1Insn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        pushVal(context.stack, val1);
        pushVal(context.stack, val2);
    }

    function executeSwap2Insn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        pushVal(context.stack, val1);
        pushVal(context.stack, val2);
        pushVal(context.stack, val3);
    }

    // Tuple ops

    function executeTgetInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        if (!val1.isInt() || !val2.isTuple() || val1.intVal >= val2.valLength()) {
            handleOpcodeError(context);
            return;
        }
        pushVal(context.stack, val2.tupleVal[val1.intVal]);
    }

    function executeTsetInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        if (!val1.isInt() || !val2.isTuple() || val1.intVal >= val2.valLength()) {
            handleOpcodeError(context);
            return;
        }
        Value.Data[] memory tupleVals = val2.tupleVal;
        tupleVals[val1.intVal] = val3;
        pushVal(context.stack, Value.newTuple(tupleVals));
    }

    function executeTlenInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        if (!val1.isTuple()) {
            handleOpcodeError(context);
            return;
        }
        pushVal(context.stack, Value.newInt(val1.valLength()));
    }

    function executeXgetInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory auxVal = popVal(context.auxstack);
        if (!val1.isInt() || !auxVal.isTuple() || val1.intVal >= auxVal.valLength()) {
            handleOpcodeError(context);
            return;
        }
        pushVal(context.auxstack, auxVal);
        pushVal(context.stack, auxVal.tupleVal[val1.intVal]);
    }

    function executeXsetInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory auxVal = popVal(context.auxstack);
        if (!auxVal.isTuple() || !val1.isInt() || val1.intVal >= auxVal.valLength()) {
            handleOpcodeError(context);
            return;
        }
        Value.Data[] memory tupleVals = auxVal.tupleVal;
        tupleVals[val1.intVal] = val2;
        pushVal(context.auxstack, Value.newTuple(tupleVals));
    }

    // Logging

    function executeLogInsn(AssertionContext memory context) internal pure {
        context.logAcc = keccak256(abi.encodePacked(context.logAcc, popVal(context.stack).hash()));
    }

    // System operations

    function executeSendInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        if (val1.size > SEND_SIZE_LIMIT || !val1.isValidTypeForSend()) {
            handleOpcodeError(context);
            return;
        }
        context.messageAcc = keccak256(abi.encodePacked(context.messageAcc, val1.hash()));
    }

    function incrementInbox(AssertionContext memory context)
        private
        pure
        returns (Value.Data memory)
    {
        require(context.inboxMessageHash != 0, INBOX_VAL);
        context.inboxAcc = Messages.addMessageToInbox(context.inboxAcc, context.inboxMessageHash);
        return context.inboxMessage;
    }

    function executeInboxPeekInsn(AssertionContext memory context) internal pure {
        Value.Data memory val = popVal(context.stack);
        if (context.afterMachine.pendingMessage.hash() != Value.newEmptyTuple().hash()) {
            context.afterMachine.pendingMessage = incrementInbox(context);
        }
        // The pending message must be a tuple of size at least 2
        pushVal(
            context.stack,
            Value.newBoolean(context.afterMachine.pendingMessage.tupleVal[1].hash() == val.hash())
        );
    }

    function executeInboxInsn(AssertionContext memory context) internal pure {
        if (context.afterMachine.pendingMessage.hash() != Value.newEmptyTuple().hash()) {
            // The pending message field is already full
            pushVal(context.stack, context.afterMachine.pendingMessage);
            context.afterMachine.pendingMessage = Value.newEmptyTuple();
        } else {
            pushVal(context.stack, incrementInbox(context));
        }
    }

    function executeSetGasInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        if (!val1.isInt()) {
            handleOpcodeError(context);
            return;
        }
        context.afterMachine.arbGasRemaining = val1.intVal;
    }

    function executePushGasInsn(AssertionContext memory context) internal pure {
        pushVal(context.stack, Value.newInt(context.afterMachine.arbGasRemaining));
    }

    function executeErrCodePointInsn(AssertionContext memory context) internal pure {
        pushVal(context.stack, Value.newHashedValue(CODE_POINT_ERROR, 1));
    }

    function executePushInsnInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        if (!val1.isInt() || !val2.isCodePoint()) {
            handleOpcodeError(context);
            return;
        }
        pushVal(context.stack, Value.newCodePoint(uint8(val1.intVal), val2.hash()));
    }

    function executePushInsnImmInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        if (!val1.isInt() || !val3.isCodePoint()) {
            handleOpcodeError(context);
            return;
        }
        pushVal(context.stack, Value.newCodePoint(uint8(val1.intVal), val3.hash(), val2));
    }

    function executeSideloadInsn(AssertionContext memory context) internal pure {
        Value.Data[] memory values = new Value.Data[](0);
        pushVal(context.stack, Value.newTuple(values));
    }

    function executeECRecoverInsn(AssertionContext memory context) internal pure {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        Value.Data memory val4 = popVal(context.stack);
        if (!val1.isInt() || !val2.isInt() || !val3.isInt() || !val4.isInt()) {
            handleOpcodeError(context);
            return;
        }
        bytes32 r = bytes32(val1.intVal);
        bytes32 s = bytes32(val2.intVal);
        if (val3.intVal != 0 && val3.intVal != 1) {
            pushVal(context.stack, Value.newInt(0));
            return;
        }
        uint8 v = uint8(val3.intVal) + 27;
        bytes32 message = bytes32(val4.intVal);
        address ret = ecrecover(message, v, r, s);
        pushVal(context.stack, Value.newInt(uint256(ret)));
    }

    function executeECAddInsn(AssertionContext memory context) internal view {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        Value.Data memory val4 = popVal(context.stack);
        if (!val1.isInt() || !val2.isInt() || !val3.isInt() || !val4.isInt()) {
            handleOpcodeError(context);
            return;
        }
        uint256[4] memory bnAddInput = [val1.intVal, val2.intVal, val3.intVal, val4.intVal];
        uint256[2] memory ret;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, bnAddInput, 0x80, ret, 0x40)
        }
        if (!success) {
            // Must end on empty tuple
            handleOpcodeError(context);
            return;
        }
        pushVal(context.stack, Value.newInt(uint256(ret[1])));
        pushVal(context.stack, Value.newInt(uint256(ret[0])));
    }

    function executeECMulInsn(AssertionContext memory context) internal view {
        Value.Data memory val1 = popVal(context.stack);
        Value.Data memory val2 = popVal(context.stack);
        Value.Data memory val3 = popVal(context.stack);
        if (!val1.isInt() || !val2.isInt() || !val3.isInt()) {
            handleOpcodeError(context);
            return;
        }
        uint256[3] memory bnAddInput = [val1.intVal, val2.intVal, val3.intVal];
        uint256[2] memory ret;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, bnAddInput, 0x80, ret, 0x40)
        }
        if (!success) {
            // Must end on empty tuple
            handleOpcodeError(context);
            return;
        }
        pushVal(context.stack, Value.newInt(uint256(ret[1])));
        pushVal(context.stack, Value.newInt(uint256(ret[0])));
    }

    function executeECPairingInsn(AssertionContext memory context) internal view {
        Value.Data memory val = popVal(context.stack);

        Value.Data[MAX_PAIRING_COUNT] memory items;
        uint256 count;
        for (count = 0; count < MAX_PAIRING_COUNT; count++) {
            if (!val.isTuple()) {
                handleOpcodeError(context);
                return;
            }
            Value.Data[] memory stackTupleVals = val.tupleVal;
            if (stackTupleVals.length == 0) {
                // We reached the bottom of the stack
                break;
            }
            if (stackTupleVals.length != 2) {
                handleOpcodeError(context);
                return;
            }
            items[count] = stackTupleVals[0];
            val = stackTupleVals[1];
        }

        if (deductGas(context, uint64(EC_PAIRING_POINT_GAS_COST * count))) {
            return;
        }

        if (!val.isTuple() || val.tupleVal.length != 0) {
            // Must end on empty tuple
            handleOpcodeError(context);
            return;
        }

        // Allocate the maximum amount of space we might need
        uint256[MAX_PAIRING_COUNT * 6] memory input;
        for (uint256 i = 0; i < count; i++) {
            Value.Data memory pointVal = items[i];
            if (!pointVal.isTuple()) {
                handleOpcodeError(context);
                return;
            }

            Value.Data[] memory pointTupleVals = pointVal.tupleVal;
            if (pointTupleVals.length != 6) {
                handleOpcodeError(context);
                return;
            }

            for (uint256 j = 0; j < 6; j++) {
                if (!pointTupleVals[j].isInt()) {
                    handleOpcodeError(context);
                    return;
                }
            }
            input[i * 6] = pointTupleVals[0].intVal;
            input[i * 6 + 1] = pointTupleVals[1].intVal;
            input[i * 6 + 2] = pointTupleVals[3].intVal;
            input[i * 6 + 3] = pointTupleVals[2].intVal;
            input[i * 6 + 4] = pointTupleVals[5].intVal;
            input[i * 6 + 5] = pointTupleVals[4].intVal;
        }

        uint256 inputSize = count * 6 * 0x20;
        uint256[1] memory out;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, input, inputSize, out, 0x20)
        }

        if (!success) {
            handleOpcodeError(context);
            return;
        }

        pushVal(context.stack, Value.newBoolean(out[0] != 0));
    }

    function executeErrorInsn(AssertionContext memory context) internal pure {
        handleOpcodeError(context);
    }

    function executeStopInsn(AssertionContext memory context) internal pure {
        context.afterMachine.setHalt();
    }

    // Stop and arithmetic ops
    uint8 private constant OP_ADD = 0x01;
    uint8 private constant OP_MUL = 0x02;
    uint8 private constant OP_SUB = 0x03;
    uint8 private constant OP_DIV = 0x04;
    uint8 private constant OP_SDIV = 0x05;
    uint8 private constant OP_MOD = 0x06;
    uint8 private constant OP_SMOD = 0x07;
    uint8 private constant OP_ADDMOD = 0x08;
    uint8 private constant OP_MULMOD = 0x09;
    uint8 private constant OP_EXP = 0x0a;
    uint8 private constant OP_SIGNEXTEND = 0x0b;

    // Comparison & bitwise logic
    uint8 private constant OP_LT = 0x10;
    uint8 private constant OP_GT = 0x11;
    uint8 private constant OP_SLT = 0x12;
    uint8 private constant OP_SGT = 0x13;
    uint8 private constant OP_EQ = 0x14;
    uint8 private constant OP_ISZERO = 0x15;
    uint8 private constant OP_AND = 0x16;
    uint8 private constant OP_OR = 0x17;
    uint8 private constant OP_XOR = 0x18;
    uint8 private constant OP_NOT = 0x19;
    uint8 private constant OP_BYTE = 0x1a;
    uint8 private constant OP_SHL = 0x1b;
    uint8 private constant OP_SHR = 0x1c;
    uint8 private constant OP_SAR = 0x1d;

    // SHA3
    uint8 private constant OP_HASH = 0x20;
    uint8 private constant OP_TYPE = 0x21;
    uint8 private constant OP_ETHHASH2 = 0x22;
    uint8 private constant OP_KECCAK_F = 0x23;
    uint8 private constant OP_SHA256_F = 0x24;

    // Stack, Memory, Storage and Flow Operations
    uint8 private constant OP_POP = 0x30;
    uint8 private constant OP_SPUSH = 0x31;
    uint8 private constant OP_RPUSH = 0x32;
    uint8 private constant OP_RSET = 0x33;
    uint8 private constant OP_JUMP = 0x34;
    uint8 private constant OP_CJUMP = 0x35;
    uint8 private constant OP_STACKEMPTY = 0x36;
    uint8 private constant OP_PCPUSH = 0x37;
    uint8 private constant OP_AUXPUSH = 0x38;
    uint8 private constant OP_AUXPOP = 0x39;
    uint8 private constant OP_AUXSTACKEMPTY = 0x3a;
    uint8 private constant OP_NOP = 0x3b;
    uint8 private constant OP_ERRPUSH = 0x3c;
    uint8 private constant OP_ERRSET = 0x3d;

    // Duplication and Exchange operations
    uint8 private constant OP_DUP0 = 0x40;
    uint8 private constant OP_DUP1 = 0x41;
    uint8 private constant OP_DUP2 = 0x42;
    uint8 private constant OP_SWAP1 = 0x43;
    uint8 private constant OP_SWAP2 = 0x44;

    // Tuple opertations
    uint8 private constant OP_TGET = 0x50;
    uint8 private constant OP_TSET = 0x51;
    uint8 private constant OP_TLEN = 0x52;
    uint8 private constant OP_XGET = 0x53;
    uint8 private constant OP_XSET = 0x54;

    // Logging opertations
    uint8 private constant OP_BREAKPOINT = 0x60;
    uint8 private constant OP_LOG = 0x61;

    // System operations
    uint8 private constant OP_SEND = 0x70;
    uint8 private constant OP_INBOX_PEEK = 0x71;
    uint8 private constant OP_INBOX = 0x72;
    uint8 private constant OP_ERROR = 0x73;
    uint8 private constant OP_STOP = 0x74;
    uint8 private constant OP_SETGAS = 0x75;
    uint8 private constant OP_PUSHGAS = 0x76;
    uint8 private constant OP_ERR_CODE_POINT = 0x77;
    uint8 private constant OP_PUSH_INSN = 0x78;
    uint8 private constant OP_PUSH_INSN_IMM = 0x79;
    // uint8 private constant OP_OPEN_INSN = 0x7a;
    uint8 private constant OP_SIDELOAD = 0x7b;

    uint8 private constant OP_ECRECOVER = 0x80;
    uint8 private constant OP_ECADD = 0x81;
    uint8 private constant OP_ECMUL = 0x82;
    uint8 private constant OP_ECPAIRING = 0x83;

    uint64 private constant EC_PAIRING_POINT_GAS_COST = 500000;

    uint8 private constant CODE_POINT_TYPECODE = 1;
    bytes32 private constant CODE_POINT_ERROR = keccak256(
        abi.encodePacked(CODE_POINT_TYPECODE, uint8(0), bytes32(0))
    );

    function opInfo(uint256 opCode)
        private
        pure
        returns (
            uint256, // stack pops
            uint256, // auxstack pops
            uint64, // gas used
            function(AssertionContext memory) internal view // impl
        )
    {
        if (opCode == OP_ADD || opCode == OP_MUL || opCode == OP_SUB) {
            return (2, 0, 3, binaryMathOp);
        } else if (opCode == OP_DIV || opCode == OP_MOD) {
            return (2, 0, 4, binaryMathOpZero);
        } else if (opCode == OP_SDIV || opCode == OP_SMOD) {
            return (2, 0, 7, binaryMathOpZero);
        } else if (opCode == OP_ADDMOD || opCode == OP_MULMOD) {
            return (3, 0, 4, executeMathModInsn);
        } else if (opCode == OP_EXP) {
            return (2, 0, 25, binaryMathOp);
        } else if (opCode == OP_SIGNEXTEND) {
            return (2, 0, 7, binaryMathOp);
        } else if (
            opCode == OP_LT ||
            opCode == OP_GT ||
            opCode == OP_SLT ||
            opCode == OP_SGT ||
            opCode == OP_AND ||
            opCode == OP_OR ||
            opCode == OP_XOR
        ) {
            return (2, 0, 2, binaryMathOp);
        } else if (opCode == OP_EQ) {
            return (2, 0, 2, executeEqInsn);
        } else if (opCode == OP_ISZERO) {
            return (1, 0, 1, executeIszeroInsn);
        } else if (opCode == OP_NOT) {
            return (1, 0, 1, executeNotInsn);
        } else if (opCode == OP_BYTE || opCode == OP_SHL || opCode == OP_SHR || opCode == OP_SAR) {
            return (2, 0, 4, binaryMathOp);
        } else if (opCode == OP_HASH) {
            return (1, 0, 7, executeHashInsn);
        } else if (opCode == OP_TYPE) {
            return (1, 0, 3, executeTypeInsn);
        } else if (opCode == OP_ETHHASH2) {
            return (2, 0, 8, binaryMathOp);
        } else if (opCode == OP_KECCAK_F) {
            return (1, 0, 600, executeKeccakFInsn);
        } else if (opCode == OP_SHA256_F) {
            return (3, 0, 250, executeSha256FInsn);
        } else if (opCode == OP_POP) {
            return (1, 0, 1, executePopInsn);
        } else if (opCode == OP_SPUSH) {
            return (0, 0, 1, executeSpushInsn);
        } else if (opCode == OP_RPUSH) {
            return (0, 0, 1, executeRpushInsn);
        } else if (opCode == OP_RSET) {
            return (1, 0, 2, executeRsetInsn);
        } else if (opCode == OP_JUMP) {
            return (1, 0, 4, executeJumpInsn);
        } else if (opCode == OP_CJUMP) {
            return (2, 0, 4, executeCjumpInsn);
        } else if (opCode == OP_STACKEMPTY) {
            return (0, 0, 2, executeStackemptyInsn);
        } else if (opCode == OP_PCPUSH) {
            return (0, 0, 1, executePcpushInsn);
        } else if (opCode == OP_AUXPUSH) {
            return (1, 0, 1, executeAuxpushInsn);
        } else if (opCode == OP_AUXPOP) {
            return (0, 1, 1, executeAuxpopInsn);
        } else if (opCode == OP_AUXSTACKEMPTY) {
            return (0, 0, 2, executeAuxstackemptyInsn);
        } else if (opCode == OP_NOP) {
            return (0, 0, 1, executeNopInsn);
        } else if (opCode == OP_ERRPUSH) {
            return (0, 0, 1, executeErrpushInsn);
        } else if (opCode == OP_ERRSET) {
            return (1, 0, 1, executeErrsetInsn);
        } else if (opCode == OP_DUP0) {
            return (1, 0, 1, executeDup0Insn);
        } else if (opCode == OP_DUP1) {
            return (2, 0, 1, executeDup1Insn);
        } else if (opCode == OP_DUP2) {
            return (3, 0, 1, executeDup2Insn);
        } else if (opCode == OP_SWAP1) {
            return (2, 0, 1, executeSwap1Insn);
        } else if (opCode == OP_SWAP2) {
            return (3, 0, 1, executeSwap2Insn);
        } else if (opCode == OP_TGET) {
            return (2, 0, 2, executeTgetInsn);
        } else if (opCode == OP_TSET) {
            return (3, 0, 40, executeTsetInsn);
        } else if (opCode == OP_TLEN) {
            return (1, 0, 2, executeTlenInsn);
        } else if (opCode == OP_XGET) {
            return (1, 1, 3, executeXgetInsn);
        } else if (opCode == OP_XSET) {
            return (2, 1, 41, executeXsetInsn);
        } else if (opCode == OP_BREAKPOINT) {
            return (0, 0, 100, executeNopInsn);
        } else if (opCode == OP_LOG) {
            return (1, 0, 100, executeLogInsn);
        } else if (opCode == OP_SEND) {
            return (1, 0, 100, executeSendInsn);
        } else if (opCode == OP_INBOX_PEEK) {
            return (1, 0, 40, executeInboxPeekInsn);
        } else if (opCode == OP_INBOX) {
            return (0, 0, 40, executeInboxInsn);
        } else if (opCode == OP_ERROR) {
            return (0, 0, 5, executeErrorInsn);
        } else if (opCode == OP_STOP) {
            return (0, 0, 10, executeStopInsn);
        } else if (opCode == OP_SETGAS) {
            return (1, 0, 0, executeSetGasInsn);
        } else if (opCode == OP_PUSHGAS) {
            return (0, 0, 1, executePushGasInsn);
        } else if (opCode == OP_ERR_CODE_POINT) {
            return (0, 0, 25, executeErrCodePointInsn);
        } else if (opCode == OP_PUSH_INSN) {
            return (2, 0, 25, executePushInsnInsn);
        } else if (opCode == OP_PUSH_INSN_IMM) {
            return (3, 0, 25, executePushInsnImmInsn);
        } else if (opCode == OP_SIDELOAD) {
            return (0, 0, 10, executeSideloadInsn);
        } else if (opCode == OP_ECRECOVER) {
            return (4, 0, 20000, executeECRecoverInsn);
        } else if (opCode == OP_ECADD) {
            return (4, 0, 3500, executeECAddInsn);
        } else if (opCode == OP_ECMUL) {
            return (3, 0, 82000, executeECMulInsn);
        } else if (opCode == OP_ECPAIRING) {
            return (1, 0, 1000, executeECPairingInsn);
        } else {
            return (0, 0, 0, executeErrorInsn);
        }
    }
}
