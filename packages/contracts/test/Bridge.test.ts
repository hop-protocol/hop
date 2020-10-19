import { ethers } from "@nomiclabs/buidler"
import { Signer } from "ethers"
import { expect } from "chai"

describe("Bridge", function() {
  it("Should return the new greeting once it's changed", async function() {
    const Bridge = await ethers.getContractFactory("Bridge")
    const bridge = await Bridge.deploy()
    
    const resp = await bridge.hello()
    console.log('resp: ', resp)
    expect(resp).to.eq('hello')
  });
});
