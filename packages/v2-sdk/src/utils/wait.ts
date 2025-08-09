export const wait = async (t: number): Promise<unknown> => {
  return new Promise(resolve => setTimeout(() => resolve(null), t))
}
