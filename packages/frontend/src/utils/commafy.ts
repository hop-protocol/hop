import numbro from 'numbro'

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

  try {
    return numbro(value).format(`0,0.[${'0'.repeat(decimals)}]`)
  } catch (err) {
    return value
  }
}

export default commafy
