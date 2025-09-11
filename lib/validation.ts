export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateDonationAmount(amount: string | number): ValidationResult {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 10000) {
    return { isValid: false, error: 'Amount cannot exceed 10,000' };
  }
  
  // Check for reasonable decimal places
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 6) {
    return { isValid: false, error: 'Too many decimal places (max 6)' };
  }
  
  return { isValid: true };
}

export function validateWalletAddress(address: string): ValidationResult {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  
  if (!address) {
    return { isValid: false, error: 'Wallet address is required' };
  }
  
  if (!ethAddressRegex.test(address)) {
    return { isValid: false, error: 'Invalid Ethereum wallet address format' };
  }
  
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: true }; // Email is optional
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}