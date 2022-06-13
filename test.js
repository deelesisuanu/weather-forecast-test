const server = require('./server');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);

describe('Cities Endpoints', () => {

  it('GET /cities should show all cities', async () => {
    // setTimeout(async ()=> {
      const res = await requestWithSupertest.get('/api/v1/route/cities');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
    // }, 2500);
  });

});