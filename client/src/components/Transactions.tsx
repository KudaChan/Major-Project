/**
 * Transactions.tsx
 * 
 * Component for displaying transaction history.
 * Fetches and renders all blockchain transactions from the smart contract.
 * Provides transaction details including addresses, amounts, and timestamps.
 */
import { useContext, useMemo } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import Loader from "../components/Loader";

/**
 * TransactionsCard component
 * Renders an individual transaction card with details about the transaction
 * 
 * @param addressTo - Recipient address
 * @param addressFrom - Sender address
 * @param timestamp - Transaction timestamp
 * @param message - Optional message included with transaction
 * @param amount - Transaction amount in ETH
 */
const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, amount }: {
  addressTo: string,
  addressFrom: string,
  timestamp: string,
  message: string,
  amount: number
}) => {
  return (
    <div className="bg-[#10101d] p-4 mb-3 rounded-lg hover:shadow-lg transition-all">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[#37c7da] text-sm">{timestamp}</div>
        <div className="text-white font-bold">{amount} ETH</div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">From:</span>
          <a
            href={`https://ropsten.etherscan.io/address/${addressFrom}`}
            target="_blank"
            rel="noreferrer"
            className="text-white text-sm hover:text-[#37c7da]"
          >
            {shortenAddress(addressFrom)}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">To:</span>
          <a
            href={`https://ropsten.etherscan.io/address/${addressTo}`}
            target="_blank"
            rel="noreferrer"
            className="text-white text-sm hover:text-[#37c7da]"
          >
            {shortenAddress(addressTo)}
          </a>
        </div>

        {message && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 text-sm">Message:</span>
            <span className="text-white text-sm">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions = [], currentAccount, isLoading } = useContext(TransactionContext);
  
  // Memoize reversed transactions
  const reversedTransactions = useMemo(() => 
    [...transactions].reverse(), 
    [transactions]
  );
  
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4 max-w-[1200px] w-full">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}

        <div className="mt-10">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {reversedTransactions.map((transaction, i) => {
                const formattedTransaction = {
                  addressTo: transaction.addressTo,
                  addressFrom: transaction.addressFrom,
                  timestamp: transaction.timestamp,
                  message: transaction.message,
                  amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount,
                };

                return <TransactionsCard key={i} {...formattedTransaction} />;
              })}
              
              {transactions.length === 0 && currentAccount && (
                <p className="text-white text-center">No transactions found</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
