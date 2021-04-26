const chai = require('chai');
const http = require('chai-http');
const { toPlainObject } = require('lodash');
const app = require('../api/app.js');
const dbUtils = require('../api/utils/db-utils');

chai.use(http);
let expect = chai.expect;

describe("Treatment test cases", () => {
  before(async function () {
    const db = await dbUtils.connect();
    await db.Treatment.deleteMany({});
  });
  after(async function () {
    await dbUtils.close();
  })
  describe("POST /api/treatment/new", () => {
    it("Create a new treatment", (done) => {
      let treatmentObj = {
        p_id: "PAT0001",
        procedure_done: "Filling",
        teeth_number: "31,32,33",
        treatment_date: new Date("2021-05-20T11:50:00Z"),
        doctor: "Dr. Zeo Test"
      };
      chai.request(app)
        .post('/api/treatment/new')
        .send(treatmentObj)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("t_id");
          expect(res.body.teeth_number).to.be.an("array");
          expect(res.body.teeth_number).to.have.lengthOf(3);
          done();
        });
    });
  });
  describe("GET /api/treatment/all", () => {
    it("List all treatments", (done) => {
      chai.request(app)
        .get('/api/treatment/all')
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
  describe("GET /api/treatment/get", () => {
    it("Get particular treatment", (done) => {
      chai.request(app)
        .get('/api/treatment/get/TRT0001')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("p_id");
          expect(res.body).to.have.property("t_id");
          expect(res.body).to.have.property("created_at");
          expect(res.body.t_id).to.eql("TRT0001");
          done();
        });
    });
  });
  describe("PUT /api/treatment/update", () => {
    it("Update treatment object", (done) => {
      chai.request(app)
        .put('/api/treatment/update/TRT0001')
        .send({ doctor: "Dr. Pro Test" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("p_id");
          expect(res.body).to.have.property("doctor");
          expect(res.body.doctor).to.eql("Dr. Pro Test");
          done();
        });
    });
  });
  describe("GET /api/treatment/patient", () => {
    it("Get treatments for a patient", (done) => {
      chai.request(app)
        .get('/api/treatment/patient/PAT0001')
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
  describe("GET /api/treatment/history", () => {
    it("Get patient's treatment history", (done) => {
      chai.request(app)
        .get('/api/treatment/history/PAT0001')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("procedures");
          expect(res.body).to.have.property("last_visit");
          expect(res.body).to.have.property("doctors");
          expect(res.body.procedures).to.be.an("array");
          expect(res.body.procedures.length).to.be.greaterThan(0);
          expect(res.body.doctors).to.be.an("array");
          expect(res.body.doctors.length).to.be.greaterThan(0);
          done();
        });
    });
  });
  describe("GET /api/treatment/doctor", () => {
    it("Get list of treatments by a doctor", (done) => {
      chai.request(app)
        .get('/api/treatment/doctor?doctor=Dr.%20Pro%20Test')
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
});
