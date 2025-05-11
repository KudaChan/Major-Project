import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionContext } from '../../context/TransactionContext';
import TransactionForm from '../TransactionForm';

// Mock implementation
jest.mock('../../utils/alerts', () => ({
  showAlert: jest.fn()
}));

describe('TransactionForm', () => {
  test('validates required fields', () => {
    const mockSendTransaction = jest.fn();
    const mockHandleChange = jest.fn();
    
    render(
      <TransactionContext.Provider value={{
        formData: { addressTo: '', amount: '', message: '', keyword: '' },
        handleChange: mockHandleChange,
        sendTransaction: mockSendTransaction,
        isLoading: false
      }}>
        <TransactionForm />
      </TransactionContext.Provider>
    );
    
    const submitButton = screen.getByText(/Send Now/i);
    fireEvent.click(submitButton);
    
    expect(mockSendTransaction).not.toHaveBeenCalled();
    expect(require('../../utils/alerts').showAlert).toHaveBeenCalledWith(
      'Please enter a recipient address'
    );
  });
  
  // Additional validation tests...
});