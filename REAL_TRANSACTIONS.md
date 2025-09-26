# Real USDC Transactions Implementation

This document describes the implementation of real USDC transactions on the Base blockchain network.

## Overview

The application now supports real USDC payments using the following technologies:
- **Wagmi** for blockchain interactions
- **Viem** for Ethereum utilities
- **Base Network** (Mainnet and Sepolia testnet)
- **USDC Token** for payments

## Key Features

### 1. Real USDC Payment Hook (`hooks/use-usdc-payment.ts`)

A comprehensive React hook that handles:
- **Multi-network support**: Base Mainnet and Base Sepolia
- **Real USDC transfers**: Using official USDC contract addresses
- **Transaction states**: preparing → pending → confirming → success/error
- **Error handling**: Comprehensive error messages and retry functionality
- **Transaction tracking**: Real transaction hashes and blockchain confirmation

### 2. Updated Payment Flow (`app/page.tsx`)

- Integrated real USDC payment hook
- Real-time transaction status updates
- Professional UI with transaction feedback
- Wallet connection validation
- Amount and address validation

### 3. Enhanced Payment Status (`app/components/PaymentStatus.tsx`)

- **5 distinct states**: preparing, pending, confirming, success, error
- **Blockchain explorer integration**: Direct links to Basescan
- **Transaction hash display**: Copy and view functionality
- **Professional animations**: Loading states and success indicators

## USDC Contract Addresses

```typescript
const USDC_CONTRACTS = {
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet
  [baseSepolia.id]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' // Base Sepolia
}
```

## Transaction Flow

1. **User Input**: Amount and recipient address validation
2. **Preparation**: Hook validates wallet connection and network
3. **Transaction Creation**: USDC transfer transaction is prepared
4. **Wallet Confirmation**: User confirms transaction in wallet
5. **Blockchain Submission**: Transaction is submitted to Base network
6. **Confirmation**: Waiting for blockchain confirmation
7. **Success/Error**: Final status with transaction hash

## Payment States

- `idle`: Ready to accept new payment
- `preparing`: Setting up transaction parameters
- `pending`: Waiting for wallet confirmation
- `confirming`: Transaction submitted, waiting for blockchain confirmation
- `success`: Payment completed successfully
- `error`: Payment failed with error message

## Security Features

- **Address validation**: Ensures valid Ethereum addresses
- **Amount validation**: Prevents invalid payment amounts
- **Network validation**: Ensures USDC is supported on current network
- **Error boundaries**: Comprehensive error handling and user feedback

## Testing

### Testnet Testing (Base Sepolia)
1. Set `NEXT_PUBLIC_TESTNET=true` in `.env`
2. Connect wallet to Base Sepolia network
3. Get testnet USDC from faucets
4. Test payments with small amounts

### Mainnet Usage (Base)
1. Set `NEXT_PUBLIC_TESTNET=false` in `.env`
2. Connect wallet to Base Mainnet
3. Ensure sufficient USDC balance
4. Send real payments

## Environment Configuration

```env
# Network Configuration
NEXT_PUBLIC_TESTNET=true  # Set to false for mainnet

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_DONATION_RECIPIENT=0x...  # Your recipient address
```

## Usage Example

```typescript
import { useUSDCPayment } from '@/hooks/use-usdc-payment'

function PaymentComponent() {
  const { paymentState, sendPayment, resetPayment, txHash } = useUSDCPayment()

  const handlePay = async () => {
    await sendPayment('5.00', '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6')
  }

  return (
    <div>
      <button onClick={handlePay}>Pay $5.00 USDC</button>
      {paymentState.status === 'success' && (
        <p>Payment successful! TX: {txHash}</p>
      )}
    </div>
  )
}
```

## Blockchain Explorer Links

- **Base Mainnet**: https://basescan.org/tx/{txHash}
- **Base Sepolia**: https://sepolia.basescan.org/tx/{txHash}

## Important Notes

⚠️ **This implementation handles real money transactions. Always test thoroughly on testnet before mainnet deployment.**

✅ **Features implemented:**
- Real USDC transfers
- Multi-network support
- Transaction confirmation
- Error handling
- Professional UI/UX

🔒 **Security considerations:**
- Always validate user inputs
- Handle network errors gracefully
- Provide clear transaction feedback
- Never store private keys