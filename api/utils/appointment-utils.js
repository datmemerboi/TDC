'use strict';
const _ = require('lodash');
const dbUtils = require('./db-utils');

function AppointmentUtils() { }

function makeNextAppid(db) {
  return new Promise((resolve, reject) => {
    db.Appointment.getLatestAppId()
      .then(top => {
        top = top[0] && top[0]?.app_id
          ? parseInt(top[0].app_id.replace('APP', ''))
          : null;
        if (top) {
          let appid = top < 1000
            ? "APP" + ("0000" + (top + 1).toString()).slice(-4)
            : "APP" + (top + 1).toString();
          return resolve(appid);
        } else {
          return resolve('APP0001');
        }
      })
      .catch(err => {
        console.error(`[UTILS] Error @ makeNextAppid \n ${JSON.stringify(err)}`);
        return reject(err);
      });
  });
}

function generateStatsForAppointment(docs) {
  let uniqueDoctors = _.chain(docs).map('doctor').uniq().value(); // Get list of unique doctors
  let uniqueStatuses = _.chain(docs).map('status').uniq().value(); // Get list of unique statuses
  /*
  doctorsStats = [
    {
      type: "doctor",
      name: "Doctor Name",
      count: 1
    }
  ]
  */
  let doctorStats = uniqueDoctors.map(doctor => {
    return {
      type: "doctor",
      name: doctor,
      count: _.chain(docs).filter({ "doctor": doctor }).size()
    };
  });
  /*
  statusStats = [
    {
      type: "status",
      value: 4,
      count: 2
    }
  ]
  */
  let statusStats = uniqueStatuses.map(status => {
    return {
      type: "status",
      value: status,
      count: _.chain(docs).filter({ "status": status }).size()
    };
  });
  return [...doctorStats, ...statusStats];
}

function mergePatientDetails(db, pid, doc) {
  return new Promise((resolve) => {
    db.Patient.getByPid(pid)
      .then(patient => {
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
      .catch(err => {
        console.error(`[UTILS] Error @ mergePatientDetails \n ${JSON.stringify(err)}`);
        return resolve(doc);
      });
  });
}

function checkAppointmentFeasibility(db, doc) {
  // Check if a new appointment doc is feasible
  return new Promise((resolve, reject) => {
    if (_.isNil(doc.app_id) || _.isNil(doc.appointment_date) || _.isNil(doc.doctor) || _.isNil(doc.status)) {
      // Appointment id, timing, doctor and status not mentioned
      return resolve(false);
    } else {
      let from = doc.appointment_date - 899000; // 15 minutes before appointment_date
      let to = doc.appointment_date + 899000; // 15 minutes after appointment_date

      // Check if the doctor has any appointments 15 mins before or after the mentioned timing
      db.Appointment.findByAvailability(doc.doctor, from, to)
        .then(docs => {
          if (_.isNil(docs) || _.isEmpty(docs)) {
            // No existing docs
            return resolve(true);
          } else {
            // Every record is either status Cancelled or Postponed
            let possible = docs.every(doc => doc.status !== 1 && doc.status !== 2);
            return resolve(possible);
          }
        })
        .catch(err => {
          console.error(`[UTILS] Error @ checkAppointmentFeasibility \n ${JSON.stringify(err)}`);
          return reject(false);
        });
    }
  });
}

function sanitize(doc) {
  // Create a clean object fit for the db
  let cleanObj = new Object(doc);
  for (let key in cleanObj) {
    if (key === "app_id" || _.isNil(cleanObj[key])) delete cleanObj[key];
  }
  cleanObj.appointment_date = cleanObj.appointment_date < 1000000000000
    ? new Date(cleanObj.appointment_date * 1000).getTime()
    : cleanObj.appointment_date;
  return cleanObj;
}

async function NewAppointmentHandler(doc) {
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
    return err;
  }
}

async function AllAppointmentHandler() {
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countAll();
    if (instances < 1) {
      // No appointment records found
      console.error(`[UTILS] AllAppointmentHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      let docs = await db.Appointment.getAll();
      console.log(`[UTILS] AllAppointmentHandler success`);
      return { status: 200, body: { total_docs: instances, docs, meta: generateStatsForAppointment(docs) } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ AllAppointmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function PatientAppointmentHandler(pid, count = false) {
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countByPid(pid);
    if (instances < 1) {
      // No appointment records found
      console.log(`[UTILS] PatientAppointmentHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      if (count) {
        // Request for only count of records
        console.log(`[UTILS] PatientAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        let docs = db.Appointment.findByPid(pid);
        console.log(`[UTILS] PatientAppointmentHandler success`);
        return { status: 200, body: { total_docs: instances, docs: docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ PatientAppointmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function DoctorAppointmentHandler(doctor, count = false) {
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countByDoctor(doctor);
    if (instances < 1) {
      // No appointment records found
      console.error(`[UTILS] DoctorAppointmentHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      if (count) {
        // Request for only count of records
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
    return err;
  }
}

async function StatusAppointmentHandler(status, count = false) {
  try {
    const db = await dbUtils.connect();
    let instances = await db.Appointment.countByStatus(status);
    if (instances < 0) {
      // No appointment records found
      console.log(`[UTILS] StatusAppointmentHandler return empty data`);
      return { status: 404, body: null };
    } else {
      if (count) {
        // Request for only count of records
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
    return err;
  }
}

async function UpdateAppointmentHandler(appid, doc) {
  try {
    const db = await dbUtils.connect();
    doc = sanitize(doc);
    await db.Appointment.updateDoc(appid, doc);
    console.log(`[UTILS] UpdateAppointmentHandler success`);
    return { status: 200, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ UpdateAppointmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function DateAppointmentHandler(from, to, count = false) {
  try {
    // Convert epoch seconds into JS milliseconds
    from = from < 1000000000000 ? from * 1000 : from;
    to = to < 1000000000000 ? to * 1000 : to;
    const db = await dbUtils.connect();
    let docs = await db.Appointment.findBetweenDate(from, to);
    if (count) {
      // Request for only count of records
      return { status: 200, body: { total_docs: docs.length } };
    } else {
      const mergedDocs = await Promise.all(docs.map(doc => mergePatientDetails(db, doc.p_id, doc)));
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
    return err;
  }
}

async function ImportAppointmentsHandler(docs) {
  try {
    const db = await dbUtils.connect();
    for (let doc of docs) {
      if (!_.isNil(doc.app_id)) {
        let existing = await db.Appointment.getByPid(doc.app_id);
        if (!_.isEqual(existing, doc)) {
          await db.Appointment.updateDoc(existing.app_id, doc);
        }
      } else {
        if (!_.isNil(doc.created_at)) delete doc.created_at;
        let appid = await makeNextAppid(db);
        doc.app_id = appid;
        await db.Appointment.create(doc);
      }
    }
    return { status: 200, body: null };
  } catch (err) {
    console.error(`[UTILS] Error @ ImportAppointmentsHandler \n ${JSON.stringify(err)}`);
    return err;
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
