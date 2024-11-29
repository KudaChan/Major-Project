const main = async () => {
  const hre = require("hardhat");
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  if (!transactions) {
    console.error("Contract deployment failed");
    return;
  }

  // await transactions.deployed();

  console.log("Transactions address: ", transactions.runner.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();