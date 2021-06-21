export interface IOptions {
  snakeCase: boolean
  omitFalsy: boolean
}

const serializeQueryParams = (
  params: any,
  options: Partial<IOptions> = {
    omitFalsy: false
  }
) => {
  const query = []

  if (params instanceof Object) {
    for (let k in params) {
      let value = params[k]
      let keyName = k

      if (options.omitFalsy && !value) {
        continue
      }

      query.push([keyName, value].join('='))
    }
  }

  return query.join('&')
}

export default serializeQueryParams
