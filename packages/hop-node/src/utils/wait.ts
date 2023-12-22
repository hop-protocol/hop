export async function wait (t: number) {
  return new Promise(resolve => setTimeout(() => resolve(null), t))
}

export default wait
