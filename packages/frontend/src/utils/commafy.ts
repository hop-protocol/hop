import numbro from 'numbro'

export const commafy = (value: string | number | undefined, decimals: number = 2) => {
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
    return numbro(value).format({
      thousandSeparated: true,
      optionalMantissa: true,
      mantissa: decimals,
    })
  } catch (err) {
    return value.toString()
  }
}
