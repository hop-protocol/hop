/**
 * If an key matches value, update it to migratedValue
 */

export interface Migration {
  _note?: string
  key: string
  value: any
  migratedValue: any
}

// TODO: Update migrations to allow for arbitrary async logic

export const transfersMigrations: Migration[] = [
  {
    _note: 'Assumes all prior transfers have been finalized since the bonder was unaware of pre-finalized transfers prior to this migration.',
    key: 'isFinalized',
    value: undefined,
    migratedValue: true
  }
]

export const transferRootsMigrations: Migration[] = [
  {
    _note: 'Assumes all prior transferRoots have been settled for simplicity.',
    key: 'settled',
    value: undefined,
    migratedValue: true
  }
]
