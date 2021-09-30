type Numberish = number | string

class Price {
  readonly base: number
  readonly quote: number

  constructor(base: Numberish, quote: Numberish) {
    this.base = Number(base)
    this.quote = Number(quote)
  }

  price() {
    return this.base / this.quote
  }

  toFixed(precision: number = 2) {
    return this.price().toFixed(precision)
  }

  toString() {
    return this.price().toString()
  }

  inverted() {
    return new Price(this.quote, this.base)
  }
}

export default Price
