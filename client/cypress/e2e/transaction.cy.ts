describe('Transaction Flow', () => {
  before(() => {
    // Setup MetaMask with test account
    cy.setupMetaMask();
    cy.connectMetaMaskWallet();
  });

  it('should complete a transaction end-to-end', () => {
    // Visit application
    cy.visit('/');
    
    // Verify wallet connected
    cy.get('[data-testid="account-address"]').should('be.visible');
    
    // Fill transaction form
    cy.get('[data-testid="address-input"]').type('0x8aa395Ab97837576aF9cd6946C79024ef1acfdbE');
    cy.get('[data-testid="amount-input"]').type('0.001');
    cy.get('[data-testid="message-input"]').type('E2E Test Transaction');
    cy.get('[data-testid="keyword-input"]').type('test');
    
    // Submit transaction
    cy.get('[data-testid="send-button"]').click();
    
    // Confirm in MetaMask
    cy.confirmMetaMaskTransaction();
    
    // Verify success state
    cy.get('[data-testid="transaction-success"]').should('be.visible');
    
    // Verify transaction appears in history
    cy.get('[data-testid="transaction-list"]')
      .contains('E2E Test Transaction')
      .should('be.visible');
  });
});