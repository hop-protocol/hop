import numbro from 'numbro'

const commafy = (value: string | number | undefined, decimals: number = 2) => {
  if (value === undefined) {
    return ''
  }
  if (!/[0-9]/gi.test(value.toString())) {
    return value
  }
  if (typeof decimals === 'string') {
    decimals = Number(decimals)
  }
  if (decimals === null) {
    decimals = 2
  }

  return numbro(value).format(`0,0.[${'0'.repeat(decimals)}]`)
}

export default commafy
