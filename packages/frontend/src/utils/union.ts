export const union = (arrays: any[]) => {
  return Array.from(new Set([...arrays].flat()))
}
