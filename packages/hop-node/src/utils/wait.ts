async function wait (t: number) {
  return await new Promise(resolve => setTimeout(() => resolve(null), t))
}

export default wait
