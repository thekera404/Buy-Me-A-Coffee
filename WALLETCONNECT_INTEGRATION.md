# WalletConnect Integration Guide

This document provides a comprehensive guide for the WalletConnect (Reown WalletKit) integration in the Buy Me A Coffee project.

## Overview

The Buy Me A Coffee app now includes full WalletConnect wallet functionality using the latest Reown WalletKit SDK. This allows the app to act as a Web3 wallet that can connect to any WalletConnect-compatible dApp.

## Features

### Core Wallet Functionality
- **Session Management**: Handle multiple dApp connections simultaneously
- **Transaction Signing**: Support for ETH transactions and smart contract interactions
- **Message Signing**: Personal message and EIP-712 typed data signing
- **Multi-Chain Support**: Base mainnet and testnet networks

### User Interface
- **Wallet Dashboard**: Dedicated interface at `/wallet` for managing connections
- **Status Indicator**: Real-time connection status on the main page
- **Session Details**: View connected dApps and their permissions
- **Pairing Interface**: Easy QR code and URI-based pairing

## Architecture

### Core Components

1. **WalletKitService** (`lib/walletkit.ts`)
   - Singleton service managing WalletKit instance
   - Handles initialization, session management, and request processing
   - Implements event listeners for proposals and requests

2. **useWalletKit Hook** (`hooks/use-walletkit.ts`)
   - React hook providing WalletKit functionality
   - Manages state and provides convenient methods
   - Handles initialization and error states

3. **WalletKitManager Component** (`app/components/WalletKitManager.tsx`)
   - Full-featured wallet management interface
   - Session management and pairing functionality
   - Real-time status updates

4. **WalletIntegrationDemo Component** (`app/components/WalletIntegrationDemo.tsx`)
   - Compact status display for the main page
   - Quick access to wallet features
   - Connection overview

### Dependencies

```json
{
  "@reown/walletkit": "^1.0.0",
  "@walletconnect/core": "^2.17.2",
  "@walletconnect/utils": "^2.17.2"
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @reown/walletkit @walletconnect/core @walletconnect/utils
```

### 2. Get WalletConnect Project ID

1. Visit [Reown Dashboard](https://dashboard.reown.com)
2. Create a new account or sign in
3. Click "Create Project"
4. Select "Wallet (WalletKit)" as the project type
5. Copy your Project ID

### 3. Environment Configuration

Add to your `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 4. Verify Integration

1. Start the development server: `npm run dev`
2. Check the main page for the WalletConnect status indicator
3. Visit `/wallet` to access the full wallet dashboard
4. Test pairing with a dApp using a WalletConnect URI

## Usage

### Basic Integration

The WalletKit is automatically initialized when the app loads. You can use the `useWalletKit` hook in any component:

```typescript
import { useWalletKit } from '@/hooks/use-walletkit'

function MyComponent() {
  const { isInitialized, activeSessions, pair } = useWalletKit()
  
  // Use WalletKit functionality
}
```

### Pairing with dApps

1. Get a WalletConnect URI from a dApp (usually starts with `wc:`)
2. Use the pairing interface in the wallet dashboard
3. Paste the URI and click "Pair"
4. The session will be automatically approved (in demo mode)

### Managing Sessions

- View all active sessions in the wallet dashboard
- See connected dApp details, supported methods, and accounts
- Disconnect sessions individually
- Monitor session expiry times

## Supported Methods

The wallet currently supports these WalletConnect methods:

- `eth_sendTransaction` - Execute transactions
- `personal_sign` - Sign personal messages
- `eth_signTypedData` - Sign typed data (EIP-712)
- `eth_signTypedData_v4` - Sign typed data v4

## Security Considerations

### Demo Implementation Notice

⚠️ **Important**: The current implementation is for demonstration purposes and includes:

- Automatic session approval
- Mock transaction signatures
- Placeholder wallet addresses

### Production Recommendations

For production use, implement:

1. **User Approval Flow**: Show session proposals to users for manual approval
2. **Real Wallet Integration**: Connect to actual wallet providers (MetaMask, etc.)
3. **Transaction Validation**: Verify transaction details before signing
4. **Security Audits**: Conduct thorough security reviews
5. **Error Handling**: Robust error handling and user feedback

## Customization

### Modifying Session Approval

Edit the `approveSession` method in `WalletKitService`:

```typescript
private async approveSession(proposal: any) {
  // Add custom approval logic here
  // Show UI to user, validate requirements, etc.
}
```

### Adding New Methods

Extend the `handleSessionRequest` method to support additional RPC methods:

```typescript
case 'your_custom_method':
  const result = await this.handleCustomMethod(sessionRequest.params)
  // Handle response
  break
```

### Custom UI

The wallet interface is fully customizable. Modify the components in:
- `app/components/WalletKitManager.tsx` - Full dashboard
- `app/components/WalletIntegrationDemo.tsx` - Status indicator

## Troubleshooting

### Common Issues

1. **Project ID Not Found**
   - Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
   - Check the environment variable name and value

2. **Initialization Fails**
   - Check browser console for error messages
   - Verify network connectivity
   - Ensure project ID is valid

3. **Pairing Issues**
   - Verify the WalletConnect URI format
   - Check if the dApp is still waiting for connection
   - Try refreshing both the wallet and dApp

4. **Session Requests Fail**
   - Check if the requested method is supported
   - Verify the session is still active
   - Review the request parameters

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=true
```

## Migration from Web3Wallet

If migrating from the old `@walletconnect/web3wallet` package:

1. Remove old dependencies:
   ```bash
   npm uninstall @walletconnect/web3wallet
   ```

2. Install new dependencies:
   ```bash
   npm install @reown/walletkit @walletconnect/core @walletconnect/utils
   ```

3. Update imports:
   ```typescript
   // Old
   import { Web3Wallet } from '@walletconnect/web3wallet'
   
   // New
   import { WalletKit } from '@reown/walletkit'
   ```

4. Update initialization:
   ```typescript
   // Old
   await Web3Wallet.init()
   
   // New
   await WalletKit.init()
   ```

## Resources

- [Reown Documentation](https://docs.reown.com)
- [WalletKit SDK Reference](https://docs.reown.com/walletkit)
- [WalletConnect Protocol](https://walletconnect.network)
- [Reown Dashboard](https://dashboard.reown.com)

## Support

For issues related to:
- **WalletConnect Integration**: Check the Reown documentation
- **Buy Me A Coffee App**: Review the main README.md
- **General Web3**: Consult the respective blockchain documentation