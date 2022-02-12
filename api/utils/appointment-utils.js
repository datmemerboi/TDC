'use strict';
const _ = require('lodash');
const dbUtils = require('./db-utils');

function AppointmentUtils() {}

function makeNextAppid(db) {
  /**
   * Checks database and generates next appointment id.
   *
   * @version 3.1.2
   * @param {Object} db The connection to the database.
   * @returns {String} The appointment id generated.
   * @exception {Object} err The error object.
   */
  return new Promise((resolve, reject) => {
    db.Appointment.getLatestAppId()
      .then((top) => {
        top = top[0] && top[0]?.app_id ? parseInt(top[0].app_id.replace('APP', '')) : null;
        if (top) {
          let appid =
            top < 1000
              ? 'APP' + ('0000' + (top + 1).toString()).slice(-4)
              : 'APP' + (top + 1).toString();
          return resolve(appid);
        } else {
          return resolve('APP0001');
        }
      })
      .catch((err) => {
        console.error(`[UTILS] Error @ makeNextAppid \n ${JSON.stringify(err)}`);
        return reject(err);
      });
  });
}

function generateStatsForAppointment(docs) {
  /**
   * Generates stats/meta data for list of appointments.
   *
   * @version 3.1.2
   * @param {Array} docs The list of appointment objects.
   * @returns {Array} Returns the combined list of doctors & status stats.
   * @example
   * [
   *   {
   *     type: "doctor",
   *     name: "Doctor Name",
   *     count: 1
   *   },
   *   {
   *     type: "status",
   *     value: 4,
   *     count: 2
   *   }
   * ]
   */
  let doctorStats = _.chain(docs)
    .map('doctor')
    .uniq()
    .map((doctor) => {
      return {
        type: 'doctor',
        name: doctor,
        count: _.chain(docs).filter({ doctor: doctor }).size()
      };
    })
    .value();
  let statusStats = _.chain(docs)
    .map('status')
    .uniq()
    .map((status) => {
      return {
        type: 'status',
        value: status,
        count: _.chain(docs).filter({ status: status }).size()
      };
    })
    .value();
  return [...doctorStats, ...statusStats];
}

function mergePatientDetails(db, pid, doc) {
  /**
   * Fetches patient details and merges it with the appointment doc.
   *
   * @version 3.1.2
   * @param {Object} db The connection to the database.
   * @param {String} pid The patient id to be fetched.
   * @param {Object} doc The appointment document.
   * @returns {Object} mergedDoc The merged document.
   */
  return new Promise((resolve) => {
    db.Patient.getByPid(pid)
      .then((patient) => {
        let mergedDoc = {
          ...doc,
          patient: {
            name: patient.name,
            age: patient.age,
            gender: patient.gender
          }
        };
        return resolve(mergedDoc);
      })
      .catch((err) => {
        console.error(`[UTILS] Error @ mergePatientDetails \n ${JSON.stringify(err)}`);
        return resolve(doc);
      });
  });
}

function checkAppointmentFeasibility(db, doc) {
  /**
   * Checks if a new appointment is feasible
   * by comparing doctor, from & to time, status
   * of existing appointments.
   *
   * @version 3.1.2
   * @param {Object} db The connection to the database.
   * @param {Object} doc The new apppointment document.
   * @returns {Boolean} Returns if the new appointment is feasible.
   */
  return new Promise((resolve, reject) => {
    if (
      _.isNil(doc.app_id) ||
      _.isNil(doc.appointment_date) ||
      _.isNil(doc.doctor) ||
      _.isNil(doc.status)
    ) {
      // Appointment id, timing, doctor and status not mentioned
      return resolve(false);
    } else {
      let from = doc.appointment_date - 899000; // 15 minutes before appointment_date
      let to = doc.appointment_date + 899000; // 15 minutes after appointment_date

      // Check if the doctor has any appointments 15 mins before or after the mentioned timing
      db.Appointment.findByAvailability(doc.doctor, from, to)
        .then((docs) => {
          if (_.isNil(docs) || _.isEmpty(docs)) {
            // No existing docs
            return resolve(true);
          } else {
            // Ensure every record is Cancelled / Completed / Postponed
            return resolve(docs.every((doc) => doc.status !== 1));
          }
        })
        .catch((err) => {
          console.error(`[UTILS] Error @ checkAppointmentFeasibility \n ${JSON.stringify(err)}`);
          return reject(false);
        });
    }
  });
}

