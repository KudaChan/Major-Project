/**
 * shortenAddress.ts
 * 
 * Utility function to format Ethereum addresses for display.
 * Shortens addresses by showing only the first 5 and last 4 characters.
 * 
 * Example: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e -> 0x742d...f44e
 * 
 * @param address - Full Ethereum address to shorten
 * @returns Shortened address string
 */
export const shortenAddress = (address: string) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
