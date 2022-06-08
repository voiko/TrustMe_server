
// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const fs = require("fs");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = 'b0102b041d248cf33b9b3c217d653ad3f5be8e47168c6b95e1fd259a0323ea6b';
const infuraKey = '7cab3dd9453643f7a924e0acddd97d30';

const fs = require('fs');
// const mnemonic = 'maze dynamic dry panther candy reject odor same twenty cable depend table'

module.exports = {

  // ropsten: {
  //   provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
  //   network_id: 3,       // Ropsten's id
  //   gas: 5500000,        // Ropsten has a lower block limit than mainnet
  //   confirmations: 2,    // # of confs to wait between deployments. (default: 0)
  //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
  //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
  //   },
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/7cab3dd9453643f7a924e0acddd97d30`),
      gasPrice: 25000000000,
      network_id: 3, // Match any network id
      confirmations: 2,
      timeoutBlock: 200,
      skipDryRun: true
    },
  },
  //   ,
  //   development: {
  //     host: "127.0.0.1",
  //     port: 7545,
  //     network_id: "*" // Match any network id
  //   }
  // },
  // develop: {
  //   port: 8545
  // },
  compilers: {
    solc: {
      version: "0.6.1"
    },
  },
  
  




  // networks: {
  //   development: {
  //     host: "127.0.0.1",
  //     port: 7545,
  //     network_id: "*" // Match any network id
  //   },
  //   develop: {
  //     port: 8545
  //   }
  // },
  // compilers:{
  //   solc:{
  //     version: "0.6.1"
  //   }
  // }
};
