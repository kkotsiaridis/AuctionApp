const path = require("path");

const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonicPhrase = "burden silver electric today remind loyal garbage open host member item roof";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      port: 8545,
      gasPrice: 1,
      network_id: "*",
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: "https://ropsten.infura.io/v3/f25b73afa1514f2ba6e60c2c2d8867c8",
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/"
        }),
      network_id: '3',
    }
  },
  compilers: {
    solc: {
       version: "0.8.3",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
