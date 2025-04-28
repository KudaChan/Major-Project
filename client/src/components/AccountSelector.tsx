import React, { useContext, useState, useRef, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/shortenAddress';

const AccountSelector: React.FC = () => {
  const { accounts, currentAccount, switchAccount, connectWallet } = useContext(TransactionContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddAccount = async () => {
    try {
      await connectWallet();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  // Only render if there's a connected account
  if (!currentAccount) {
    return null;
  }

  // If only one account is connected, show a different UI
  if (accounts.length === 1) {
    return (
      <div className="flex items-center">
        <div className="flex items-center space-x-2 bg-[#2952e3] py-2 px-4 rounded-full text-white mr-2">
          <span>{shortenAddress(currentAccount)}</span>
        </div>
        <button
          onClick={handleAddAccount}
          className="flex items-center space-x-1 bg-[#2546bd] py-2 px-3 rounded-full cursor-pointer hover:bg-[#1e3ba8] text-white"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Add Account</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#2952e3] py-2 px-4 rounded-full cursor-pointer hover:bg-[#2546bd] text-white mr-2"
      >
        <span>{shortenAddress(currentAccount)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#181918] ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {accounts.map((account) => (
              <button
                key={account}
                onClick={() => {
                  switchAccount(account);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  account === currentAccount ? 'bg-[#2952e3] text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
                role="menuitem"
              >
                {shortenAddress(account)}
              </button>
            ))}
            
            {/* Add Account Button */}
            <div className="border-t border-gray-700 my-1"></div>
            <button
              onClick={handleAddAccount}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
              role="menuitem"
            >
              <div className="flex items-center">
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Account
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
