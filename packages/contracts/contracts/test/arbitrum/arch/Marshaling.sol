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

import "./Value.sol";
import "./Hashing.sol";

import "../libraries/BytesLib.sol";

library Marshaling {
    using BytesLib for bytes;
    using Value for Value.Data;

    function deserializeHashPreImage(bytes memory data, uint256 startOffset)
        internal
        pure
        returns (uint256 offset, Value.Data memory value)
    {
        require(data.length >= startOffset && data.length - startOffset >= 64, "to short");
        bytes32 hashData;
        uint256 size;
        (offset, hashData) = extractBytes32(data, startOffset);
        (offset, size) = deserializeInt(data, offset);
        return (offset, Value.newTuplePreImage(hashData, size));
    }

    function deserializeInt(bytes memory data, uint256 startOffset)
        internal
        pure
        returns (
            uint256, // offset
            uint256 // val
        )
    {
        require(data.length >= startOffset && data.length - startOffset >= 32, "too short");
        return (startOffset + 32, data.toUint(startOffset));
    }

    function deserializeCheckedInt(bytes memory data, uint256 startOffset)
        internal
        pure
        returns (
            bool, // valid
            uint256, // offset
            uint256 // val
        )
    {
        uint256 totalLength = data.length;
        if (
            totalLength < startOffset ||
            totalLength - startOffset < 33 ||
            uint8(data[startOffset]) != Value.intTypeCode()
        ) {
            return (false, startOffset, 0);
        }
        return (true, startOffset + 33, data.toUint(startOffset + 1));
    }

    function deserializeCodePoint(bytes memory data, uint256 startOffset)
        internal
        pure
        returns (
            uint256, // offset
            Value.Data memory // val
        )
    {
        uint256 offset = startOffset;
        uint8 immediateType;
        uint8 opCode;
        Value.Data memory immediate;
        bytes32 nextHash;

        (offset, immediateType) = extractUint8(data, offset);
        (offset, opCode) = extractUint8(data, offset);
        if (immediateType == 1) {
            (offset, immediate) = deserialize(data, offset);
        }
        (offset, nextHash) = extractBytes32(data, offset);
        if (immediateType == 1) {
            return (offset, Value.newCodePoint(opCode, nextHash, immediate));
        }
        return (offset, Value.newCodePoint(opCode, nextHash));
    }

    function deserializeTuple(
        uint8 memberCount,
        bytes memory data,
        uint256 startOffset
    )
        internal
        pure
        returns (
            uint256, // offset
            Value.Data[] memory // val
        )
    {
        uint256 offset = startOffset;
        Value.Data[] memory members = new Value.Data[](memberCount);
        for (uint8 i = 0; i < memberCount; i++) {
            (offset, members[i]) = deserialize(data, offset);
        }
        return (offset, members);
    }

    function deserialize(bytes memory data, uint256 startOffset)
        internal
        pure
        returns (
            uint256, // offset
            Value.Data memory // val
        )
    {
        require(startOffset < data.length, "invalid offset");
        (uint256 offset, uint8 valType) = extractUint8(data, startOffset);
        if (valType == Value.intTypeCode()) {
            uint256 intVal;
            (offset, intVal) = deserializeInt(data, offset);
            return (offset, Value.newInt(intVal));
        } else if (valType == Value.codePointTypeCode()) {
            return deserializeCodePoint(data, offset);
        } else if (valType == Value.tuplePreImageTypeCode()) {
            return deserializeHashPreImage(data, offset);
        } else if (valType >= Value.tupleTypeCode() && valType < Value.valueTypeCode()) {
            uint8 tupLength = uint8(valType - Value.tupleTypeCode());
            Value.Data[] memory tupleVal;
            (offset, tupleVal) = deserializeTuple(tupLength, data, offset);
            return (offset, Value.newTuple(tupleVal));
        }
        require(false, "invalid typecode");
    }

    /**
     * @notice Convert data[startOffset:startOffset + dataLength] into an Arbitrum bytestack value
     * @dev The bytestack object is a series of nested 2 tuples terminating in an empty tuple, ex. (size, (data1, (data2, (data3, ()))))
     * @param data Data object containing a superset of the data we want to serialize
     * @param startOffset Offset in data where the data we want to convert beings
     * @param dataLength Number of bytes that we want to include in the bytestack result
     */
    function bytesToBytestack(
        bytes memory data,
        uint256 startOffset,
        uint256 dataLength
    ) internal pure returns (Value.Data memory) {
        uint256 wholeChunkCount = dataLength / 32;

        // tuple code + size + (for each chunk tuple code + chunk val) + empty tuple code
        Value.Data memory stack = Value.newEmptyTuple();
        Value.Data[] memory vals = new Value.Data[](2);

        // Break each full chunk of the data into 32 byte ints an interatively construct nested tuples including the data
        for (uint256 i = 0; i < wholeChunkCount; i++) {
            vals[0] = Value.newInt(data.toUint(startOffset + i * 32));
            vals[1] = stack;
            stack = Hashing.getTuplePreImage(vals);
        }

        // If the data didn't evenly divide into chunks. We take the remaining data and add it to the bytestack
        if (dataLength % 32 != 0) {
            // Grab the last 32 byte of the data and then shift it over to get only the relevent value. This way we avoid reading beyond the end of the data
            uint256 lastVal = data.toUint(startOffset + dataLength - 32);
            lastVal <<= (32 - (dataLength % 32)) * 8;
            vals[0] = Value.newInt(lastVal);
            vals[1] = stack;
            stack = Hashing.getTuplePreImage(vals);
        }

        // Include the length of the included data at the top level of the tuple stack
        vals[0] = Value.newInt(dataLength);
        vals[1] = stack;

        return Hashing.getTuplePreImage(vals);
    }

    /**
     * @notice If the data passed to this function is a valid bytestack object, return the convertion of it to raw bytes form. Otherwise return that it was invalid.
     * @dev The bytestack format is described in the documentation of bytesToBytestack
     * @param data Data object containing the potential serialized bytestack value
     * @param startOffset Offset in data where the bytestack is claimed to begin
     */
    function bytestackToBytes(bytes memory data, uint256 startOffset)
        internal
        pure
        returns (
            bool valid,
            uint256 offset,
            bytes memory byteData
        )
    {
        // Bytestack should start with the size in bytes of the contained data
        uint256 byteCount;
        (valid, offset, byteCount) = parseBytestackChunk(data, startOffset);
        if (!valid) {
            return (false, offset, byteData);
        }

        // If byteCount % 32 != 0, the last chunk will have byteCount % 32 bytes of data in it and the rest should be ignored
        uint256 fullChunkCount = byteCount / 32;
        uint256 partialChunkSize = byteCount % 32;
        uint256 totalChunkCount = fullChunkCount + (partialChunkSize > 0 ? 1 : 0);

        bytes32[] memory fullChunks = new bytes32[](fullChunkCount);
        bytes memory partialChunk = new bytes(partialChunkSize);

        uint256 fullChunkIndex = 0;

        for (uint256 i = 0; i < totalChunkCount; i++) {
            uint256 nextChunk;
            (valid, offset, nextChunk) = parseBytestackChunk(data, offset);
            if (!valid) {
                return (false, offset, byteData);
            }

            // The chunks appear backwards in the serialization so we reverse their order there
            // Therefore the first chunk is the one which may be partial
            if (i == 0 && partialChunkSize > 0) {
                // Copy only partialChunkSize bytes over into partialChunk
                bytes32 chunkBytes = bytes32(nextChunk);
                for (uint256 j = 0; j < partialChunkSize; j++) {
                    partialChunk[j] = chunkBytes[j];
                }
            } else {
                // Put the chunks into fullChunks in reverse order
                // We use a separate index fullChunkIndex since we may or may not have included a partial chunk
                fullChunks[fullChunkCount - 1 - fullChunkIndex] = bytes32(nextChunk);
                fullChunkIndex++;
            }
        }
        // The bytestack should end with an empty tuple
        uint8 valType;
        (offset, valType) = extractUint8(data, offset);
        if (valType != Value.tupleTypeCode()) {
            return (false, offset, byteData);
        }
        return (true, offset, abi.encodePacked(fullChunks, partialChunk));
    }

    function parseBytestackChunk(bytes memory data, uint256 startOffset)
        private
        pure
        returns (
            bool valid,
            uint256 offset,
            uint256 nextChunk
        )
    {
        uint8 valType;
        (offset, valType) = extractUint8(data, startOffset);
        if (valType != Value.tupleTypeCode() + 2) {
            return (false, offset, nextChunk);
        }
        (valid, offset, nextChunk) = deserializeCheckedInt(data, offset);
        if (!valid) {
            return (false, offset, nextChunk);
        }
        return (true, offset, nextChunk);
    }

    function extractUint8(bytes memory data, uint256 startOffset)
        private
        pure
        returns (
            uint256, // offset
            uint8 // val
        )
    {
        return (startOffset + 1, uint8(data[startOffset]));
    }

    function extractBytes32(bytes memory data, uint256 startOffset)
        private
        pure
        returns (
            uint256, // offset
            bytes32 // val
        )
    {
        return (startOffset + 32, data.toBytes32(startOffset));
    }
}
