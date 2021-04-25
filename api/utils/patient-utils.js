'use strict';
const _ = require('lodash');
const dbUtils = require('./db-utils');

function PatientUtils() { }

function makeNextPid(db) {
  return new Promise((resolve, reject) => {
    db.Patient.getLatestPid()
      .then(top => {
        top = top[0] && top[0]?.p_id
          ? parseInt(top[0].p_id.replace('PAT', ''))
          : null;
        if (top) {
          let pid = top < 1000
            ? "PAT" + ("0000" + (top + 1).toString()).slice(-4)
            : "PAT" + (top + 1).toString();
          return resolve(pid);
        } else {
          return resolve('PAT0001');
        }
      })
      .catch(err => {
        console.error(`[UTILS] Error @ makeNextAid \n ${JSON.stringify(err)}`);
        return reject(err);
      });
  });
}

async function NewPatientHandler(doc) {
  try {
    for (let key in doc) {
      if (_.isNil(doc[key]) || key === "p_id") delete doc[key];
    }
    const db = await dbUtils.connect();
    // doc.p_id = doc.name.replace(/\s/g, '').split('.').filter(word => word.length > 2)[0].slice(0, 3) + doc.contact.toString().slice(-4);
    let pid = await makeNextPid(db);
    doc.p_id = pid;
    await db.Patient.create(doc);
    console.log(`[UTILS] NewPatientHandler success`);
    return { status: 201, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ NewPatientHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function AllPatientHandler(count = false) {
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
    return err;
  }
}

async function GetPatientHandler(pid) {
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
    return err;
  }
}

async function BulkPatientsHandler(pidList) {
  try {
    const db = await dbUtils.connect();
    const docs = await db.Patient.getByPidList(pidList);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] BulkPatientsHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      console.log(`[UTILS] BulkPatientsHandler success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ BulkPatientsHandler`);
  }
}

async function GetDistinctAreasHandler() {
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
    return err;
  }
}

async function UpdatePatientHandler(pid, doc) {
  try {
    for (let key in doc) {
      if (_.isNil(doc[key]) || key === "p_id") delete doc[key];
    }
    const db = await dbUtils.connect();
    await db.Patient.updateDoc(pid, doc);
    console.log("[UTILS] UpdatePatientHandler success");
    return { status: 200, body: doc };
  } catch (err) {
    console.error(`[UTILS] Error @ UpdatePatientHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function SearchByName(term) {
  console.log("[UTILS] Searching for Name");
  try {
    const db = await dbUtils.connect();
    let docs = await db.Patient.findByName(term);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] SearchByName returns empty data`);
      return { status: 404, body: null };
    } else {
      console.log(`[UTILS] SearchByName success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ SearchByName \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function SearchByArea(term) {
  console.log("[UTILS] Searching for Area");
  try {
    const db = await dbUtils.connect();
    let docs = await db.Patient.findByArea(term);
    if (_.isNil(docs) || _.isEmpty(docs)) {
      console.log(`[UTILS] SearchByArea returns empty data`);
      return { status: 404, body: null };
    } else {
      console.log(`[UTILS] SearchByArea success`);
      return { status: 200, body: { total_docs: docs.length, docs } };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ SearchByArea \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function SearchByContact(term) {
  console.log("[UTILS] Searching for Contact");
  try {
    if (isNaN(term)) {
      console.log(`[UTILS] Requested search term is not a number`);
      return { status: 400, body: null };
    } else {
      const db = await dbUtils.connect();
      let docs = await db.Patient.findByContact(parseInt(term));
      if (_.isNil(docs) || _.isEmpty(docs)) {
        console.log(`[UTILS] SearchByContact returns empty data`);
        return { status: 404, body: null };
      } else {
        console.log(`[UTILS] SearchByContact success`);
        return { status: 200, body: { total_docs: docs.length, docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ SearchByContact \n ${JSON.stringify(err)}`);
    return err;
  }
}

function SearchPatientHandler(term, type) {
  switch (type) {
    case "name":
      return SearchByName(term);
    case "area":
      return SearchByArea(term);
    case "contact":
      return SearchByContact(term);
    default:
      console.log(`[UTILS] Unexpected search type ${type}`);
      return { status: 400, body: null };
  }
}

async function ImportPatientsHandler(docs) {
  try {
    const db = await dbUtils.connect();
    for (let doc of docs) {
      if (!_.isNil(doc.p_id)) {
        let existing = await db.Patient.getByPid(doc.p_id);
        if (!_.isEqual(existing, doc)) {
          await db.Patient.updateDoc(existing.p_id, doc);
        }
      } else {
        if (!_.isNil(doc.created_at)) delete doc.created_at;
        let pid = await makeNextPid(db);
        doc.p_id = pid;
        await db.Patient.create(doc);
      }
    }
    return { status: 200, body: null };
  } catch (err) {
    console.error(`[UTILS] Error @ ImportPatientsHandler \n ${JSON.stringify(err)}`);
    return err;
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
