import request from 'supertest'
import { app } from '../src/server'

describe('Server', () => {
  it('/v1/explorer', async () => {
    const res = await request(app).get('/v1/explorer2').send()
    const { events } = res.body
    console.log(events)
    expect(events).toBeTruthy()
  }, 10 * 60 * 1000)
})
