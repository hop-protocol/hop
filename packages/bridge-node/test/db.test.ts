require('dotenv').config()
import db from 'src/db'

test('db', async () => {
  await db.setItem('foo', 'bar')
  expect(await db.getItem('foo')).toBe('bar')
})
