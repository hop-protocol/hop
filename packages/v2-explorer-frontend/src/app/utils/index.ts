/**
 * Format a date to a readable string
 * @param date Date to format
 * @returns Formatted date string in format: "Jan 1, 2023 12:00 PM"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Format a number with commas
 * @param value Number to format
 * @returns Formatted number string with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format an amount to a readable string with appropriate precision
 * @param amount Amount to format
 * @param decimals Number of decimals to show (default: 2)
 * @returns Formatted amount string
 */
export function formatAmount(amount: number, decimals: number = 2): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

/**
 * Truncate a string (e.g., addresses) with ellipsis in the middle
 * @param str String to truncate
 * @param startChars Number of characters to keep at the start
 * @param endChars Number of characters to keep at the end
 * @returns Truncated string
 */
export function truncateMiddle(str: string, startChars: number = 6, endChars: number = 4): string {
  if (!str) return '';
  if (str.length <= startChars + endChars) return str;
  
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
} 