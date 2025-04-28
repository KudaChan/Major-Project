import React, { useEffect, useState, createContext, useCallback } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { contractABI, contractAddress } from "../utils/constants";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

interface Transaction {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  keyword: string;
  amount: number;
}

interface TransactionContextProps {
  transactionCount: string;
  connectWallet: () => void;
  currentAccount: string | null;
  formData: { addressTo: string, amount: string, keyword: string, message: string };
  setFormData: (formData: { addressTo: string, amount: string, keyword: string, message: string }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  sendTransaction: () => void;
  transactions: Transaction[];
  isLoading: boolean;
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
  const [formData, setFormData] = useState<{ addressTo: string, amount: string, keyword: string, message: string }>({ addressTo: '', amount: '', keyword: '', message: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount') || '0');
  const [transactions, setTransactions] = useState([]);

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
          keyword: string;
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
            keyword: transaction.keyword,
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
        setCurrentAccount(accounts[0]);
        console.log("Wallet connected successfully:", accounts[0]);
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
  }

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");

      const { addressTo, amount, keyword, message } = formData;
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

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, keyword, message);

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
      setIsLoading(false);

      // Clear form data after successful transaction
      setFormData({ addressTo: '', amount: '', keyword: '', message: '' });

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
        transactions
      }}>
      {children}
    </TransactionContext.Provider>
  );
}
