export function getFirstState<T>(states: T[]): T {
  return states[0]!
}

export function getNextState<T>(states: T[], state: T): T{
  const index = states.indexOf(state)

  // If the state is unknown, the index will be -1
  if (index === -1) {
    throw new Error('Invalid state: state not found in states array')
  }

  // If this is the last state, the next state is not possible
  if (index === states.length) {
    throw new Error('Invalid state: no next state available')
  }

  return states[index + 1]!
}

export function isFirstState<T>(states: T[], state: T): boolean {
  return states[0] === state
}

export function isLastState<T>(states: T[], state: T): boolean {
  return states[states.length - 1] === state
}
