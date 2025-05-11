import { renderHook, act } from '@testing-library/react-hooks';
import { TransactionProvider, useTransactionContext } from '../TransactionContext';

// Mock ethers.js
jest.mock('ethers', () => ({
  BrowserProvider: jest.fn(() => ({
    getSigner: jest.fn(() => Promise.resolve({
      address: '0xMockedAddress'
    }))
  })),
  Contract: jest.fn(() => ({
    addToBlockchain: jest.fn(() => Promise.resolve({
      wait: jest.fn(() => Promise.resolve())
    })),
    getAllTransactions: jest.fn(() => Promise.resolve([
      {
        sender: '0xSender',
        receiver: '0xReceiver',
        amount: '0.01',
        message: 'Test',
        timestamp: '1625097600',
        keyword: 'test'
      }
    ])),
    getTransactionCount: jest.fn(() => Promise.resolve(1))
  }))
}));

describe('TransactionContext', () => {
  test('loads transactions from blockchain', async () => {
    const wrapper = ({ children }) => (
      <TransactionProvider>{children}</TransactionProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useTransactionContext(), { wrapper });
    
    // Initial state
    expect(result.current.transactions).toEqual([]);
    
    // Trigger transaction loading
    act(() => {
      result.current.loadTransactions();
    });
    
    await waitForNextUpdate();
    
    // Verify transactions loaded
    expect(result.current.transactions.length).toBe(1);
    expect(result.current.transactions[0].addressFrom).toBe('0xSender');
  });
  
  // Additional integration tests...
});