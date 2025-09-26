#  Buy Me a Coffee - Crypto Tipping MiniApp

A modern, feature-rich cryptocurrency tipping application built for Farcaster with real USDC payments on Base blockchain. Features comprehensive wallet integration, WalletConnect support, and a beautiful dark-themed UI.

##  Key Features

###  Real Cryptocurrency Payments
- **USDC Transactions**: Real USDC transfers on Base blockchain (Mainnet & Sepolia)
- **Multi-Network Support**: Automatic network detection and switching
- **Transaction Tracking**: Live transaction status with Basescan integration
- **Copy & Share**: Transaction hash copying and blockchain explorer links

###  Advanced Wallet Integration
- **MetaMask Support**: Native MetaMask integration with injected connector
- **WalletConnect Protocol**: Full WalletConnect v2 support via Reown AppKit
- **WalletKit Integration**: Complete wallet functionality for dApp connections
- **Session Management**: Manage multiple dApp connections simultaneously
- **Multi-Chain Support**: Base Mainnet and Base Sepolia testnet

###  Modern User Experience
- **Responsive Design**: Optimized for mobile and desktop interfaces
- **Dark Theme**: Professional dark mode with glassmorphism effects
- **Real-time Feedback**: Live payment status updates and confirmations
- **Input Validation**: Address validation and amount verification
- **Error Handling**: Comprehensive error states and user feedback

###  Farcaster MiniApp Integration
- **MiniApp SDK**: Full Farcaster MiniApp SDK integration
- **Frame Notifications**: Push notifications for payment updates
- **Webhook Support**: Real-time event handling and notifications
- **Custom Branding**: Splash screen and custom app appearance

##  Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or WalletConnect-compatible wallet
- Base network access (Mainnet or Sepolia testnet)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd Buy-Me-A-Coffee
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   # Required - OnchainKit Configuration
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
   NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="Buy Me a Coffee"
   
   # Required - WalletConnect Integration
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   
   # Required - App Configuration
   NEXT_PUBLIC_URL=https://your-domain.com
   NEXT_PUBLIC_ICON_URL=https://your-domain.com/icon.png
   NEXT_PUBLIC_APP_HERO_IMAGE=https://your-domain.com/hero.png
   NEXT_PUBLIC_SPLASH_IMAGE=https://your-domain.com/splash.png
   NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#0a0b2b
   
   # Optional - Network Configuration
   NEXT_PUBLIC_BASEPAY_TESTNET=false  # Set to true for Sepolia testnet
   
   # Optional - Farcaster Integration
   NEXT_PUBLIC_FARCASTER_DEVELOPER_FID=your_fid
   NEXT_PUBLIC_FARCASTER_DEVELOPER_MNEMONIC=your_mnemonic
   
   # Optional - Redis for Notifications
   REDIS_URL=your_redis_url
   REDIS_TOKEN=your_redis_token
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Architecture

### Core Components

#### Payment System
- **`useUSDCPayment`** (`hooks/use-usdc-payment.ts`): Real USDC payment processing
- **`PaymentStatus`** (`app/components/PaymentStatus.tsx`): Transaction status display
- **`AmountSelector`** (`app/components/AmountSelector.tsx`): Amount input interface
- **`WalletAddressInput`** (`app/components/WalletAddressInput.tsx`): Recipient address input

#### Wallet Integration
- **`WalletConnector`** (`app/components/WalletConnector.tsx`): Wallet connection interface
- **`useWalletKit`** (`hooks/use-walletkit.ts`): WalletConnect functionality
- **`WalletKitManager`** (`app/components/WalletKitManager.tsx`): Full wallet dashboard
- **`WalletIntegrationDemo`** (`app/components/WalletIntegrationDemo.tsx`): Status display

#### Application Structure
- **`page.tsx`**: Main application entry point with MiniApp SDK initialization
- **`providers.tsx`**: Wagmi, React Query, and MiniKit provider configuration
- **`layout.tsx`**: Root layout with theme and metadata configuration

### Payment Flow

1. **Wallet Connection**: User connects MetaMask or WalletConnect wallet
2. **Amount Selection**: Choose preset amounts or enter custom amount
3. **Address Input**: Enter recipient wallet address with validation
4. **Transaction Preparation**: Validate inputs and prepare USDC transfer
5. **Transaction Execution**: Execute real USDC transfer on Base blockchain
6. **Status Tracking**: Monitor transaction through pending → confirming → success
7. **Confirmation**: Display transaction hash and Basescan link

### Network Support

#### Base Mainnet
- **USDC Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **RPC Endpoint**: `https://mainnet.base.org`
- **Explorer**: `https://basescan.org`

