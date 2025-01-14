import { v4 as uuid } from 'uuid'

export const eventContextIdCreationSql = `
  event_context_id TEXT NOT NULL,
  FOREIGN KEY (event_context_id) REFERENCES event_context(id)
`

export const selectEventContextSql = `
  ec.chain_id AS "context.chainId",
  ec.transaction_hash AS "context.transactionHash",
  ec.transaction_index AS "context.transactionIndex",
  ec.log_index AS "context.logIndex",
  ec.block_number AS "context.blockNumber",
  ec.block_timestamp AS "context.blockTimestamp",
  ec.from_address AS "context.fromAddress",
  ec.to_address AS "context.toAddress",
  ec.value AS "context.value",
  ec.nonce AS "context.nonce",
  ec.gas_limit AS "context.gasLimit",
  ec.gas_used AS "context.gasUsed",
  ec.gas_price AS "context.gasPrice",
  ec.status AS "context.status",
  ec.data AS "context.data",
  ec.data_decoded AS "context.dataDecoded"
`

export function getItemsWithContext (items: any[]) {
  return items.map((x: any) => {
    // Destructure and collect the context properties into the context object
    const context = {
      chainId: x['context.chainId'],
      transactionHash: x['context.transactionHash'],
      transactionIndex: x['context.transactionIndex'],
      logIndex: x['context.logIndex'],
      blockNumber: x['context.blockNumber'],
      blockTimestamp: x['context.blockTimestamp'],
      from: x['context.fromAddress'],
      to: x['context.toAddress'],
      value: Math.round(x['context.value']).toString(), // TODO: remove Math.round and toString
      nonce: x['context.nonce'],
      gasLimit: x['context.gasLimit'],
      gasUsed: x['context.gasUsed'],
      gasPrice: Math.round(x['context.gasPrice']).toString(), // TODO: remove Math.round and toString
      status: x['context.status'],
      data: x['context.data'],
      dataDecoded: x['context.dataDecoded'],
    }

    // Omit the properties that begin with 'context' from x
    const filteredResult = Object.keys(x).reduce((acc, key) => {
      if (!key.startsWith('context')) {
        acc[key] = x[key]
      }
      return acc
    }, {} as Record<string, any>)

    // Add the context object to the filtered result
    const result = {
      ...filteredResult,
      context
    }

    return result
  })
}

export function getInsertEventContextSqlData (context: any) {
  const contextId = uuid()
  const insertEventContextArgs = {
    id: contextId,
    chainId: context.chainId,
    transactionHash: context.transactionHash,
    transactionIndex: context.transactionIndex,
    logIndex: context.logIndex,
    blockNumber: context.blockNumber,
    blockTimestamp: context.blockTimestamp,
    from: context.from,
    to: context.to,
    value: context.value,
    nonce: context.nonce,
    gasLimit: context.gasLimit,
    gasUsed: context.gasUsed,
    gasPrice: context.gasPrice,
    status: context.status,
    data: context.data,
    dataDecoded: context.dataDecoded,
  }

  const insertEventContextSql = `
    INSERT INTO event_context (
      id, chain_id, transaction_hash, transaction_index, log_index, block_number, block_timestamp, from_address, to_address, value, nonce, gas_limit, gas_used, gas_price, status, data, data_decoded
    )
    VALUES ${'(${id}, ${chainId}, ${transactionHash}, ${transactionIndex}, ${logIndex}, ${blockNumber}, ${blockTimestamp}, ${from}, ${to}, ${value}, ${nonce}, ${gasLimit}, ${gasUsed}, ${gasPrice}, ${status}, ${data}, ${dataDecoded})'}
    ON CONFLICT (chain_id, transaction_hash, log_index)
    ${'DO UPDATE SET log_index = ${logIndex}, chain_id = ${chainId}'}
  `

  return {
    contextId,
    insertEventContextArgs,
    insertEventContextSql
  }
}
