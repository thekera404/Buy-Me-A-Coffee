# ☕ Buy Me a Coffee - MiniApp

A modern, feature-rich tipping application built for Farcaster with dual cryptocurrency payment support (USDC & ETH) on Base network.

## ✨ Features

### 💰 Dual Payment Support
- **USDC Payments**: Seamless fiat-like experience using Base Pay API
- **ETH Payments**: Direct wallet integration using ethers.js
- **Dynamic Currency Selection**: Users can switch between USDC and ETH instantly

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for mobile and desktop
- **Dark Theme**: Professional dark mode interface
- **Real-time Feedback**: Payment status updates and transaction confirmations
- **Currency-Aware Display**: Dynamic symbols and formatting ($ for USDC, Ξ for ETH)

### 🔧 Technical Features
- **MiniApp Integration**: Full Farcaster MiniApp SDK support
- **Web3 Wallet Support**: MetaMask and other Web3 wallets
- **Base Network**: Native support for Base Mainnet
- **TypeScript**: Fully typed for better development experience
- **Next.js 15**: Built with the latest Next.js features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or Web3 wallet (for ETH payments)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd buy-Me-a-Coffee
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
   NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="Buy Me a Coffee"
   NEXT_PUBLIC_DONATION_RECIPIENT=0x...your_wallet_address
   NEXT_PUBLIC_BASEPAY_TESTNET=false
   NEXT_PUBLIC_URL=https://your-domain.com
   NEXT_PUBLIC_APP_HERO_IMAGE=https://your-domain.com/hero.png
   NEXT_PUBLIC_SPLASH_IMAGE=https://your-domain.com/splash.png
   NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#0a0b2b
   NEXT_PUBLIC_ICON_URL=https://your-domain.com/icon.png
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 💳 Payment Methods

### USDC Payments (Base Pay)
- Integrated with `@base-org/account` 
- Supports fiat-to-crypto conversion
- Email collection for receipts
- Automatic payment status verification

### ETH Payments (Direct Wallet)
- Direct interaction with Web3 wallets
- Native ETH transactions on Base
- Real-time transaction confirmation
- Transaction hash provided for verification

## 🏗️ Architecture

### Core Components
- **`DemoComponents.tsx`**: Main payment interface and logic
- **`providers.tsx`**: MiniKitProvider configuration
- **`page.tsx`**: App entry point with SDK initialization

### Key Dependencies
- `@coinbase/onchainkit`: MiniKit provider and Base Pay integration
- `@farcaster/miniapp-sdk`: Farcaster MiniApp SDK
- `@base-org/account`: Base Pay payment processing
- `ethers`: Ethereum wallet interactions
- `wagmi`: Web3 React hooks and utilities

## 🔧 Configuration

### MiniApp Settings
The app is configured as a Farcaster MiniApp with:
- Splash screen with custom branding
- Auto-initialization with `sdk.actions.ready()`
- Base network integration
- Custom theme and appearance

### Payment Configuration
- **Default Recipient**: Set via `NEXT_PUBLIC_DONATION_RECIPIENT`
- **Network**: Base Mainnet (configurable via `NEXT_PUBLIC_BASEPAY_TESTNET`)
- **Currency Options**: USDC and ETH support

## 🛠️ Development

### Project Structure
```
buy-Me-a-Coffee/
├── app/
│   ├── components/
│   │   ├── DemoComponents.tsx    # Main payment component
│   │   ├── base-pay-button.tsx   # Base Pay button component
│   │   └── ui/                   # UI components (alerts, buttons, etc.)
│   ├── api/                      # API routes for webhooks
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main app component
│   └── providers.tsx             # App providers
├── lib/                          # Utility functions
├── public/                       # Static assets
└── package.json                  # Dependencies
```

### Key Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint checking
```

## 🚨 Troubleshooting

### Common Issues

1. **"Ready not called" Error**
   - ✅ **Fixed**: The app now calls `sdk.actions.ready()` on initialization
   - This prevents the splash screen from persisting

2. **Wallet Connection Issues**
   - Ensure MetaMask or compatible Web3 wallet is installed
   - Check that the wallet is connected to Base network

3. **Payment Failures**
   - Verify recipient address is valid (42 characters, starts with 0x)
   - Ensure sufficient balance for ETH payments
   - Check network connectivity

### Environment Variables
Make sure all required environment variables are set:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Required for MiniKit functionality
- `NEXT_PUBLIC_DONATION_RECIPIENT`: Default recipient wallet address

## 📱 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
The app is a standard Next.js application and can be deployed on:
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "feat(scope): description"`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

### Commit Convention
We use conventional commits:
- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `docs(scope): description` - Documentation updates
- `style(scope): description` - Code style changes
- `refactor(scope): description` - Code refactoring

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Base](https://base.org/) - Ethereum L2 network
- [Farcaster](https://farcaster.xyz/) - Decentralized social protocol
- [OnchainKit](https://onchainkit.xyz/) - Web3 development toolkit
- [ethers.js](https://ethers.org/) - Ethereum library

---

Built with ❤️ for the Farcaster and Base communities