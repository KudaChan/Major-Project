/**
 * constants.ts
 * 
 * Contains important constants used throughout the application.
 * Defines the deployed smart contract address and ABI (Application Binary Interface).
 * These values are essential for interacting with the blockchain.
 */
import abi from "./Transactions.json";

/**
 * Address of the deployed smart contract on Sepolia testnet
 */
export const contractAddress = "0x15b08E77748753EDDF716F72642A15b7790C15Ec";

/**
 * ABI (Application Binary Interface) of the smart contract
 * Defines the methods and events available for interaction
 */
export const contractABI = abi.abi;
