'use strict';
const dbUtils = require('./db-utils');
const fs = require('fs');
const path = require('path');
const xls = require('json2xls');

function FileUtils() {}

function fitForXls(doc) {
  var fitObj = new Object(doc);
  fitObj.dob = doc.dob
    ? new Date(doc.dob).toISOString()
    : null;
  fitObj.med_history = doc.med_history && doc.med_history.length
    ? doc.med_history.join(',')
    : null;
  fitObj.current_meds = doc.current_meds && doc.current_meds.length
    ? doc.current_meds.join(',')
    : null;
  fitObj.files = doc.files && doc.files.length
    ? doc.files.join(',')
    : null;
  fitObj.created_at = doc.created_at.toISOString();
  delete fitObj._id, fitObj.__v;
  return fitObj;
}

async function ExportPatientsHandler() {
  try {
    let monthYear = new Date().toLocaleString('default', { month: "short", year: "numeric" });
    let outPath = path.join(__dirname, '..', '..', 'data'),
        outFile = path.join(outPath, `Patient List(${monthYear}).xls`);
    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath);
    }
    let keys = [
      "p_id","name","dob","age","area",
      "gender","address","contact","med_history",
      "current_meds","files","created_at"
    ];
    const db = await dbUtils.connect();
    var docs = await db.Patient.getAll();
    await dbUtils.close();
    docs = docs.map(fitForXls);
    const data = xls(docs, { fields: keys });
    await fs.writeFileSync(outFile, data, 'binary');
    console.log(`[UTILS] ExportPatientsHandler success`);
    return { status: 200, body: { file: outFile } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportPatientsHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

FileUtils.prototype.ExportPatientsHandler = ExportPatientsHandler;

module.exports = new FileUtils();