import numeral from 'numeral'

const commafy = (value: string | number | undefined, decimals: number = 2) => {
  if (value === undefined) {
    return ''
  }
  if (typeof decimals === 'string') {
    decimals = Number(decimals)
  }
  if (decimals === null) {
    decimals = 2
  }

  return numeral(value).format(`0,0.[${'0'.repeat(decimals)}]`)
}

export default commafy
