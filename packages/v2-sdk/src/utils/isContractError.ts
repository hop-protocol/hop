export function isContractError (err: unknown): boolean {
  const errorMsg = typeof err === 'string' ? err : (err instanceof Error ? (err as Error).message : '')
  return (errorMsg.includes('CALL_EXCEPTION') || errorMsg.includes('UNPREDICTABLE_GAS_LIMIT')) && errorMsg.includes('execution reverted')
}
