function normalizeNumberInput (value: string | number): string {
  return `${value || ''}`.replace(/[^0-9.]|\.(?=.*\.)/g, '').slice(0, 64)
}

export default normalizeNumberInput
