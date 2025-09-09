'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { validateDonationAmount, validateWalletAddress, validateEmail } from '../../lib/validation';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

// Enhanced error types for better error handling
interface PaymentError {
  code: string;
  message: string;
  userMessage: string;
}

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  txHash: string | null;
}

export default function DemoComponents() {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'USDC' | 'ETH'>('USDC');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    success: false,
    txHash: null
  });

  // Enhanced error handling with specific user messages
  const getErrorMessage = useCallback((error: any): string => {
    if (error?.code === 'INSUFFICIENT_FUNDS') {
      return 'Insufficient funds in your wallet. Please add more funds and try again.';
    }
    if (error?.code === 'USER_REJECTED') {
      return 'Transaction was cancelled. Please try again if you want to complete the payment.';
    }
    if (error?.code === 'NETWORK_ERROR') {
      return 'Network connection error. Please check your internet connection and try again.';
    }
    if (error?.message?.includes('gas')) {
      return 'Transaction fee too high. Please try again later when network is less congested.';
    }
    return 'Payment failed. Please check your wallet connection and try again.';
  }, []);

  // Improved validation with real-time feedback
  const validateForm = useCallback((): string | null => {
    const amountValidation = validateDonationAmount(amount);
    if (!amountValidation.isValid) {
      return amountValidation.error!;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return emailValidation.error!;
    }

    if (!process.env.NEXT_PUBLIC_DONATION_RECIPIENT) {
      return 'Donation recipient not configured. Please contact support.';
    }

    const addressValidation = validateWalletAddress(process.env.NEXT_PUBLIC_DONATION_RECIPIENT);
    if (!addressValidation.isValid) {
      return 'Invalid recipient address configuration. Please contact support.';
    }

    return null;
  }, [amount, email]);

  // Enhanced ETH payment with better error handling
  const handleETHPayment = useCallback(async () => {
    try {
      setPaymentState({ isLoading: true, error: null, success: false, txHash: null });

      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length === 0) {
        throw new Error('No wallet accounts found. Please connect your wallet.');
      }

      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      
      // Verify we're on Base network
      if (network.chainId !== 8453) { // Base Mainnet chain ID
        throw new Error('Please switch to Base network in your wallet.');
      }

      // Get gas price and estimate
      const gasPrice = await provider.getGasPrice();
      const gasLimit = 21000; // Standard ETH transfer gas limit
      
      const transaction = {
        to: process.env.NEXT_PUBLIC_DONATION_RECIPIENT,
        value: ethers.utils.parseEther(amount),
        gasLimit,
        gasPrice
      };

      // Send transaction
      const tx = await signer.sendTransaction(transaction);
      
      setPaymentState({ 
        isLoading: true, 
        error: null, 
        success: false, 
        txHash: tx.hash 
      });

      // Wait for confirmation
      const receipt = await tx.wait(1);
      
      setPaymentState({ 
        isLoading: false, 
        error: null, 
        success: true, 
        txHash: receipt.transactionHash 
      });

      // Reset form after successful payment
      setAmount('');
      setMessage('');
      setEmail('');

    } catch (error: any) {
      console.error('ETH Payment Error:', error);
      setPaymentState({ 
        isLoading: false, 
        error: getErrorMessage(error), 
        success: false, 
        txHash: null 
      });
    }
  }, [amount, getErrorMessage]);

  // Enhanced USDC payment with better error handling
  const handleUSDCPayment = useCallback(async () => {
    try {
      setPaymentState({ isLoading: true, error: null, success: false, txHash: null });

      // Implement Base Pay USDC payment logic here
      // This is a placeholder for the actual Base Pay integration
      console.log('Processing USDC payment...', {
        amount,
        recipient: process.env.NEXT_PUBLIC_DONATION_RECIPIENT,
        email,
        message
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentState({ 
        isLoading: false, 
        error: null, 
        success: true, 
        txHash: 'usdc-payment-success' 
      });

      // Reset form
      setAmount('');
      setMessage('');
      setEmail('');

    } catch (error: any) {
      console.error('USDC Payment Error:', error);
      setPaymentState({ 
        isLoading: false, 
        error: getErrorMessage(error), 
        success: false, 
        txHash: null 
      });
    }
  }, [amount, email, message, getErrorMessage]);

  const handlePayment = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setPaymentState({ 
        isLoading: false, 
        error: validationError, 
        success: false, 
        txHash: null 
      });
      return;
    }

    if (currency === 'ETH') {
      await handleETHPayment();
    } else {
      await handleUSDCPayment();
    }
  }, [currency, validateForm, handleETHPayment, handleUSDCPayment]);

  // Real-time amount validation
  const amountError = amount ? validateDonationAmount(amount).error : null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        ☕ Buy Me a Coffee
      </h2>

      {/* Amount Input with Validation */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Amount ({currency === 'USDC' ? '$' : 'Ξ'})
        </label>
        <input
          id="amount"
          type="number"
          step="0.000001"
          min="0"
          max="10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
            amountError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder={`Enter amount in ${currency}`}
          aria-describedby={amountError ? "amount-error" : undefined}
          disabled={paymentState.isLoading}
        />
        {amountError && (
          <p id="amount-error" className="mt-1 text-sm text-red-600" role="alert">
            {amountError}
          </p>
        )}
      </div>

      {/* Currency Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Payment Method
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency('USDC')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              currency === 'USDC'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
            }`}
            disabled={paymentState.isLoading}
          >
            💵 USDC
          </button>
          <button
            onClick={() => setCurrency('ETH')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              currency === 'ETH'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
            }`}
            disabled={paymentState.isLoading}
          >
            ⟠ ETH
          </button>
        </div>
      </div>

      {/* Optional Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Email (optional, for receipt)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="your@email.com"
          disabled={paymentState.isLoading}
        />
      </div>

      {/* Optional Message */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Message (optional)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
          placeholder="Say something nice..."
          maxLength={200}
          disabled={paymentState.isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          {message.length}/200 characters
        </p>
      </div>

      {/* Error Display */}
      {paymentState.error && (
        <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertDescription className="text-red-800 dark:text-red-200">
            {paymentState.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Display */}
      {paymentState.success && (
        <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <AlertDescription className="text-green-800 dark:text-green-200">
            🎉 Payment successful! Thank you for your support!
            {paymentState.txHash && paymentState.txHash !== 'usdc-payment-success' && (
              <div className="mt-2">
                <a
                  href={`https://basescan.org/tx/${paymentState.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View transaction on BaseScan
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={paymentState.isLoading || !amount || !!amountError}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Send ${amount} ${currency} as a tip`}
      >
        {paymentState.isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            Processing...
          </div>
        ) : (
          `☕ Send ${amount ? `${amount} ${currency}` : `${currency}`}`
        )}
      </Button>

      {paymentState.txHash && paymentState.isLoading && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
          Transaction submitted. Waiting for confirmation...
        </p>
      )}
    </div>
  );
}