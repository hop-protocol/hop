# Namespace: MockOVM\_CrossDomainMessenger

## Table of contents

### Type Aliases

- [ReceivedMessageStruct](MockOVM_CrossDomainMessenger.md#receivedmessagestruct)
- [ReceivedMessageStructOutput](MockOVM_CrossDomainMessenger.md#receivedmessagestructoutput)

## Type Aliases

### <a id="receivedmessagestruct" name="receivedmessagestruct"></a> ReceivedMessageStruct

Ƭ **ReceivedMessageStruct**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `gasLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `message` | `PromiseOrValue`\<`BytesLike`\> |
| `messageNonce` | `PromiseOrValue`\<`BigNumberish`\> |
| `sender` | `PromiseOrValue`\<`string`\> |
| `target` | `PromiseOrValue`\<`string`\> |
| `timestamp` | `PromiseOrValue`\<`BigNumberish`\> |

___

### <a id="receivedmessagestructoutput" name="receivedmessagestructoutput"></a> ReceivedMessageStructOutput

Ƭ **ReceivedMessageStructOutput**: [`BigNumber`, `string`, `string`, `string`, `BigNumber`, `BigNumber`] & \{ `gasLimit`: `BigNumber` ; `message`: `string` ; `messageNonce`: `BigNumber` ; `sender`: `string` ; `target`: `string` ; `timestamp`: `BigNumber`  }
