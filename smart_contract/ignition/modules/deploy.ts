import { HardhatRuntimeEnvironment } from "hardhat/types";

const main = async (hre: HardhatRuntimeEnvironment) => {
  const transactionsFactory = await hre.ethers.getContractFactory("Transactions");
  const transactionsContract = await transactionsFactory.deploy();

  await transactionsContract.waitForDeployment();

  console.log("Transactions address: ", await transactionsContract.getAddress());
};

const runMain = async () => {
  try {
    await main(require("hardhat"));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();