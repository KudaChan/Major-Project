import { expect } from "chai";
import hre from "hardhat";

describe("Gas Optimization", function () {
  it("Should use reasonable gas for transaction recording", async function () {
    const Transactions = await hre.ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
    
    const tx = await transactions.addToBlockchain(
      "0x8aa395Ab97837576aF9cd6946C79024ef1acfdbE",
      hre.ethers.parseEther("0.001"),
      "Test transaction",
      "test"
    );
    
    const receipt = await tx.wait();
    const gasUsed = receipt?.gasUsed || 0n;
    
    console.log(`Gas used for transaction: ${gasUsed}`);
    expect(gasUsed).to.be.lessThan(200000n);
  });
});