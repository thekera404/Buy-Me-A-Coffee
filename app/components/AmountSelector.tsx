'use client'

interface AmountSelectorProps {
  selectedAmount: number | null
  customAmount: string
  onAmountSelect: (amount: number | null) => void
  onCustomAmountChange: (amount: string) => void
}

const PRESET_AMOUNTS = [1, 3, 5]

export function AmountSelector({
  selectedAmount,
  customAmount,
  onAmountSelect,
  onCustomAmountChange
}: AmountSelectorProps) {
  const handlePresetClick = (amount: number) => {
    if (selectedAmount === amount) {
      onAmountSelect(null)
    } else {
      onAmountSelect(amount)
      onCustomAmountChange('')
    }
  }

  const handleCustomAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '')
    
    // Prevent multiple decimal points
    const parts = sanitized.split('.')
    if (parts.length > 2) {
      return
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return
    }
    
    onCustomAmountChange(sanitized)
    onAmountSelect(null)
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white" id="amount-selector-label">Select Amount</h3>
      
      {/* Preset Amount Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {PRESET_AMOUNTS.map((amount) => {
          const isSelected = selectedAmount === amount
          return (
            <button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              aria-pressed={isSelected}
              aria-label={`Tip $${amount} USDC`}
              className={`h-12 rounded-lg font-semibold transition-all duration-200 touch-manipulation ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border-2 border-blue-500'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-2 border-gray-600/50'
              }`}
            >
              ${amount}
            </button>
          )
        })}
      </div>
      
      {/* Custom Amount Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
          $
        </div>
        <label htmlFor="custom-amount" className="sr-only">Custom amount</label>
        <input
          type="text"
          value={customAmount}
          onChange={(e) => handleCustomAmountChange(e.target.value)}
          placeholder="Custom amount"
          id="custom-amount"
          inputMode="decimal"
          aria-labelledby="amount-selector-label"
          aria-describedby="custom-amount-help"
          pattern="^\\d+(\\.\\d{1,2})?$"
          className={`w-full h-12 pl-8 pr-4 bg-gray-700/50 border-2 rounded-lg text-white placeholder-gray-400 font-medium transition-all duration-200 focus:outline-none ${
            customAmount
              ? 'border-blue-500 bg-gray-700/70'
              : 'border-gray-600/50 focus:border-blue-500'
          }`}
        />
      </div>
      
      {/* Amount Display */}
      {(selectedAmount || parseFloat(customAmount)) && (
        <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg" id="custom-amount-help">
          <p className="text-blue-300 text-sm font-medium" role="status" aria-live="polite">
            Selected: ${(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)} USDC
          </p>
        </div>
      )}
    </div>
  )
}