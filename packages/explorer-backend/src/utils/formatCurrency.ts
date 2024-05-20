export function formatCurrency (value: any, token: any) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD'
  })

  if (token === 'MATIC' || token === 'ETH') {
    return Number(value || 0).toFixed(5)
  }

  return `$${currencyFormatter.format(value)}`
}
