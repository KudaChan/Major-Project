import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionContext } from '../../context/TransactionContext';
import Welcome from '../Welcome';

// Mock context values
const mockContextValue = {
  currentAccount: '',
  connectWallet: jest.fn(),
  handleChange: jest.fn(),
  sendTransaction: jest.fn(),
  formData: { addressTo: '', amount: '', message: '', keyword: '' },
  setFormData: jest.fn(),
  isLoading: false,
  transactions: [],
  accounts: []
};

describe('Welcome Component', () => {
  test('renders connect wallet button when not connected', () => {
    render(
      <TransactionContext.Provider value={mockContextValue}>
        <Welcome />
      </TransactionContext.Provider>
    );
    
    const connectButton = screen.getByText(/Connect Wallet/i);
    expect(connectButton).toBeInTheDocument();
    
    fireEvent.click(connectButton);
    expect(mockContextValue.connectWallet).toHaveBeenCalled();
  });
  
  // Additional tests...
});