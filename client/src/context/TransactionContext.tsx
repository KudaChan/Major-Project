import React, { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider} from "@metamask/providers";
import { contractABI, contractAddress } from "../utils/constants";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

interface TransactionContextProps {
  connectWallet: () => void;
  currentAccount: string | null;
  formData: { addressTo: string, amount: string, keyword: string, message: string };
  setFormData: (formData: { addressTo: string, amount: string, keyword: string, message: string }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  sendTransaction: () => void;
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
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState) => ({...prevState, [name]: e.target.value}));
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({ method: "eth_accounts" }) as string[] | undefined;
      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);

      throw new Error("Error connecting to wallet");
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);

      throw new Error("Error connecting to wallet");
    }
  }

  const sendTransaction = async () => { 
    try {
      if (!ethereum) return alert("Please install MetaMask!");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.parseUnits(amount, "ether");

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208',
          value: parsedAmount.toString(16),
        }]
      })

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, keyword, message);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      alert(`Transaction sent successfully. Transaction Hash: ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.tonumber());

    } catch (error) {
      console.log(error);

      throw new Error("Error connecting to wallet");
    }
  }

  useEffect(() =>{
    checkIfWalletIsConnected();
  }, []);
  return (
    <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
      {children}
    </TransactionContext.Provider>
  );
}
