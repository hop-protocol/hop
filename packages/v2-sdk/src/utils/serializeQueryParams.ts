interface IOptions {
  snakeCase: boolean
  omitFalsy: boolean
}

export const serializeQueryParams = (
  params: any,
  options: Partial<IOptions> = {
    omitFalsy: false
  }
) => {
  const query = []

  if (params instanceof Object) {
    for (const k in params) {
      const value = params[k]
      const keyName = k

      if (options.omitFalsy && !value) {
        continue
      }

      query.push([keyName, value].join('='))
    }
  }

  return query.join('&')
}
