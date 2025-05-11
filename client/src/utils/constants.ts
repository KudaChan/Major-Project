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
export const contractAddress = "0x131E5339E3127B2Df20fe04157d4072dCc12F898";

/**
 * ABI (Application Binary Interface) of the smart contract
 * Defines the methods and events available for interaction
 */
export const contractABI = abi.abi;
