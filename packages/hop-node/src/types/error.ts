export class BonderFeeTooLowError extends Error {
  constructor (msg = 'bonder fee is too low. Cannot bond withdrawal') {
    super(msg)
  }
}

export class NotEnoughLiquidityError extends Error {
  constructor (msg = 'bonder doesn\'t have enough liquidity to bond transfer') {
    super(msg)
  }
}
