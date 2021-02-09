const wait = async (t: number) => {
  return new Promise(resolve => setTimeout(() => resolve(), t))
}

export default wait
