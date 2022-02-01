'use strict';
const _ = require('lodash');
const dbUtils = require('./db-utils');

function PatientUtils() {}

function makeNextPid(db) {
  /**
   * Checks database and generates the next patient id.
   *
   * @version 3.1.2
   * @param {Object} db The connection to the database.
   * @returns {String} The patient id generated.
   * @exception {Object} err The error object.
   */
  return new Promise((resolve, reject) => {
    db.Patient.getLatestPid()
      .then((top) => {
        top = top[0] && top[0]?.p_id ? parseInt(top[0].p_id.replace('PAT', '')) : null;
        if (top) {
          let pid =
            top < 1000
              ? 'PAT' + ('0000' + (top + 1).toString()).slice(-4)
              : 'PAT' + (top + 1).toString();
          return resolve(pid);
        } else {
          return resolve('PAT0001');
        }
      })
      .catch((err) => {
        console.error(`[UTILS] Error @ makeNextPid \n ${JSON.stringify(err)}`);
        return reject(err);
      });
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
    if (_.isNil(cleanObj[key]) || key === 'p_id') delete cleanObj[key];
  }
  if (!_.isNil(cleanObj.dob)) {
    if (_.isFinite(cleanObj.dob) && cleanObj.dob < 1000000000000) {
      cleanObj.dob = new Date(0).setUTCSeconds(doc.dob);
    }
    if (_.isNil(cleanObj.age)) {
      // Calculate age from DOB
      cleanObj.age = Math.floor((new Date() - cleanObj.dob) / 3.15576e10);
    }
  }
  if (!_.isNil(cleanObj.med_history) && _.isString(cleanObj.med_history)) {
    cleanObj.med_history = doc.med_history.split(',');
  }
  if (!_.isNil(cleanObj.current_meds) && _.isString(cleanObj.current_meds)) {
    cleanObj.current_meds = doc.current_meds.split(',');
  }
  if (!_.isNil(cleanObj.files) && _.isString(cleanObj.files)) {
    cleanObj.files = doc.files.split(',');
  }
  return cleanObj;
}

async function NewPatientHandler(doc) {
  /**
   * Handles request to create new patient.
   *
   * @version 3.1.2
   * @param {Object} doc The document containing patient details.
   * @returns {Object} Returns the HTTP status and the document.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    // doc.p_id = doc.name.replace(/\s/g, '').split('.').filter(word => word.length > 2)[0].slice(0, 3) + doc.contact.toString().slice(-4);
    doc = sanitize(doc);
    let pid = await makeNextPid(db);
    doc.p_id = pid;
    await db.Patient.create(doc);
    console.log(`[UTILS] NewPatientHandler success`);
    return { status: 201, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ NewPatientHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function AllPatientHandler(count = false) {
  /**
   * Handles request to list all patient documents.
   *
   * @version 3.1.2
   * @param {Boolean} count When true, only count of documents is returned.
   * @returns {Object} Returns the HTTP status and all patient documents (or only count of documents).
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Patient.countAll();
    if (instances < 1) {
      console.log(`[UTILS] AllPatientHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      if (count) {
        console.log(`[UTILS] AllPatientHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        let docs = await db.Patient.getAll();
        console.log(`[UTILS] AllPatientHandler success`);
        return { status: 200, body: { total_docs: instances, docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ AllPatientHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function GetPatientHandler(pid) {
  /**
   * Handles request to get patient document.
   *
   * @version 3.1.2
   * @param {String} pid The patient id to fetch.
   * @returns {Object} Returns the HTTP status and the patient document fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    const doc = await db.Patient.getByPid(pid);
    if (_.isEmpty(doc) || _.isNil(doc)) {
      console.log(`[UTILS] GetPatientHandler returns empty data`);
      return { status: 204, body: {} };
    } else {
      console.log(`[UTILS] GetPatientHandler success`);
      return { status: 200, body: doc };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ GetPatientHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function BulkPatientsHandler(pidList) {
  /**
   * Handles request to get bulk patients.
   *
   * @version 3.1.2
   * @param {Array} pidList The list of patient ids to fetch.
   * @returns {Object} Returns the HTTP status and the patient documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    const docs = await db.Patient.getByPidList(pidList);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] BulkPatientsHandler returns empty data`);
      return { status: 204, body: null };
    } else {
      console.log(`[UTILS] BulkPatientsHandler success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ BulkPatientsHandler`);
    throw err;
  }
}

async function GetDistinctAreasHandler() {
  /**
   * Handles request to get distinct areas.
   *
   * @version 3.1.2
   * @returns {Object} Returns the HTTP status and the list of distinct areas.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let docs = await db.Patient.getDistinctArea();
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] GetDistinctAreasHandler returns empty data`);
      return { status: 204, body: {} };
    } else {
      console.log(`[UTILS] GetDistinctAreasHandler success`);
      return { status: 200, body: docs };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ GetDistinctAreasHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function UpdatePatientHandler(pid, doc) {
  /**
   * Handles request to update patient.
   *
   * @version 3.1.2
   * @param {String} pid The patient id to be updated.
   * @param {Object} doc The changes to be applied.
   * @returns {Object} Returns the HTTP status and the updated patient document.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    doc = sanitize(doc);
    let updatedDoc = await db.Patient.updateDoc(pid, doc);
    updatedDoc = _.omit(updatedDoc, ['_id', '__v']);
    console.log('[UTILS] UpdatePatientHandler success');
    return { status: 200, body: updatedDoc };
  } catch (err) {
    console.error(`[UTILS] Error @ UpdatePatientHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function SearchByName(term) {
  /**
   * Handles request to search by name.
   *
   * @version 3.1.2
   * @param {String} term The term to search for.
   * @returns {Object} Returns the HTTP status and the patient documents found.
   * @throws {Object} Throws the error object.
   */
  console.log('[UTILS] Searching for Name');
  try {
    const db = await dbUtils.connect();
    let docs = await db.Patient.findByName(term);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] SearchByName returns empty data`);
      return { status: 204, body: null };
    } else {
      console.log(`[UTILS] SearchByName success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ SearchByName \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function SearchByArea(term) {
  /**
   * Handles request to search by area.
   *
   * @version 3.1.2
   * @param {String} term The term to search for.
   * @returns {Object} Returns the HTTP status and the patient documents found.
   * @throws {Object} Throws the error object.
   */
  console.log('[UTILS] Searching for Area');
  try {
    const db = await dbUtils.connect();
    let docs = await db.Patient.findByArea(term);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] SearchByArea returns empty data`);
      return { status: 204, body: null };
    } else {
      console.log(`[UTILS] SearchByArea success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ SearchByArea \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function SearchByContact(term) {
  /**
   * Handles request to search by contact.
   *
   * @version 3.1.2
   * @param {String} term The term to search for.
   * @returns {Object} Returns the HTTP status and the patient documents found.
   * @throws {Object} Throws the error object.
   */
  console.log('[UTILS] Searching for Contact');
  try {
    if (isNaN(term)) {
      console.log(`[UTILS] Requested search term is not a number`);
      return { status: 400, body: null };
    } else {
      const db = await dbUtils.connect();
      let docs = await db.Patient.findByContact(parseInt(term));
      if (_.isNil(docs) || _.isEmpty(docs)) {
        console.log(`[UTILS] SearchByContact returns empty data`);
        return { status: 204, body: null };
      } else {
        console.log(`[UTILS] SearchByContact success`);
        return { status: 200, body: { total_docs: docs.length, docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ SearchByContact \n ${JSON.stringify(err)}`);
    throw err;
  }
}

function SearchPatientHandler(term, type) {
  /**
   * Handles search request based on type.
   *
   * @version 3.1.2
   * @param {String} term The term to search for.
   * @param {String} type The search type (name/area/contact).
   * @returns {Function} Returns the search function according to the type.
   */
  switch (type) {
    case 'name':
      return SearchByName(term);
    case 'area':
      return SearchByArea(term);
    case 'contact':
      return SearchByContact(term);
    default:
      console.log(`[UTILS] Unexpected search type ${type}`);
      return { status: 400, body: null };
  }
}

async function ImportPatientsHandler(docs) {
  /**
   * Handles request to import patients.
   *
   * @version 3.1.2
   * @param {Array} docs The list of documents to be imported.
   * @returns {Object} Returns the HTTP status and the patient documents imported.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    for (let doc of docs) {
      if (_.has(doc, 'p_id')) {
        let existing = await db.Patient.getByPid(doc.p_id);
        if (!_.isNil(existing) && !_.isEmpty(existing)) {
          await db.Patient.updateDoc(existing.p_id, doc);
          continue;
        }
      }
      doc = sanitize(doc);
      if (_.has(doc, 'created_at')) delete doc.created_at;
      let pid = await makeNextPid(db);
      doc.p_id = pid;
      await db.Patient.create(doc);
    }
    return { status: 200, body: { total_docs: docs.length, docs } };
  } catch (err) {
    console.error(`[UTILS] Error @ ImportPatientsHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

PatientUtils.prototype.NewPatientHandler = NewPatientHandler;
PatientUtils.prototype.AllPatientHandler = AllPatientHandler;
PatientUtils.prototype.GetPatientHandler = GetPatientHandler;
PatientUtils.prototype.BulkPatientsHandler = BulkPatientsHandler;
PatientUtils.prototype.GetDistinctAreasHandler = GetDistinctAreasHandler;
PatientUtils.prototype.UpdatePatientHandler = UpdatePatientHandler;
PatientUtils.prototype.SearchPatientHandler = SearchPatientHandler;
PatientUtils.prototype.ImportPatientsHandler = ImportPatientsHandler;

module.exports = new PatientUtils();
