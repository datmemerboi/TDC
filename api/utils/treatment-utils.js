'use strict';
const _ = require('lodash');
const dbUtils = require('./db-utils');

function TreatmentUtils() {}

function makeNextTid(db) {
  /**
   * Checks database and generates next treatment id.
   *
   * @version 3.1.2
   * @param {Object} db The connection to the database.
   * @returns {String} The treatment id generated.
   * @exception {Object} err The error object.
   */
  return new Promise((resolve, reject) => {
    db.Treatment.getLatestTid()
      .then((top) => {
        top = top[0] && top[0]?.t_id ? parseInt(top[0].t_id.replace('TRT', '')) : null;
        if (top) {
          let tid =
            top < 1000
              ? 'TRT' + ('0000' + (top + 1).toString()).slice(-4)
              : 'TRT' + (top + 1).toString();
          return resolve(tid);
        } else {
          return resolve('TRT0001');
        }
      })
      .catch((err) => {
        console.error(`[UTILS] Error @ makeNextTid \n ${JSON.stringify(err)}`);
        return reject(err);
      });
  });
}

async function checkCompatibility(list) {
  /**
   * Checks if a list of treatment ids are compatible
   * to create an invoice.
   *
   * @version 3.1.2
   * @param {Array} list The list of treatment ids to check compatibility.
   * @returns {Boolean} Returns if the treatments are compatible.
   * @exception {Object} err The error object.
   */
  try {
    const db = await dbUtils.connect();
    let treatmentObjArray = await Promise.all(list.map((tid) => db.Treatment.getByTid(tid)));
    const patients = _.chain(treatmentObjArray).map('p_id').uniq().value(); // Get list of unique patients
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
  /**
   * Creates a sanitized object, fit for the db.
   *
   * @version 3.1.2
   * @param {Object} doc The object to be sanitized.
   * @returns {Object} cleanObj The sanitized object.
   */
  let cleanObj = _.cloneDeep(doc);
  for (let key in cleanObj) {
    if (key === 't_id' || _.isNil(cleanObj[key])) delete cleanObj[key];
  }
  if (!_.isNil(doc.teeth_number) && typeof doc.teeth_number === 'string') {
    cleanObj.teeth_number = doc.teeth_number.split(',').map((n) => parseInt(n, 10));
  }
  if (!_.isNil(cleanObj.treatment_date) && cleanObj.treatment_date < 1000000000000) {
    cleanObj.treatment_date = new Date(cleanObj.treatment_date * 1000).getTime();
  }
  return cleanObj;
}

async function NewTreatmentHandler(doc) {
  /**
   * Handles request to create new treatment.
   *
   * @version 3.1.2
   * @param {Object} doc The document containing treatment details.
   * @returns {Object} Returns the HTTP status and the document.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    doc = sanitize(doc);
    doc.t_id = await makeNextTid(db);
    await db.Treatment.create(doc);
    console.log(`[UTILS] NewTreatmentHandler success`);
    return { status: 201, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ NewTreatmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function AllTreatmentHandler() {
  /**
   * Handles request to list all treatment documents.
   *
   * @version 3.1.2
   * @returns {Object} Returns the HTTP status and all treatment documents.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Treatment.countAll();
    if (instances < 1) {
      // No treatment documents found
      console.error(`[UTILS] AllTreatmentHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      let docs = await db.Treatment.getAll();
      console.log(`[UTILS] AllTreatmentHandler success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ AllTreatmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function GetTreatmentHandler(tid) {
  /**
   * Handles request to get treatment document.
   *
   * @version 3.1.3
   * @param {String} tid The treatment id to fetch.
   * @returns {Object} Returns the HTTP status and the treatment document fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let doc = await db.Treatment.getByTid(tid);
    if (_.isNil(doc)) {
      console.log(`[UTILS] GetTreatmentHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      let patientDoc = await db.Patient.getByPid(doc.p_id);
      console.log(`[UTILS] GetTreatmentHandler success`);
      return { status: 200, body: { ...doc, name: patientDoc.name } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ GetTreatmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function PidTreatmentHandler(pid) {
  /**
   * Handles request to get treatments for a patient.
   *
   * @version 3.1.3
   * @param {String} pid The patient id to fetch treatments.
   * @returns {Object} Returns the HTTP status and the treatment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Treatment.countByPid(pid);
    if (instances < 1) {
      console.log(`[UTILS] PidTreatmentHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      let docs = await db.Treatment.findByPid(pid);
      let patientDoc = await db.Patient.getByPid(pid);
      docs = docs.map((doc) => ({ ...doc, name: patientDoc.name }));
      console.log(`[UTILS] PidTreatmentHandler success`);
      return { status: 200, body: { total_docs: instances, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ PidTreatmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function DistinctProceduresHandler() {
  /**
   * Handles request to get distinct procedures done.
   *
   * @version 3.1.2
   * @returns {Object} Returns the HTTP status and the list of unique procedures fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let docs = await db.Treatment.getDistinctProcedures();
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] DistinctProceduresHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      console.log(`[UTILS] DistinctProceduresHandler success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ DistinctProceduresHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function DoctorTreatmentHandler(doctor, count = false) {
  /**
   * Handles request to get treatments for a doctor.
   *
   * @version 3.1.2
   * @param {String} doctor The doctor name.
   * @param {Boolean} count When true, only count of documents is returned.
   * @returns {Object} Returns the HTTP status and the treatment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Treatment.countByDoctor(doctor);
    if (instances < 1) {
      console.log(`[UTILS] DoctorTreatmentHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      if (count) {
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
    throw err;
  }
}

async function UpdateTreatmentHandler(tid, doc) {
  /**
   * Handles request to update treatment .
   *
   * @version 3.1.2
   * @param {String} tid The treatment id to be updated.
   * @param {Object} doc The changes to be applied.
   * @returns {Object} Returns the HTTP status and the updated treatment document.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    doc = sanitize(doc);
    let updatedDoc = await db.Treatment.updateDoc(tid, doc);
    updatedDoc = _.omit(updatedDoc, ['_id', '__v']);
    console.log(`[UTILS] UpdateTreatmentHandler success`);
    return { status: 200, body: updatedDoc };
  } catch (err) {
    console.error(`[UTILS] Error @ UpdateTreatmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function DateTreatmentHandler(from, to) {
  /**
   * Handles request to get treatments by date.
   *
   * @version 3.1.2
   * @param {Number} from The from date to filter.
   * @param {Number} to The to date to filter.
   * @returns {Object} Returns the HTTP status and the treatment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    from = from < 1000000000000 ? from * 1000 : from; // Converting Epoch timestamp to JS milliseconds
    to = to < 1000000000000 ? to * 1000 : to; // Converting Epoch timestamp to JS milliseconds
    let docs = await db.Treatment.findBetweenDate(from, to);
    console.log(`[UTILS] DateTreatmentHandler success`);
    return { status: 200, body: { total_docs: docs.length, docs } };
  } catch (err) {
    console.error(`[UTILS] Error @ DateTreatmentHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function TreatmentHistoryHandler(pid, quick = false) {
  /**
   * Handles request to get treatment history for a patient.
   *
   * @version 3.1.2
   * @param {String} pid The patient id to fetch treatments.
   * @param {Boolean} quick When true, a concise treatment history is returned.
   * @returns {Object} Returns the HTTP status and the treatment documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let docs = await db.Treatment.findByPid(pid);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] TreatmentHistoryHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      let result = { total_docs: docs.length };
      if (quick) {
        // Quick treatment history
        result.procedures = _.chain(docs)
          .map((doc) => {
            return {
              procedure_done: doc.procedure_done,
              treatment_date: doc.treatment_date
            };
          })
          .sortBy('treatment_date')
          .value();
        result.doctors = _.chain(docs).map('doctor').uniq().value();
        result.last_visit = _.last(result.procedures)['treatment_date'];
      } else {
        // Detailed treatment history
        result.procedures = _.chain(docs)
          .map((doc) => {
            return {
              procedure_done: doc.procedure_done,
              treatment_date: doc.treatment_date,
              remarks: _.has(doc, 'remarks') ? doc.remarks : null,
              doctor: doc.doctor,
              teeth_number: _.has(doc, 'teeth_number') ? doc.teeth_number : null,
              t_id: doc.t_id
            };
          })
          .sortBy('treatment_date')
          .value();
        result.doctors = _.chain(docs).map('doctor').uniq().value();
        result.last_visit = _.last(result.procedures)['treatment_date'];
      }
      console.log(`[UTILS] TreatmentHistoryHandler success`);
      return { status: 200, body: result };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ TreatmentHistoryHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function CheckCompatibilityHandler(list) {
  /**
   * Handles request to check if list of treatments are
   * compatible to create an invoice.
   *
   * @version 3.1.2
   * @param {Array} list The list of treatment ids to check.
   * @returns {Object} Returns the HTTP status and the treatments compatiblity.
   * @throws {Object} Throws the error object.
   */
  try {
    let compatibility = await checkCompatibility(list);
    console.log(`[UTILS] CheckCompatibilityHandler success`);
    return { status: 200, body: { compatible: compatibility } };
  } catch (err) {
    console.error(`[UTILS] Error @ CheckCompatibilityHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function ImportTreatmentsHandler(docs) {
  /**
   * Handles request to import treatments.
   *
   * @version 3.1.2
   * @param {Array} docs The list of documents to be imported.
   * @returns {Object} Returns the HTTP status and the treatment documents imported.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    for (let doc of docs) {
      if (_.has(doc, 't_id')) {
        let existing = await db.Treatment.getByPid(doc.t_id);
        if (!_.isNil(existing) && !_.isEmpty(existing)) {
          await db.Treatment.updateDoc(existing.t_id, doc);
          continue;
        }
      }
      doc = sanitize(doc);
      if (_.has(doc, 'created_at')) delete doc.created_at;
      doc.t_id = await makeNextTid(db);
      await db.Treatment.create(doc);
    }
    return { status: 200, body: { total_docs: docs.length, docs } };
  } catch (err) {
    console.error(`[UTILS] Error @ ImportPatientsHandler \n ${JSON.stringify(err)}`);
    throw err;
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
