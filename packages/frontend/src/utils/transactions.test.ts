import { getBlockTagChunks } from '.'

it('should return chunks of 1k blocks', () => {
  const blockNumber = 13648384
  const blockTags = getBlockTagChunks(blockNumber)

  const expected = [
    [13638385, 13639384],
    [13639385, 13640384],
    [13640385, 13641384],
    [13641385, 13642384],
    [13642385, 13643384],
    [13643385, 13644384],
    [13644385, 13645384],
    [13645385, 13646384],
    [13646385, 13647384],
    [13647385, 13648384],
  ]

  expect(blockTags).toEqual(expected)
})