#### Base Sepolia (Testnet)
- **USDC Contract**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **RPC Endpoint**: `https://sepolia.base.org`
- **Explorer**: `https://sepolia.basescan.org`

## 🔧 Key Dependencies

### Blockchain & Web3
- **`wagmi`** (^2.12.0): React hooks for Ethereum
- **`viem`** (^2.37.4): TypeScript interface for Ethereum
- **`@coinbase/onchainkit`** (^0.38.0): Coinbase's onchain toolkit
- **`@reown/appkit`** (^1.8.6): WalletConnect AppKit integration
- **`@reown/walletkit`** (^1.2.11): WalletConnect wallet functionality

### Farcaster Integration
- **`@farcaster/miniapp-sdk`** (^0.1.0): Farcaster MiniApp SDK
- **`@base-org/account`** (^2.1.0): Base account management

### UI & Styling
- **`@radix-ui/*`**: Accessible UI components
- **`@heroicons/react`** (^2.2.0): Icon library
- **`lucide-react`** (^0.454.0): Additional icons
- **`tailwindcss`** (^3.4.1): Utility-first CSS framework
- **`next-themes`** (^0.4.6): Theme management

## 🛠️ Development

### Project Structure
```
Buy-Me-A-Coffee/
├── app/
│   ├── components/           # React components
│   │   ├── AmountSelector.tsx
│   │   ├── PaymentStatus.tsx
│   │   ├── WalletConnector.tsx
│   │   ├── WalletKitManager.tsx
│   │   ├── WalletIntegrationDemo.tsx
│   │   ├── WalletAddressInput.tsx
│   │   └── ui/              # Reusable UI components
│   ├── api/                 # API routes
│   │   ├── notify/          # Notification endpoints
│   │   └── webhook/         # Webhook handlers
│   ├── wallet/              # Wallet dashboard page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main application
│   └── providers.tsx        # App providers
├── hooks/                   # Custom React hooks
│   ├── use-usdc-payment.ts  # USDC payment logic
│   ├── use-walletkit.ts     # WalletConnect integration
│   ├── use-toast.ts         # Toast notifications
│   └── use-mobile.ts        # Mobile detection
├── lib/                     # Utility libraries
│   ├── walletkit.ts         # WalletKit service
│   ├── notification.ts      # Notification handling
│   ├── utils.ts             # General utilities
│   └── validation.ts        # Input validation
├── public/                  # Static assets
│   ├── icon.png
│   ├── hero.png
│   ├── splash.png
│   └── logo.png
└── REAL_TRANSACTIONS.md     # Transaction implementation docs
```

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript checking
```

### Testing

#### Testnet Testing (Base Sepolia)
1. Set `NEXT_PUBLIC_BASEPAY_TESTNET=true` in `.env.local`
2. Get Sepolia ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
3. Get Sepolia USDC from [Circle Faucet](https://faucet.circle.com/)
4. Test transactions with small amounts

#### Mainnet Testing (Base)
1. Set `NEXT_PUBLIC_BASEPAY_TESTNET=false` in `.env.local`
2. Ensure sufficient USDC balance in connected wallet
3. Test with small amounts first
4. Verify transactions on [Basescan](https://basescan.org)

## 🚨 Security & Best Practices

### Security Features
- **Address Validation**: Ethereum address format validation
- **Amount Validation**: Positive number validation
- **Network Verification**: Automatic network detection
- **Error Handling**: Comprehensive error states and user feedback
- **Transaction Confirmation**: Multi-step confirmation process

### Best Practices
- Always test on Sepolia testnet first
- Verify recipient addresses before sending
- Start with small amounts for testing
- Monitor transaction status until confirmation
- Keep private keys secure and never share them

## 📱 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push
4. Configure custom domain if needed

### Other Platforms
Compatible with any Next.js hosting platform:
- **Netlify**: Static site generation support
- **Railway**: Full-stack deployment
- **AWS Amplify**: Serverless deployment
- **Self-hosted**: Docker or PM2 deployment

### Environment Variables for Production
Ensure all required environment variables are set:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Coinbase API key
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID
- `NEXT_PUBLIC_URL`: Production domain URL
- `NEXT_PUBLIC_ICON_URL`: App icon URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "feat: add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/updates

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Base Network**: [https://base.org](https://base.org)
- **USDC on Base**: [https://www.centre.io/usdc](https://www.centre.io/usdc)
- **Farcaster**: [https://farcaster.xyz](https://farcaster.xyz)
- **WalletConnect**: [https://walletconnect.com](https://walletconnect.com)
- **Coinbase OnchainKit**: [https://onchainkit.xyz](https://onchainkit.xyz)

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section in `REAL_TRANSACTIONS.md`
- Review the WalletConnect integration guide in `WALLETCONNECT_INTEGRATION.md`