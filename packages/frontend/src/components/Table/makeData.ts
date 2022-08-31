const range = len => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

export default function makeData(data, populateDataFn, extraData?: any) {
  const lens = [...[data.length]]

  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d, i) => {
      return {
        ...populateDataFn(data[i], extraData, i),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
