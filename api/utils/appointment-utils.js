'use strict';
const dbUtils = require('./db-utils');

function AppointmentUtils() { }

function makeNextAid(db) {
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
        console.error(`[UTILS] Error @ makeNextAid \n ${JSON.stringify(err)}`);
        return reject(err);
      });
  });
}

function generateStatsForAppointment(docs) {
  let uniqueDoctors = [...new Set(docs.map(doc => doc.doctor))]; // Get list of unique doctors
  let uniqueStatuses = [...new Set(docs.map(doc => doc.status))]; // Get list of unique statuses
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
      count: docs.filter(doc => doc.doctor === doctor).length
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
      count: docs.filter(doc => doc.status === status).length
    };
  });
  return [...doctorStats, ...statusStats];
}

function sanitize(doc) {
  // Create a clean object fit for the db
  var cleanObj = { ...doc };
  for (let key in cleanObj) {
    if (key === "app_id" || cleanObj[key] === null || cleanObj[key] === undefined || cleanObj[key] === "") {
      delete cleanObj[key];
    }
  }
  return cleanObj;
}

async function NewAppointmentHandler(doc) {
  try {
    const db = await dbUtils.connect();
    const appid = await makeNextAid(db); // Create the next appointment id
    doc = sanitize(doc);
    doc.app_id = appid;
    await db.Appointment.create(doc);
    return { status: 201, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ NewAppointmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function AllAppointmentHandler() {
  try {
    const db = await dbUtils.connect();
    var instances = await db.Appointment.countAll();
    if (instances < 1) {
      // No appointment records found
      console.error(`[UTILS] AllAppointmentHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      var docs = await db.Appointment.getAll();
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
    var instances = await db.Appointment.countByPid(pid);
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
        var docs = db.Appointment.findByPid(pid);
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
    var instances = await db.Appointment.countByDoctor(doctor);
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
        var docs = await db.Appointment.findByDoctor(doctor);
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
    var instances = await db.Appointment.countByStatus(status);
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
        var docs = await db.Appointment.findByStatus(status);
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
    var docs = await db.Appointment.findBetweenDate(from, to);
    if (count) {
      // Request for only count of records
      return { status: 200, body: { total_docs: docs.length } };
    } else {
      var result = {
        total_docs: docs.length,
        docs,
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


AppointmentUtils.prototype.NewAppointmentHandler = NewAppointmentHandler;
AppointmentUtils.prototype.AllAppointmentHandler = AllAppointmentHandler;
AppointmentUtils.prototype.PatientAppointmentHandler = PatientAppointmentHandler;
AppointmentUtils.prototype.DoctorAppointmentHandler = DoctorAppointmentHandler;
AppointmentUtils.prototype.StatusAppointmentHandler = StatusAppointmentHandler;
AppointmentUtils.prototype.UpdateAppointmentHandler = UpdateAppointmentHandler;
AppointmentUtils.prototype.DateAppointmentHandler = DateAppointmentHandler;

module.exports = new AppointmentUtils();
