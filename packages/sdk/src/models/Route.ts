import Chain from './Chain'

class Route {
  readonly source: Chain
  readonly destination: Chain

  constructor (source: Chain, destination: Chain) {
    this.source = source
    this.destination = destination
  }
}

export default Route
