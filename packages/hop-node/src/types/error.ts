const defaultMsg = 'bonder fee is too low. Cannot bond withdrawal'

export class BonderFeeTooLowError extends Error {
  constructor (msg = defaultMsg) {
    super(msg)
  }
}
