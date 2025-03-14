FROM node:20-alpine

WORKDIR /usr/src/app/smart_contract

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port for Hardhat Network
EXPOSE 8545

# Command to run Hardhat node
CMD ["npx", "hardhat", "node"]