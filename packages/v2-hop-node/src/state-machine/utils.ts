export function getFirstState<T>(states: T[]): T {
  return states[0]!
}

export function isFirstState<T>(states: T[], state: T): boolean {
  return states[0] === state
}

export function isLastState<T>(states: T[], state: T): boolean {
  return states[states.length - 1] === state
}
