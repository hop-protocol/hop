import request from 'supertest'
import { app } from '#server/index.js'

describe('Server', () => {
  it('/v1/explorer', async () => {
    const res = await request(app).get('/v1/explorer').send()
    const { events } = res.body
    console.log(events)
    expect(events).toBeTruthy()
  }, 10 * 60 * 1000)
  it('/v1/paths', async () => {
    const res = await request(app).get('/v1/paths').send()
    const { paths } = res.body
    console.log(paths)
    expect(paths).toBeTruthy()
  }, 10 * 60 * 1000)
  it('/v1/tokens', async () => {
    const res = await request(app).get('/v1/tokens').send()
    const { tokens } = res.body
    console.log(tokens)
    expect(tokens).toBeTruthy()
  }, 10 * 60 * 1000)
  it('/v1/prices', async () => {
    const res = await request(app).get('/v1/prices').send()
    const { prices } = res.body
    console.log(prices)
    expect(prices).toBeTruthy()
  }, 10 * 60 * 1000)
})
