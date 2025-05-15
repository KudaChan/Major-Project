# BlockPay - Blockchain Payment Application

BlockPay is a decentralized payment application that enables secure, transparent, and efficient cross-border cryptocurrency transactions without the high fees and delays associated with traditional remittance services.

## Project Overview

This project consists of:

1. **Smart Contract (Ethereum)** - A Solidity-based contract deployed on the Sepolia testnet that handles transaction logic
2. **React Frontend** - A modern UI built with React, TypeScript, and Tailwind CSS

## Key Features

- Connect with MetaMask wallet
- Send cryptocurrency globally with low fees
- Record transactions on the blockchain with messages and keywords
- View transaction history
- Bank-grade security with multi-signature support
- Smart exchange rates
- Lightning-fast transfers

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Ethers.js
- Framer Motion
- MetaMask integration

### Smart Contract
- Solidity 0.8.28
- Hardhat development environment
- Deployed on Ethereum Sepolia testnet

## Getting Started

### Prerequisites
- Node.js
- MetaMask browser extension
- Sepolia testnet ETH (for testing)

### Installation

#### Smart Contract Setup
```bash
cd smart_contract
npm install
# Create .env file with ALCHEMY_URL and PRIVATE_KEY
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The application will be available at http://localhost:3000

## Architecture

BlockPay leverages the Ethereum blockchain (Sepolia testnet) using a Proof of Stake consensus mechanism, providing:

- **Direct Peer-to-Peer Interaction**: Enables transactions without trusted third parties
- **Transparency**: All transactions are publicly visible and auditable
- **Immutable Records**: Transaction history cannot be altered
- **Programmable Money**: Smart contracts execute automatically according to predefined rules

## Testing

End-to-end tests are available using Cypress:

```bash
cd client
npx cypress open
```

## Deployment

The frontend can be deployed using the included Nginx configuration:

```bash
cd client
npm run build
# Deploy the dist folder using the nginx.conf configuration
```

## Limitations and Future Improvements

- **Scalability Challenges**: During network congestion, transactions may be slow and expensive
- **MetaMask Dependency**: Currently relies solely on MetaMask wallet
- **Network Limitations**: Built on Ethereum (Sepolia) with its throughput limitations

Potential improvements:
- Layer 2 integration (Optimism, Arbitrum, or zkSync)
- Multi-chain strategy
- Transaction batching
- Gas optimization

## License

[License information]

## Contact

[Your contact information]
