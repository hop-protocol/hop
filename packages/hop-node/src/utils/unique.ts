import uniqBy from 'lodash/uniqBy'

const unique = (arr: any[] = [], filter?: any) => {
  if (!arr) {
    return []
  }

  const fn = (x: any) => x
  return uniqBy(arr || [], filter || fn)
}

export default unique
