export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatNumberWithMaxDecimals = (value: string | number, maxDecimals: number = 5): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  
  const parts = num.toString().split('.')
  if (parts.length === 1) return formatNumber(num) // No decimal part
  
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  // If decimal part is shorter than maxDecimals, return as is
  if (decimalPart.length <= maxDecimals) {
    return formatNumber(num)
  }
  
  // Truncate to maxDecimals and remove trailing zeros
  const truncatedDecimal = decimalPart.slice(0, maxDecimals).replace(/0+$/, '')
  return truncatedDecimal ? `${formatNumber(parseInt(integerPart))}.${truncatedDecimal}` : formatNumber(parseInt(integerPart))
} 