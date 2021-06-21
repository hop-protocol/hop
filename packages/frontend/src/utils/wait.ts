const wait = async (t: number) => {
  return new Promise(resolve => setTimeout(() => resolve(null), t))
}

export default wait
