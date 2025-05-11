// SPDX-License-Identifier: UNLICENSED

/**
 * @title Transactions
 * @dev Smart contract for handling cryptocurrency transactions with message support
 * Deployed on Ethereum Sepolia testnet
 */
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Transactions {
    /**
     * @dev Transaction counter to track total number of transactions
     */
    uint256 transactionCount;

    /**
     * @dev Event emitted when a new transaction is added
     * @param from Sender address
     * @param receiver Recipient address
     * @param amount Transaction amount in wei
     * @param message Optional message attached to transaction
     * @param timestamp Block timestamp when transaction was recorded
     * @param keyword Optional keyword for transaction categorization
     */
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
  
    /**
     * @dev Structure to store transaction details
     */
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    /**
     * @dev Array to store all transactions
     */
    TransferStruct[] transactions;

    /**
     * @dev Add a new transaction to the blockchain
     * @param receiver Address of the recipient
     * @param amount Amount of cryptocurrency to send
     * @param message Optional message to include with transaction
     * @param keyword Optional keyword for categorization
     */
    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    /**
     * @dev Retrieve all transactions stored in the contract
     * @return Array of all transactions
     */
    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
