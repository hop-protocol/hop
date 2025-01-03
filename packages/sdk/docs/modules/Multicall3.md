# Namespace: Multicall3

## Table of contents

### Type Aliases

- [Call3Struct](Multicall3.md#call3struct)
- [Call3StructOutput](Multicall3.md#call3structoutput)
- [Call3ValueStruct](Multicall3.md#call3valuestruct)
- [Call3ValueStructOutput](Multicall3.md#call3valuestructoutput)
- [CallStruct](Multicall3.md#callstruct)
- [CallStructOutput](Multicall3.md#callstructoutput)
- [ResultStruct](Multicall3.md#resultstruct)
- [ResultStructOutput](Multicall3.md#resultstructoutput)

## Type Aliases

### <a id="call3struct" name="call3struct"></a> Call3Struct

Ƭ **Call3Struct**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowFailure` | `PromiseOrValue`\<`boolean`\> |
| `callData` | `PromiseOrValue`\<`BytesLike`\> |
| `target` | `PromiseOrValue`\<`string`\> |

___

### <a id="call3structoutput" name="call3structoutput"></a> Call3StructOutput

Ƭ **Call3StructOutput**: [`string`, `boolean`, `string`] & \{ `allowFailure`: `boolean` ; `callData`: `string` ; `target`: `string`  }

___

### <a id="call3valuestruct" name="call3valuestruct"></a> Call3ValueStruct

Ƭ **Call3ValueStruct**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowFailure` | `PromiseOrValue`\<`boolean`\> |
| `callData` | `PromiseOrValue`\<`BytesLike`\> |
| `target` | `PromiseOrValue`\<`string`\> |
| `value` | `PromiseOrValue`\<`BigNumberish`\> |

___

### <a id="call3valuestructoutput" name="call3valuestructoutput"></a> Call3ValueStructOutput

Ƭ **Call3ValueStructOutput**: [`string`, `boolean`, `BigNumber`, `string`] & \{ `allowFailure`: `boolean` ; `callData`: `string` ; `target`: `string` ; `value`: `BigNumber`  }

___

### <a id="callstruct" name="callstruct"></a> CallStruct

Ƭ **CallStruct**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `callData` | `PromiseOrValue`\<`BytesLike`\> |
| `target` | `PromiseOrValue`\<`string`\> |

___

### <a id="callstructoutput" name="callstructoutput"></a> CallStructOutput

Ƭ **CallStructOutput**: [`string`, `string`] & \{ `callData`: `string` ; `target`: `string`  }

___

### <a id="resultstruct" name="resultstruct"></a> ResultStruct

Ƭ **ResultStruct**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `returnData` | `PromiseOrValue`\<`BytesLike`\> |
| `success` | `PromiseOrValue`\<`boolean`\> |

___

### <a id="resultstructoutput" name="resultstructoutput"></a> ResultStructOutput

Ƭ **ResultStructOutput**: [`boolean`, `string`] & \{ `returnData`: `string` ; `success`: `boolean`  }
