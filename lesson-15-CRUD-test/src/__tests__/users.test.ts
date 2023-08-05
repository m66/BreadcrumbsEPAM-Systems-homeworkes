import request from 'supertest'
import { app } from '../server'
import { createConnection } from 'typeorm'

describe('MyApp API tests', () => {
  beforeAll(() => {
    createConnection()
  })


  it('GET /users --> array users', () => {
    return request(app).get('/users')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
    // .then((response) => {
    //   expect(response.body).toEqual(
    //     expect.arrayContaining([
    //       expect.objectContaining({
    //         user_id: expect.any(Number),
    //         name: expect.any(String),
    //         age: expect.any(Number),
    //         gender: 'male',
    //         status: false,
    //         creationtimestamp: '2023-08-03T15:33:20.038Z',
    //         modificationtimestamp: null,
    //       }),
    //     ]),
    //   )
    // })
  })

  //   it('GET /users/id --> array users', () => {
  // return request(app)
  //   .get('/users/49d4a451-7815-4690-bcda-9d57713af6e6')
  //   .expect('Content-Type', /json/)
  //   .expect(200)
  //   .then((response) => {
  //     expect(response.body).toEqual(
  //       expect.objectContaining({
  //         user_id: expect.any(Number),
  //         name: expect.any(String),
  //         age: expect.any(Number),
  //         gender: 'male',
  //         status: false,
  //         creationtimestamp: '2023-08-03T15:33:20.038Z',
  //         modificationtimestamp: null,
  //       }),
  //     )
  //   })
  //   })
})
