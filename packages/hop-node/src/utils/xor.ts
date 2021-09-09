const xor = (a: number, b: number) => {
  return (a || b) && !(a && b)
}

export default xor
