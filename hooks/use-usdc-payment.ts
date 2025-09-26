import React, { useState, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { base, baseSepolia } from 'wagmi/chains'

// USDC Contract addresses
const USDC_CONTRACTS = {
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet USDC
  [baseSepolia.id]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' // Base Sepolia USDC
}

// USDC ABI for transfer function
const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  }
] as const

export interface PaymentState {
  status: 'idle' | 'preparing' | 'pending' | 'confirming' | 'success' | 'error'
  txHash?: string
  error?: string
  amount?: string
  recipient?: string
}

export function useUSDCPayment() {
  const { address, chainId } = useAccount()
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle' })

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const sendPayment = useCallback(async (amount: string, recipientAddress: string) => {
    if (!address || !chainId) {
      setPaymentState({
        status: 'error',
        error: 'Wallet not connected'
      })
      return
    }

    const usdcAddress = USDC_CONTRACTS[chainId as keyof typeof USDC_CONTRACTS]
    if (!usdcAddress) {
      setPaymentState({
        status: 'error',
        error: 'USDC not supported on this network'
      })
      return
    }

    try {
      setPaymentState({
        status: 'preparing',
        amount,
        recipient: recipientAddress
      })

      // Convert amount to USDC units (6 decimals)
      const amountInWei = parseUnits(amount, 6)

      // Execute the transaction
      writeContract({
        address: usdcAddress as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amountInWei],
      })

      setPaymentState(prev => ({
        ...prev,
        status: 'pending'
      }))

    } catch (error) {
      console.error('Payment error:', error)
      setPaymentState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Transaction failed'
      })
    }
  }, [address, chainId, writeContract])

  const resetPayment = useCallback(() => {
    setPaymentState({ status: 'idle' })
  }, [])

  // Update payment state based on transaction status
  React.useEffect(() => {
    if (hash && paymentState.status === 'pending') {
      setPaymentState(prev => ({
        ...prev,
        status: 'confirming',
        txHash: hash
      }))
    }
  }, [hash, paymentState.status])

  React.useEffect(() => {
    if (isConfirmed && paymentState.status === 'confirming') {
      setPaymentState(prev => ({
        ...prev,
        status: 'success'
      }))
    }
  }, [isConfirmed, paymentState.status])

  React.useEffect(() => {
    if (writeError && paymentState.status !== 'error') {
      setPaymentState({
        status: 'error',
        error: writeError.message
      })
    }
  }, [writeError, paymentState.status])

  return {
    paymentState,
    sendPayment,
    resetPayment,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    txHash: hash,
    error: writeError?.message || paymentState.error
  }
}