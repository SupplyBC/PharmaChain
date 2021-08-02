const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      network_id: "*",
      port: 7545,
    },

    mobile_develop: {
      host: "192.168.1.7",
      network_id: "*",
      port: 7545,
      gas: 6721975,
      gasPrice: 20000000000
      
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
