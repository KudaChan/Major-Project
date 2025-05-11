import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Transactions", function () {
  async function deployTransactionsFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Transactions = await hre.ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
    
    return { transactions, owner, otherAccount };
  }

  describe("Transaction Recording", function () {
    it("Should record a new transaction", async function () {
      const { transactions, owner, otherAccount } = await loadFixture(deployTransactionsFixture);
      
      await transactions.addToBlockchain(
        otherAccount.address,
        hre.ethers.parseEther("0.001"),
        "Test transaction",
        "test"
      );
      
      const count = await transactions.getTransactionCount();
      expect(count).to.equal(1);
      
      const allTx = await transactions.getAllTransactions();
      expect(allTx.length).to.equal(1);
      expect(allTx[0].sender).to.equal(owner.address);
      expect(allTx[0].receiver).to.equal(otherAccount.address);
      expect(allTx[0].message).to.equal("Test transaction");
    });
    
    // Additional tests...
  });
});