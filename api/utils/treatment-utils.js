'use strict';
const _ = require('lodash');
const dbUtils = require('./db-utils');

function TreatmentUtils() { }

function makeNextTid(db) {
  return new Promise((resolve, reject) => {
    db.Treatment.getLatestTid()
      .then(top => {
        top = top[0] && top[0]?.t_id
          ? parseInt(top[0].t_id.replace('TRT', ''))
          : null;
        if (top) {
          let tid = top < 1000
            ? "TRT" + ("0000" + (top + 1).toString()).slice(-4)
            : "TRT" + (top + 1).toString();
          return resolve(tid);
        } else {
          return resolve('TRT0001');
        }
      })
      .catch(err => reject(err));
  });
}

async function checkCompatibility(list) {
  try {
    const db = await dbUtils.connect();
    let treatmentObjArray = await Promise.all(list.map(tid => db.Treatment.getByTid(tid)));
    const patients = [...new Set(treatmentObjArray.map(obj => obj.p_id))]; // Get list of unique patients
    if (patients.length > 1) {
      throw `Multiple patient ids obtained ${patients.join(',')}`;
    } else {
      return true;
    }
  } catch (err) {
    console.error(`[UTILS] Error @ checkCompatibility \n ${JSON.stringify(err)}`);
    return false;
  }
}

function sanitize(doc) {
  // Create a clean object fit for the db
  let cleanObj = new Object(doc);
  for (let key in cleanObj) {
    if (key === "t_id" || _.isNil(cleanObj[key])) delete cleanObj[key];
  }
  if (!_.isNil(doc.teeth_number) && typeof doc.teeth_number === "string") {
    cleanObj.teeth_number = doc.teeth_number.split(',').map(n => parseInt(n, 10));
  }
  cleanObj.treatment_date = cleanObj.treatment_date < 1000000000000
    ? new Date(cleanObj.treatment_date * 1000).getTime()
    : cleanObj.treatment_date;
  return cleanObj;
}

