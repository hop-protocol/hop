export const contextSqlCreation = `
  _chain_slug VARCHAR,
  _chain_id VARCHAR,
  _transaction_hash VARCHAR,
  _transaction_index INTEGER,
  _log_index INTEGER,
  _block_number INTEGER,
  _block_timestamp INTEGER,
  _from_address VARCHAR,
  _to_address VARCHAR,
  _value VARCHAR,
  _nonce INTEGER,
  _gas_limit INTEGER,
  _gas_used INTEGER,
  _gas_price VARCHAR,
  _data VARCHAR
`

export const contextSqlSelect = `
  _chain_slug AS "chainSlug",
  _chain_id AS "chainId",
  _transaction_hash AS "transactionHash",
  _transaction_index AS "transactionIndex",
  _log_index AS "logIndex",
  _block_number AS "blockNumber",
  _block_timestamp AS "blockTimestamp",
  _from_address AS "fromAddress",
  _to_address AS "toAddress",
  _value AS "value",
  _nonce AS "nonce",
  _gas_limit AS "gasLimit",
  _gas_used AS "gasUsed",
  _gas_price AS "gasPrice",
  _data AS "data"
`

export const contextSqlInsert = `
  _chain_slug,
  _chain_id,
  _transaction_hash,
  _transaction_index,
  _log_index,
  _block_number,
  _block_timestamp,
  _from_address,
  _to_address,
  _value,
  _nonce,
  _gas_limit,
  _gas_used,
  _gas_price,
  _data
`

export function getOrderedInsertContextArgs (context: any) {
  return [
    context?.chainSlug,
    context?.chainId,
    context?.transactionHash,
    context?.transactionIndex,
    context?.logIndex,
    context?.blockNumber,
    context?.blockTimestamp,
    context?.fromAddress,
    context?.toAddress,
    context?.value,
    context?.nonce,
    context?.gasLimit,
    context?.gasUsed,
    context?.gasPrice,
    context?.data
  ]
}

export function getItemsWithContext (items: any[]) {
  return items.map((x: any) => {
    return {
      ...x,
      context: {
        chainSlug: x.chainSlug,
        chainId: x.chainId,
        transactionHash: x.transactionHash,
        transactionIndex: x.transactionIndex,
        logIndex: x.logIndex,
        blockNumber: x.blockNumber,
        blockTimestamp: x.blockTimestamp,
        from: x.fromAddress,
        to: x.toAddress,
        value: x.value,
        nonce: x.nonce,
        gasLimit: x.gasLimit,
        gasUsed: x.gasUsed,
        gasPrice: x.gasPrice,
        data: x.data
      }
    }
  })
}