function sanitize(doc) {
  /**
   * Creates a sanitized object, fit for the db.
   *
   * @version 3.1.2
   * @param {object} doc The object to be sanitized.
   * @returns {object} cleanObj The sanitized object.
   */
  let cleanObj = _.cloneDeep(doc);
  for (let key in cleanObj) {
    if (key === 'app_id' || _.isNil(cleanObj[key])) delete cleanObj[key];
  }
  if (!_.isNil(cleanObj.appointment_date) && cleanObj.appointment_date < 1000000000000) {
    cleanObj.appointment_date = new Date(cleanObj.appointment_date * 1000).getTime();
  }
  return cleanObj;
}

async function NewAppointmentHandler(doc) {
  /**
   * Handles request to create new appointment.
   *
   * @version 3.1.2
   * @param {Object} doc The document contained appointment details.
   * @returns {Object} Returns the HTTP status and the document.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    const appid = await makeNextAppid(db); // Create the next appointment id
    doc = sanitize(doc);
    doc.app_id = appid;
    if (await checkAppointmentFeasibility(db, doc)) {
      await db.Appointment.create(doc);
      console.log(`[UTILS] NewAppointmentHandler success`);
      return { status: 201, body: doc };
    } else {
      console.log(`[UTILS] Mentioned appointment is not feasible`);
      return { status: 409, body: doc };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ NewAppointmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function AllAppointmentHandler() {
  /**
   * Handles request to list all appointment documents.
   *
   * @version 3.1.2
   * @returns {Object} Returns the HTTP status and all appointment documents.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countAll();
    if (instances < 1) {
      // No appointments found
      console.error(`[UTILS] AllAppointmentHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      let docs = await db.Appointment.getAll();
      console.log(`[UTILS] AllAppointmentHandler success`);
      return {
        status: 200,
        body: {
          total_docs: instances,
          docs,
          meta: generateStatsForAppointment(docs)
        }
      };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ AllAppointmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function PatientAppointmentHandler(pid, count = false) {
  /**
   * Handles request to get appointments for a patient
   *
   * @version 3.1.2
   * @param {String} pid The patient id to fetch appointments.
   * @param {Boolean} count When true, only count of documents is returned.
   * @returns {Object} Returns the HTTP status and the appointment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countByPid(pid);
    if (instances < 1) {
      // No appointments found
      console.log(`[UTILS] PatientAppointmentHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      if (count) {
        console.log(`[UTILS] PatientAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        let docs = await db.Appointment.findByPid(pid);
        console.log(`[UTILS] PatientAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances, docs: docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ PatientAppointmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function DoctorAppointmentHandler(doctor, count = false) {
  /**
   * Handles request to get appointments for a doctor.
   *
   * @version 3.1.2
   * @param {String} doctor The doctor name.
   * @param {Boolean} count When true, only count of documents is returned.
   * @returns {Object} Returns the HTTP status and the appointment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countByDoctor(doctor);
    if (instances < 1) {
      // No appointments found
      console.error(`[UTILS] DoctorAppointmentHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      if (count) {
        console.log(`[UTILS] DoctorAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        let docs = await db.Appointment.findByDoctor(doctor);
        console.log(`[UTILS] DoctorAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances, docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ DoctorAppointmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function StatusAppointmentHandler(status, count = false) {
  /**
   * Handles request to get appointments by status.
   *
   * @version 3.1.2
   * @param {Number} status The required status.
   * @param {Boolean} count When true, only count of documents is returned.
   * @returns {Object} Returns the HTTP status and the appointment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countByStatus(status);
    if (instances < 1) {
      // No appointments found
      console.log(`[UTILS] StatusAppointmentHandler return empty data`);
      return { status: 204, body: null };
    } else {
      if (count) {
        console.log(`[UTILS] StatusAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        let docs = await db.Appointment.findByStatus(status);
        console.log(`[UTILS] StatusAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances, docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ StatusAppointmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function UpdateAppointmentHandler(appid, doc) {
  /**
   * Handles request to update appointment.
   *
   * @version 3.1.2
   * @param {String} appid The appointment id to be updated.
   * @param {Object} doc The changes to be applied.
   * @returns {Object} Returns the HTTP status and the updated appointment document.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    doc = sanitize(doc);
    let updatedDoc = await db.Appointment.updateDoc(appid, doc);
    updatedDoc = _.omit(updatedDoc, ['_id', '__v']);
    console.log(`[UTILS] UpdateAppointmentHandler success`);
    return { status: 200, body: updatedDoc };
  } catch (err) {
    console.error(`[UTILS] Error @ UpdateAppointmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function DateAppointmentHandler(from, to, count = false) {
  /**
   * Handles request to get appointments by a date range.
   *
   * @version 3.1.2
   * @param {Number} from The from date to filter.
   * @param {Number} to The to date to filter.
   * @param {Boolean} count When true, only count of documents is returned.
   * @returns {Object} Returns the HTTP status and the appointment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    // Convert epoch seconds into JS milliseconds
    from = from < 1000000000000 ? from * 1000 : from;
    to = to < 1000000000000 ? to * 1000 : to;
    const db = await dbUtils.connect();
    let docs = await db.Appointment.findBetweenDate(from, to);
    if (count) {
      return { status: 200, body: { total_docs: docs.length } };
    } else {
      const mergedDocs = await Promise.all(
        docs.map((doc) => mergePatientDetails(db, doc.p_id, doc))
      );
      let result = {
        total_docs: docs.length,
        docs: mergedDocs,
        meta: generateStatsForAppointment(docs)
      };
      console.log(`[UTILS] DateAppointmentHandler success`);
      return { status: 200, body: result };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ DateAppointmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function ImportAppointmentsHandler(docs) {
  /**
   * Handles request to import appointments.
   *
   * @version 3.1.2
   * @param {Array} docs The list of documents to be imported.
   * @returns {Object} Returns the HTTP status and the appointment documents imported.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    for (let doc of docs) {
      if (_.has(doc, 'app_id')) {
        let existing = await db.Appointment.getByAppid(doc.app_id);
        if (!_.isNil(existing) && !_.isEmpty(existing)) {
          await db.Appointment.updateDoc(existing.app_id, doc);
          continue;
        }
      }
      doc = sanitize(doc);
      if (_.has(doc, 'created_at')) delete doc.created_at;
      let appid = await makeNextAppid(db);
      doc.app_id = appid;
      await db.Appointment.create(doc);
    }
    return { status: 200, body: { total_docs: docs.length, docs } };
  } catch (err) {
    console.error(`[UTILS] Error @ ImportAppointmentsHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

AppointmentUtils.prototype.NewAppointmentHandler = NewAppointmentHandler;
AppointmentUtils.prototype.AllAppointmentHandler = AllAppointmentHandler;
AppointmentUtils.prototype.PatientAppointmentHandler = PatientAppointmentHandler;
AppointmentUtils.prototype.DoctorAppointmentHandler = DoctorAppointmentHandler;
AppointmentUtils.prototype.StatusAppointmentHandler = StatusAppointmentHandler;
AppointmentUtils.prototype.UpdateAppointmentHandler = UpdateAppointmentHandler;
AppointmentUtils.prototype.DateAppointmentHandler = DateAppointmentHandler;
AppointmentUtils.prototype.ImportAppointmentsHandler = ImportAppointmentsHandler;

module.exports = new AppointmentUtils();
