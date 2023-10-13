import rateLimitRetry from 'src/utils/rateLimitRetry'

class Example {
  counter = 0
  triggerRateLimitError= rateLimitRetry(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.counter++
        if (this.counter < 2) {
          reject(new Error('rate limit'))
          return
        }
        resolve(null)
      }, 100)
    })
  })

  triggerRevertError= rateLimitRetry(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.counter++
        reject(new Error(
          'processing response error (body="{"jsonrpc":"2.0","error":{"code":-32016,"message":"The execution failed due to an exception.","data":"Reverted"},"id":695}n", error= { "code": -32016, "data": "Reverted" } , requestBody="{"method":"eth_estimateGas","params":[{"gasPrice":"0x430e23400","from":"0xa6a688f107851131f0e1dce493ebbebfaf99203e","to":"0x25d8039bb044dc227f741a9e381ca4ceae2e6ae8","data":"0x3d12a85a0000000000000000000000007ee5515dd8ca27afad5277ea07d5065034ed6df000000000000000000000000000000000000000000000000000000000001eabde61702a46938da1d8e1ad6aa98df8a7ef77b2bcc5dab6981b5a98798635b7fcfe00000000000000000000000000000000000000000000000000000000000f42bb0000000000000000000000000000000000000000000000000000000000000bc40000000000000000000000000000000000000000000000000000000061730a43"}],"id":695,"jsonrpc":"2.0"}", requestMethod="POST", url="https://xdai.rpc.example.com", code=SERVER_ERROR, version=web/5.4.0)'
        ))
      }, 100)
    })
  })

  triggerCallRevertError= rateLimitRetry(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.counter++
        reject(new Error(
          'missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0xd8781cA9163E9f132A4D8392332E64115688013a","to":"0x553bC791D746767166fA3888432038193cEED5E2","data":"0x98445caf000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000ff","accessList":null}, error={"reason":"processing response error","code":"SERVER_ERROR","body":"{"jsonrpc":"2.0","id":162,"error":{"code":-32000,"message":"invalid opcode: opcode 0xfe not defined"}}","error":{"code":-32000},"requestBody":"{"method":"eth_call","params":[{"from":"0xd8781ca9163e9f132a4d8392332e64115688013a","to":"0x553bc791d746767166fa3888432038193ceed5e2","data":"0x98445caf000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000ff"},"latest"],"id":162,"jsonrpc":"2.0"}","requestMethod":"POST","url":"https://polygon.rpc.example.com/"}, code=CALL_EXCEPTION, version=providers/5.6.8)'
        ))
      }, 100)
    })
  })

  triggerGatewayTimeoutError= rateLimitRetry(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.counter++
        if (this.counter < 2) {
          reject(new Error(
`poll error checkUnsettledTransfers: failed to meet quorum (method="call", params={"transaction":{"from":"0x81682250D4566B2986A2B33e23e7c52D401B7aB7","to":"0x361926fc41109ECAA5c173c31f09dbE4ddBe1946","data":"0x3408e470","accessList":null},"blockTag":"latest"}, results=[{"weight":1,"start":1625577758095,"error":{"reason":"processing response error","code":"SERVER_ERROR","body":"<html>
<head><title>504 Gateway Time-out</title></head>
<body>
<center><h1>504 Gateway Time-out</h1></center>
</body>
</html>
","error":{"reason":"invalid JSON","code":"SERVER_ERROR","body":{"0":60,"1":104,"2":116,"3":109,"4":108,"5":62,"6":13,"7":10,"8":60,"9":104,"10":101,"11":97,"12":100,"13":62,"14":60,"15":116,"16":105,"17":116,"18":108,"19":101,"20":62,"21":53,"22":48,"23":52,"24":32,"25":71,"26":97,"27":116,"28":101,"29":119,"30":97,"31":121,"32":32,"33":84,"34":105,"35":109,"36":101,"37":45,"38":111,"39":117,"40":116,"41":60,"42":47,"43":116,"44":105,"45":116,"46":108,"47":101,"48":62,"49":60,"50":47,"51":104,"52":101,"53":97,"54":100,"55":62,"56":13,"57":10,"58":60,"59":98,"60":111,"61":100,"62":121,"63":62,"64":13,"65":10,"66":60,"67":99,"68":101,"69":110,"70":116,"71":101,"72":114,"73":62,"74":60,"75":104,"76":49,"77":62,"78":53,"79":48,"80":52,"81":32,"82":71,"83":97,"84":116,"85":101,"86":119,"87":97,"88":121,"89":32,"90":84,"91":105,"92":109,"93":101,"94":45,"95":111,"96":117,"97":116,"98":60,"99":47,"100":104,"101":49,"102":62,"103":60,"104":47,"105":99,"106":101,"107":110,"108":116,"109":101,"110":114,"111":62,"112":13,"113":10,"114":60,"115":47,"116":98,"117":111,"118":100,"119":121,"120":62,"121":13,"122":10,"123":60,"124":47,"125":104,"126":116,"127":109,"128":108,"129":62,"130":13,"131":10},"error":{}},"requestBody":"{"method":"eth_call","params":[{"from":"0x81682250d4566b2986a2b33e23e7c52d401b7ab7","to":"0x361926fc41109ecaa5c173c31f09dbe4ddbe1946","data":"0x3408e470"},"latest"],"id":161273,"jsonrpc":"2.0"}","requestMethod":"POST","url":"https://mumbai.rpc.example.com"}},{"weight":1,"start":1625577758845,"error":{"reason":"timeout","code":"TIMEOUT","requestBody":"{"method":"eth_call","params":[{"from":"0x81682250d4566b2986a2b33e23e7c52d401b7ab7","to":"0x361926fc41109ecaa5c173c31f09dbe4ddbe1946","data":"0x3408e470"},"latest"],"id":150928,"jsonrpc":"2.0"}","requestMethod":"POST","timeout":120000,"url":"https://rpc-mumbai.maticvigil.com"}}], provider="[object Object]", code=SERVER_ERROR, version=providers/5.3.1)`
          ))
          return
        }
        resolve(null)
      }, 100)
    })
  })

  triggerBlockHashValidationError = rateLimitRetry(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.counter++
        reject(new Error(
          'BHV:'
        ))
      }, 100)
    })
  })
}

describe('rateLimitRetry', () => {
  it('should retry if rate limit error', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    await example.triggerRateLimitError()
    expect(example.counter).toBe(2)
  }, 60 * 1000)
  it('should retry if gateway timeout error', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    await example.triggerGatewayTimeoutError()
    expect(example.counter).toBe(2)
  }, 60 * 1000)
  it('should not retry', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    let errMsg: string | undefined
    try {
      await example.triggerRevertError()
    } catch (err) {
      errMsg = err.message
    }
    expect(errMsg).toBeTruthy()
    expect(example.counter).toBe(1)
  }, 60 * 1000)
  it('should not retry', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    let errMsg: string | undefined
    try {
      await example.triggerCallRevertError()
    } catch (err) {
      errMsg = err.message
    }
    expect(errMsg).toBeTruthy()
    expect(example.counter).toBe(1)
  }, 60 * 1000)
  it.only('should not retry BlockHashValidationError', async () => {
    const example = new Example()
    expect(example.counter).toBe(0)
    let errMsg: string | undefined
    try {
      await example.triggerBlockHashValidationError()
    } catch (err) {
      errMsg = err.message
    }
    expect(errMsg).toBeTruthy()
    expect(example.counter).toBe(1)
  }, 60 * 1000)
})