async function NewTreatmentHandler(doc) {
  try {
    const db = await dbUtils.connect();
    const tid = await makeNextTid(db);
    doc = sanitize(doc);
    doc.t_id = tid;
    await db.Treatment.create(doc);
    console.log(`[UTILS] NewTreatmentHandler success`);
    return { status: 201, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ NewTreatmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function AllTreatmentHandler() {
  try {
    const db = await dbUtils.connect();
    let instances = await db.Treatment.countAll();
    if (instances < 1) {
      // No treatment records found
      console.error(`[UTILS] AllTreatmentHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      let docs = await db.Treatment.getAll();
      console.log(`[UTILS] AllTreatmentHandler success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  }
  catch (err) {
    console.error(`[UTILS] Error @ AllTreatmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function GetTreatmentHandler(tid) {
  try {
    const db = await dbUtils.connect();
    let doc = await db.Treatment.getByTid(tid);
    if (_.isNil(doc)) {
      console.log(`[UTILS] GetTreatmentHandler returns empty data`);
      return { status: 404, body: doc };
    } else {
      console.log(`[UTILS] GetTreatmentHandler success`);
      return { status: 200, body: doc };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ GetTreatmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function PidTreatmentHandler(pid) {
  try {
    const db = await dbUtils.connect();
    let instances = await db.Treatment.countByPid(pid);
    if (instances < 1) {
      // No treament records found
      console.log(`[UTILS] PidTreatmentHandler returns empty data`);
      return { status: 404, body: {} };
    } else {
      let docs = await db.Treatment.findByPid(pid);
      console.log(`[UTILS] PidTreatmentHandler success`);
      return { status: 200, body: { total_docs: instances, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ PidTreatmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function DistinctProceduresHandler() {
  try {
    const db = await dbUtils.connect();
    let docs = await db.Treatment.getDistinctProcedures();
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] DistinctProceduresHandler returns empty data`);
      return { status: 404, body: {} };
    } else {
      console.log(`[UTILS] DistinctProceduresHandler success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ DistinctProceduresHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function DoctorTreatmentHandler(doctor, count = false) {
  try {
    const db = await dbUtils.connect();
    let instances = await db.Treatment.countByDoctor(doctor);
    if (instances < 1) {
      // No treament records found
      console.log(`[UTILS] DoctorTreatmentHandler returns empty data`);
      return { status: 404, body: {} };
    } else {
      if (count) {
        // Request for only count
        console.log(`[UTILS] DoctorTreatmentHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        let docs = await db.Treatment.findByDoctor(doctor);
        console.log(`[UTILS] DoctorTreatmentHandler success`);
        return { status: 200, body: { total_docs: instances, docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ DoctorTreatmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function UpdateTreatmentHandler(tid, doc) {
  try {
    const db = await dbUtils.connect();
    doc = sanitize(doc);
    await db.Treatment.updateDoc(tid, doc);
    console.log(`[UTILS] UpdateTreatmentHandler success`);
    return { status: 200, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ UpdateTreatmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function DateTreatmentHandler(from, to) {
  try {
    const db = await dbUtils.connect();
    from = from < 1000000000000 ? from * 1000 : from;
    to = to < 1000000000000 ? to * 1000 : to;
    let docs = await db.Treatment.findBetweenDate(from, to);
    console.log(`[UTILS] DateTreatmentHandler success`);
    return { status: 200, body: { total_docs: docs.length, docs } };
  } catch (err) {
    console.error(`[UTILS] Error @ DateTreatmentHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function TreatmentHistoryHandler(pid, quick = false) {
  try {
    const db = await dbUtils.connect();
    let docs = await db.Treatment.findByPid(pid);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] TreatmentHistoryHandler returns empty data`);
      return { status: 404, body: {} };
    } else {
      let result = { total_docs: docs.length };
      if (quick) {
        // Quick treatment history
        result.procedures = _.chain(docs)
          .map(doc => {
            return {
              procedure_done: doc.procedure_done,
              treatment_date: doc.treatment_date
            };
          })
          .sortBy('treatment_date')
          .value();
        result.doctors = _.chain(docs).map('doctor').uniq().value();
        result.last_visit = result.procedures[0]['treatment_date'];
      } else {
        // Detailed treatment history
        result.procedures = _.chain(docs)
          .map(doc => {
            return {
              procedure_done: doc.procedure_done,
              treatment_date: doc.treatment_date,
              remarks: doc?.remarks ?? null,
              doctor: doc.doctor,
              teeth_number: doc?.teeth_number ?? null,
              t_id: doc.t_id
            };
          })
          .sortBy('treatment_date')
          .value();
        result.doctors = _.chain(docs).map('doctor').uniq().value();
        result.last_visit = result.procedures[0]['treatment_date'];
      }
      console.log(`[UTILS] TreatmentHistoryHandler success`);
      return { status: 200, body: result };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ TreatmentHistoryHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function CheckCompatibilityHandler(list) {
  try {
    let compatibility = await checkCompatibility(list);
    console.log(`[UTILS] CheckCompatibilityHandler success`);
    return { status: 200, body: { compatible: compatibility } };
  } catch (err) {
    console.error(`[UTILS] Error @ CheckCompatibilityHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function ImportTreatmentsHandler(docs) {
  try {
    const db = await dbUtils.connect();
    for (let doc of docs) {
      if (!_.isNil(doc.t_id)) {
        let existing = await db.Treatment.getByTid(doc.t_id);
        if (!_.isEqual(existing, doc)) {
          await db.Treatment.updateDoc(existing.t_id, doc);
        }
      } else {
        if (!_.isNil(doc.created_at)) delete doc.created_at;
        let tid = await makeNextTid(db);
        doc.t_id = tid;
        await db.Treatment.create(doc);
      }
    }
    console.log(`[UTILS] ImportTreatmentsHandler success`);
    return { status: 200, body: null };
  } catch (err) {
    console.error(`[UTILS] Error @ ImportTreatmentsHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

TreatmentUtils.prototype.NewTreatmentHandler = NewTreatmentHandler;
TreatmentUtils.prototype.AllTreatmentHandler = AllTreatmentHandler;
TreatmentUtils.prototype.GetTreatmentHandler = GetTreatmentHandler;
TreatmentUtils.prototype.PidTreatmentHandler = PidTreatmentHandler;
TreatmentUtils.prototype.DistinctProceduresHandler = DistinctProceduresHandler;
TreatmentUtils.prototype.DoctorTreatmentHandler = DoctorTreatmentHandler;
TreatmentUtils.prototype.UpdateTreatmentHandler = UpdateTreatmentHandler;
TreatmentUtils.prototype.DateTreatmentHandler = DateTreatmentHandler;
TreatmentUtils.prototype.TreatmentHistoryHandler = TreatmentHistoryHandler;
TreatmentUtils.prototype.CheckCompatibilityHandler = CheckCompatibilityHandler;
TreatmentUtils.prototype.ImportTreatmentsHandler = ImportTreatmentsHandler;

module.exports = new TreatmentUtils();
