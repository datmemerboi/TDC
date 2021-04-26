const chai = require('chai');
const http = require('chai-http');
const app = require('../api/app.js');
const dbUtils = require('../api/utils/db-utils');

chai.use(http);
let expect = chai.expect;

describe("Patient test cases", () => {
  before(async function () {
    const db = await dbUtils.connect();
    await db.Patient.deleteMany({});
  });
  after(async function () {
    await dbUtils.close();
  });
  describe("POST /api/patient/new", () => {
    it("Create a new patient", (done) => {
      let patientObj = {
        name: "Arjun",
        age: 29,
        gender: "M",
        contact: 9000090000,
        area: "CIT Nagar",
        address: "10, CIT Nagar 1st street, Chennai",
        med_history: [],
        current_meds: [ "Paracetamol", "Aspirin" ]
      };
      chai.request(app)
        .post('/api/patient/new')
        .send(patientObj)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("p_id");
          done();
        });
    });
  });
  describe("GET /api/patient/all", () => {
    it("List all patients", (done) => {
      chai.request(app)
        .get('/api/patient/all')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("docs");
          expect(res.body.docs).to.be.an("array");
          expect(res.body.docs.length).to.be.greaterThan(0);
          done();
        });
    });
  });
  describe("GET /api/patient/search", () => {
    it("Search for patient via GET method", (done) => {
      chai.request(app)
        .get(`/api/patient/search?type=area&term=CIT%20Nagar`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("docs");
          expect(res.body.docs).to.be.an("array");
          expect(res.body.docs.length).to.be.greaterThan(0);
          expect(res.body.docs[0]['p_id']).to.equal("PAT0001");
          done();
        });
    });
  });
  describe("PUT /api/patient/update", () => {
    it("Update patient object", (done) => {
      chai.request(app)
        .put('/api/patient/update/PAT0001')
        .send({ contact: 9000190001 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("contact");
          expect(res.body.contact).to.eql(9000190001);
          done();
        })
    });
  });
  describe("POST /api/patient/search", () => {
    it("Search for patient via POST method", (done) => {
      chai.request(app)
        .post(`/api/patient/search`)
        .send({
          term: "9000190001",
          type: "Contact"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("docs");
          expect(res.body.docs).to.be.an("array");
          expect(res.body.docs.length).to.be.greaterThan(0);
          expect(res.body.docs[0]['p_id']).to.equal("PAT0001");
          done();
        });
    });
  });
});
