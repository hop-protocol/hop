/**
 * If the existing property value for a specific migrationProperty matches expectedPropertyValue, update
 * it to migratedPropertyValue.
 */

export interface Migration {
  _note?: string
  migrationProperty: string
  expectedPropertyValue: any
  migratedPropertyValue: any
}

// TODO: Update migrations to allow for arbitrary async logic

export const transfersMigrations: Migration[] = [
  {
    _note: 'Assumes all prior transfers have been finalized since the bonder was unaware of pre-finalized transfers prior to this migration.',
    migrationProperty: 'isFinalized',
    expectedPropertyValue: undefined,
    migratedPropertyValue: true
  }
]

export const transferRootsMigrations: Migration[] = [
  {
    _note: 'Assumes all prior transferRoots have been settled for simplicity.',
    migrationProperty: 'settled',
    expectedPropertyValue: undefined,
    migratedPropertyValue: true
  }
]
