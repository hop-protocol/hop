import "@nomiclabs/hardhat-waffle"

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    }
  },
  solidity: {
    compilers: [
      {
        version:"0.6.12"
      },
      {
        version:"0.6.6"
      },
      {
        version:"0.5.16"
      },
      {
        version:"0.5.11"
      },
      {
        version:"0.4.25"
      }
    ]
  }
}
