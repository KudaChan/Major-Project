import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/74HhAsHi8ycbxR65odxZaJ03jxQ3sUwZ',
      accounts: ['ff4bb0077a7023691ee85b6f1b87770438e08e2bfbd0bc27a4c3b311aeab2b77']
    }
  }
};

export default config;
