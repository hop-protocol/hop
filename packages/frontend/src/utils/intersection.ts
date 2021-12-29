export const intersection = (arrays: any[]) => {
  return arrays.reduce((a, b) => b.filter(Set.prototype.has, new Set(a)))
}
