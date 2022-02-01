const chai = require('chai');
const http = require('chai-http');
const app = require('../api/app.js');

const { describe, it } = global;

chai.use(http);
let expect = chai.expect;

describe('GET /_health', () => {
  it('Check health of entire app', (done) => {
    chai
      .request(app)
      .get('/_health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success');
        expect(res.body.success).to.be.true;
        done();
      });
  });
});
