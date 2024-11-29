// curl https://eth-sepolia.g.alchemy.com/v2/74HhAsHi8ycbxR65odxZaJ03jxQ3sUwZ -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"alchemy_getTokenBalances","params":["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","erc20",{"maxCount": 100}],"id":0}'

require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/74HhAsHi8ycbxR65odxZaJ03jxQ3sUwZ",
      accounts: [
        'ff4bb0077a7023691ee85b6f1b87770438e08e2bfbd0bc27a4c3b311aeab2b77',
      ],
    },
  },
  defaultNetwork:'sepolia',
}

