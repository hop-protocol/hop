//const ipfsClient = require('ipfs-http-client')
import { ipfsHost } from 'src/config'

class PubSub {
  client: any

  constructor () {
    /*
    this.client = ipfsClient({
      url: ipfsHost,
      pubsub: {
        emitSelf: false
      }
    })
    */
  }

  publish (topic: string, message: any) {
    if (!this.client) return
    if (message instanceof Object) {
      message = JSON.stringify(message)
    }
    return this.client.pubsub.publish(topic, message)
  }

  subscribe (topic: string, cb: any) {
    if (!this.client) return
    return this.client.pubsub.subscribe(topic, (event: any) => {
      const msg = Buffer.from(event.data).toString()
      try {
        cb(JSON.parse(msg))
      } catch (err) {
        cb(msg)
      }
    })
  }
}

export default PubSub
