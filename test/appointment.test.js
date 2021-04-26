const chai = require('chai');
const http = require('chai-http');
const { toPlainObject } = require('lodash');
const app = require('../api/app.js');
const dbUtils = require('../api/utils/db-utils');

chai.use(http);
let expect = chai.expect;

describe("Appointment test cases", () => {
  before(async function () {
    const db = await dbUtils.connect();
    await db.Appointment.deleteMany({});
  });
  after(async function () {
    await dbUtils.close();
  });
  describe("POST /api/appointment/new", () => {
    it("Create new appointment", (done) => {
      let appointmentObj = {
        p_id: "PAT0001",
        appointment_date: new Date("2021-05-20T11:50:00Z").getTime(),
        doctor: "Dr. Zoe Test",
        status: 1,
        room: 2
      };
      chai.request(app)
        .post('/api/appointment/new')
        .send(appointmentObj)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("p_id");
          expect(res.body).to.have.property("app_id");
          expect(res.body).to.have.property("doctor");
          expect(res.body).to.have.property("status");
          expect(res.body.status).to.eql(1);
          done();
        });
    });
  });
  describe("GET /api/appointment/all", () => {
    it("Get all appointments", (done) => {
      chai.request(app)
        .get('/api/appointment/all')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("docs");
          expect(res.body.docs).to.be.an("array");
          expect(res.body.docs.length).to.be.greaterThan(0);
          expect(res.body.docs[0].app_id).to.eql("APP0001");
          done();
        });
    });
  });
  describe("PUT /api/appointment/update", () => {
    it("Update appointment record", (done) => {
      chai.request(app)
        .put('/api/appointment/update/APP0001')
        .send({ status: 2, room: 13 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("room");
          expect(res.body.status).to.equal(2);
          expect(res.body.room).to.equal(13);
          done();
        });
    });
  });
  describe("GET /api/appointment/all", () => {
    it("Get appointment between date", (done) => {
      let from = new Date("2021-05-01T00:00:00Z").getTime();
      let to = new Date("2021-05-31T23:59:59Z").getTime();
      chai.request(app)
        .get(`/api/appointment/all?from=${from}&to=${to}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("docs");
          expect(res.body.docs).to.be.an("array");
          expect(res.body.docs.length).to.be.greaterThan(0);
          expect(res.body.docs[0].app_id).to.eql("APP0001");
          done();
        });
    });
  });
  describe("POST /api/appointment/doctor", () => {
    it("Get appointments for a doctor", (done) => {
      chai.request(app)
        .post('/api/appointment/doctor')
        .send({ doctor: "Dr. Zoe Test" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("docs");
          expect(res.body.docs).to.be.an("array");
          expect(res.body.docs.length).to.be.greaterThan(0);
          expect(res.body.docs[0].app_id).to.eql("APP0001");
          done();
        });
    });
  });
  describe("POST /api/appointment/status", () => {
    it("Get appointments for a status", (done) => {
      chai.request(app)
        .post('/api/appointment/status')
        .send({ status: 2 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("docs");
          expect(res.body.docs).to.be.an("array");
          expect(res.body.docs.length).to.be.greaterThan(0);
          expect(res.body.docs[0].app_id).to.eql("APP0001");
          done();
        });
    });
  });
});
