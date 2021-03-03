'use strict';
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
      if (key === "p_id" || doc[key] === null || doc[key] === undefined || doc[key] === "") delete doc[key];
    }
    const db = await dbUtils.connect();
    // doc.p_id = doc.name.replace(/\s/g, '').split('.').filter(word => word.length > 2)[0].slice(0, 3) + doc.contact.toString().slice(-4);
    var pid = await makeNextPid(db);
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
    var instances = await db.Patient.countAll();
    if (instances < 1) {
      console.log(`[UTILS] AllPatientHandler returns empty data`);
      return { status: 204, body: {} };
    } else {
      if (count) {
        console.log(`[UTILS] AllPatientHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        var docs = await db.Patient.getAll();
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
    if (!doc) {
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

async function GetDistinctAreasHandler() {
  try {
    const db = await dbUtils.connect();
    var areas = await db.Patient.getDistinctArea();
    if (!areas || areas.length < 1) {
      console.log(`[UTILS] GetDistinctAreasHandler returns empty data`);
      return { status: 204, body: {} };
    } else {
      console.log(`[UTILS] GetDistinctAreasHandler success`);
      return { status: 200, body: areas };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ GetDistinctAreasHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function UpdatePatientHandler(pid, doc) {
  try {
    for (let key in doc) {
      if (key === "p_id" || doc[key] === null || doc[key] === undefined || doc[key] === "") {
        delete doc[key];
      }
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
    var docs = await db.Patient.findByName(term);
    if (!docs || docs.length < 1) {
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
    var docs = await db.Patient.findByArea(term);
    if (!docs || docs.length < 1) {
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
      var docs = await db.Patient.findByContact(parseInt(term));
      if (!docs || docs.length < 1) {
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

PatientUtils.prototype.NewPatientHandler = NewPatientHandler;
PatientUtils.prototype.AllPatientHandler = AllPatientHandler;
PatientUtils.prototype.GetPatientHandler = GetPatientHandler;
PatientUtils.prototype.GetDistinctAreasHandler = GetDistinctAreasHandler;
PatientUtils.prototype.UpdatePatientHandler = UpdatePatientHandler;
PatientUtils.prototype.SearchPatientHandler = SearchPatientHandler;

module.exports = new PatientUtils();