/**
 * TransactionContext.tsx
 * 
 * This file implements the core blockchain interaction functionality using React Context API.
 * It provides wallet connection, transaction handling, and blockchain state management
 * for the entire application.
 */
import React, { useEffect, useState, createContext, useCallback } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { contractABI, contractAddress } from "../utils/constants";

// Add MetaMask type to global window object
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

/**
 * Transaction interface defining the structure of blockchain transactions
 */
interface Transaction {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  amount: number;
}

/**
 * TransactionContextProps interface defining all context values and methods
 */
interface TransactionContextProps {
  transactionCount: string;
  connectWallet: () => void;
  currentAccount: string | null;
  formData: { addressTo: string, amount: string, message: string };
  setFormData: (formData: { addressTo: string, amount: string, message: string }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  sendTransaction: () => void;
  transactions: Transaction[];
  isLoading: boolean;
  
  // New props for multi-account support
  accounts: string[];
  switchAccount: (account: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TransactionContext = createContext({} as TransactionContextProps);

const { ethereum } = window;

const getEthereumContract = async () => {
  if (!ethereum) {
    throw new Error("Ethereum object not found. Make sure you have MetaMask installed.");
  }
  const provider = new ethers.BrowserProvider(ethereum)
  const signer = await provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionContract;
}

interface TransactionProviderProps {
  children: React.ReactNode;
}
export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ addressTo: string, amount: string, message: string }>({ addressTo: '', amount: '', message: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount') || '0');
  const [transactions, setTransactions] = useState([]);
  
  // New state for multiple accounts
  const [accounts, setAccounts] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  }

  const getAllTransactions = useCallback(async () => {
    try {
      if (ethereum) {
        const transactionsContract = await getEthereumContract();
        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction: {
          receiver: string;
          sender: string;
          timestamp: bigint | number;
          message: string;
          amount: { _hex: string } | bigint;
        }) => {
          // Convert timestamp to number
          let timestampNum: number;
          if (typeof transaction.timestamp === 'bigint') {
            timestampNum = Number(transaction.timestamp);
          } else {
            timestampNum = transaction.timestamp;
          }

          // Convert amount to number
          let amountNum: number;
          if (typeof transaction.amount === 'object' && '_hex' in transaction.amount) {
            amountNum = parseInt(transaction.amount._hex) / (10 ** 18);
          } else if (typeof transaction.amount === 'bigint') {
            amountNum = Number(transaction.amount) / (10 ** 18);
          } else {
            amountNum = 0;
          }

          return {
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(timestampNum * 1000).toLocaleString(),
            message: transaction.message,
            amount: amountNum
          };
        });

        console.log("Structured transactions:", structuredTransactions);
        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({ method: "eth_accounts" }) as string[] | undefined;
      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);

      throw new Error("Error connecting to wallet");
    }
  }, [getAllTransactions]); // Add dependencies used inside the callback

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await getEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      console.log("Connecting to wallet...");
      setIsLoading(true);

      if (!ethereum) {
        console.error("MetaMask is not installed");
        alert("Please install MetaMask!");
        return;
      }

      console.log("Requesting accounts...");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      }) as string[];

      console.log("Accounts received:", accounts);

      if (accounts && accounts.length > 0) {
        // Update accounts list with any new accounts
        setAccounts(prevAccounts => {
          // Create a Set from previous accounts to avoid duplicates
          const accountSet = new Set([...prevAccounts]);
          
          // Add all newly connected accounts
          accounts.forEach(account => accountSet.add(account));
          
          // Convert back to array
          return Array.from(accountSet);
        });
        
        // If no current account is set, set the first one
        if (!currentAccount) {
          setCurrentAccount(accounts[0]);
        }
        
        console.log("Wallet connected successfully:", accounts);
        alert("Wallet connected successfully!");
      } else {
        console.error("No accounts found");
        alert("No accounts found! Please create an account in MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error instanceof Error) {
        alert(`Failed to connect wallet: ${error.message}`);
      } else {
        alert("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to switch between accounts
  const switchAccount = (account: string) => {
    if (accounts.includes(account)) {
      setCurrentAccount(account);
      getAllTransactions(); // Refresh transactions for the new account
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");

      const { addressTo, amount, message } = formData;
      const transactionContract = await getEthereumContract();

      const parsedAmount = ethers.parseUnits(amount, "ether");

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208',
          value: parsedAmount.toString(16),
        }]
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();

      console.log(`Success - ${transactionHash.hash}`);

      // Get transaction count and convert it properly
      const transactionCount = await transactionContract.getTransactionCount();
      console.log("Raw transaction count:", transactionCount); // Debug log

      // Handle different possible return types
      let count: string;
      if (typeof transactionCount === 'bigint') {
        count = transactionCount.toString();
      } else if (typeof transactionCount === 'number') {
        count = transactionCount.toString();
      } else if (typeof transactionCount === 'object' && transactionCount !== null) {
        // If it's a BigNumber object from ethers
        count = transactionCount.toString();
      } else {
        count = '0';
      }

      setTransactionCount(count);
      
      // Clear form data after successful transaction
      // This is the key part that needs to be fixed
      setFormData({ 
        addressTo: '', 
        amount: '', 
        message: '' 
      });
      
      // Refresh transactions list
      getAllTransactions();
      
      setIsLoading(false);

      alert(`Transaction sent successfully. Transaction Hash: ${transactionHash.hash}`);

    } catch (error) {
      console.error("Transaction error:", error);
      setIsLoading(false);
      
      // Better error message
      let errorMessage = "Failed to send transaction";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`Transaction failed: ${errorMessage}`);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExists();
  }, [checkIfWalletIsConnected, transactionCount]);

  // Add listener for account changes in MetaMask
  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', (newAccounts: unknown) => {
        const accountsList = newAccounts as string[];
        if (accountsList && accountsList.length > 0) {
          setAccounts(accountsList);
          setCurrentAccount(accountsList[0]);
          getAllTransactions();
        } else {
          setAccounts([]);
          setCurrentAccount(null);
        }
      });
    }

    return () => {
      if (ethereum && ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount: transactionCount || "0",
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        isLoading,
        handleChange,
        sendTransaction,
        transactions,
        accounts,
        switchAccount
      }}>
      {children}
    </TransactionContext.Provider>
  );
}
