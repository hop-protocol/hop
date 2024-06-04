export function getFirstState<T>(states: T[]): T {
  return states[0]
}

export function getNextState<T>(states: T[], state: T): T | null {
  const index = states.indexOf(state)

  // If the state is unknown, the index will be -1
  if (index === -1) {
    throw new Error('Invalid state')
  }

  // If this is the last state, the next state is null
  if (index + 1 === states.length) {
    return null
  }

  return states[index + 1]
}
