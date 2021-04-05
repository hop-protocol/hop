import Hop from 'src/Hop'
import pkg from '../package.json'

test('sdk', () => {
  const hop = new Hop()
  expect(hop.version).toBe(pkg.version)
})
