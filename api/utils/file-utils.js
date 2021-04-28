'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const XLSX = require('xlsx');
const PatientUtils = require('./patient-utils');
const TreatmentUtils = require('./treatment-utils');
const AppointmentUtils = require('./appointment-utils');

const STATUS_AS_WORDS = ["Cancelled", "Scheduled", "Completed", "Postponed"];

function FileUtils() { }

function fitForXls(doc) {
  let fitObj = new Object(doc);
  // w.r.t Patient
  if (!_.isNil(doc.dob)) {
    fitObj.dob = new Date(doc.dob).toISOString();
  }
  if (!_.isNil(doc.med_history) && !_.isEmpty(doc.med_history)) {
    fitObj.med_history = doc.med_history.join(',');
  }
  if (!_.isNil(doc.current_meds) && !_.isEmpty(doc.current_meds)) {
    fitObj.current_meds = doc.current_meds.join(',');
  }
  if (!_.isNil(doc.files) && !_.isEmpty(doc.files)) {
    fitObj.files = doc.files.join(',');
  }

  // w.r.t Treatment
  if (!_.isNil(doc.teeth_number)) {
    fitObj.teeth_number = doc.teeth_number.join(',');
  }
  if (!_.isNil(doc.treatment_date)) {
    fitObj.treatment_date = new Date(doc.treatment_date).toISOString();
  }

  // w.r.t Appointment
  if (!_.isNil(doc.appointment_date)) {
    fitObj.appointment_date = new Date(doc.appointment_date).toISOString();
  }
  if (!_.isNil(doc.status)) {
    fitObj.status = STATUS_AS_WORDS[doc.status];
  }

  fitObj.created_at = doc.created_at.toISOString();
  delete fitObj._id, fitObj.__v;
  return fitObj;
}

function fitForDB(doc) {
  let fitObj = new Object(doc);
  // w.r.t Patient
  if (!_.isNil(doc.dob)) {
    fitObj.dob = new Date(doc.dob);
  }
  if (!_.isNil(doc.med_history) && _.isString(doc.med_history)) {
    fitObj.med_history = doc.med_history.split(',');
  }
  if (!_.isNil(doc.current_meds) && _.isString(doc.current_meds)) {
    fitObj.current_meds = doc.current_meds.split(',');
  }
  if (!_.isNil(doc.files) && _.isString(doc.files)) {
    fitObj.files = doc.files.split(',');
  }
  if (!_.isNil(doc.age) && _.isFinite(parseInt(doc.age))) {
    fitObj.age = parseInt(fitObj.age);
  }
  if (!_.isNil(doc.contact)) {
    fitObj.contact = parseInt(doc.contact);
  }

  // w.r.t Treatment
  if (!_.isNil(doc.teeth_number)) {
    fitObj.teeth_number = doc.teeth_number.split(',').map(n => parseInt(n, 10));
  }
  if (!_.isNil(doc.treatment_date)) {
    fitObj.treatment_date = new Date(doc.treatment_date);
  }

  // w.r.t Appointment
  if (!_.isNil(doc.appointment_date)) {
    fitObj.appointment_date = new Date(doc.appointment_date);
  }
  if (!_.isNil(doc.status) && _.includes(STATUS_AS_WORDS, doc.status)) {
    fitObj.status = _.indexOf(STATUS_AS_WORDS, doc.status);
  }

  return fitObj;
}

async function createXlsFile(outFile, docs, keys) {
  let workbook = XLSX.utils.book_new();
  let data = XLSX.utils.json_to_sheet(docs, { header: keys });
  XLSX.utils.book_append_sheet(workbook, data, "Sheet1");
  await XLSX.writeFileSync(workbook, outFile);
}

function ImportXlsHandler(filename, type) {
  try {
    if (!_.includes(["Patient", "Treatment", "Appointment"], type)) {
      console.error(`[UTILS] Invalid type @ ImportXlsHandler \n ${type}`);
      return { status: 400, body: null };
    }
    if (filename.split('.')[1].toLowerCase() !== "xlsx" && filename.split('.')[1].toLowerCase() !== "xls") {
      throw "Not an excel workbook";
    }
    let inPath = path.join(__dirname, '..', '..', 'data');
    let inFile = path.join(inPath, filename);
    if (!fs.existsSync(inFile)) {
      console.error("[UTILS] Mentioned File not found");
      return { status: 404, body: null };
    }
    let workbook = XLSX.readFile(inFile);
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const docs = data.map(fitForDB);

    switch (type) {
      case "Patient":
        return PatientUtils.ImportPatientsHandler(docs);
      case "Treatment":
        return TreatmentUtils.ImportTreatmentsHandler(docs);
      case "Appointment":
        return AppointmentUtils.ImportAppointmentsHandler(docs);
      default:
        console.error(`[UTILS] Invalid type @ ImportXlsHandler \n ${type}`);
        return { status: 400, body: null };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ ImportXlsHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function ExportPatientsAsXls(outFile) {
  try {
    let keys = [
      "p_id", "name", "dob", "age", "area",
      "gender", "address", "contact", "med_history",
      "current_meds", "files", "created_at"
    ];

    const { status, body } = await PatientUtils.AllPatientHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = _.chain(body.docs).sortBy(o => o.created_at).map(fitForXls).value();
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportPatientsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportPatientsAsXls \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function ExportTreatmentsAsXls(outFile) {
  try {
    let keys = [
      "t_id", "p_id", "procedure_done", "teeth_number",
      "treatment_date", "doctor", "remarks", "created_at"
    ];

    const { status, body } = await TreatmentUtils.AllTreatmentHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = _.chain(body.docs).sortBy(o => o.created_at).map(fitForXls).value();
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportTreatmentsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportTreatmentsAsXls \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function ExportAppointmentsAsXls(outFile) {
  try {
    let keys = [
      "app_id", "p_id", "appointment_date",
      "doctor", "status", "room", "created_at"
    ];

    const { status, body } = await AppointmentUtils.AllAppointmentHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = _.chain(body.docs).sortBy(o => o.created_at).map(fitForXls).value();
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportAppointmentsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportAppointmentsAsXls \n ${JSON.stringify(err)}`);
    throw err;
  }
}

function ExportXlsHandler(type) {
  if (!_.includes(["Patient", "Treatment", "Appointment"], type)) {
    console.error(`[UTILS] Invalid type @ ExportXlsHandler \n ${type}`);
    return { status: 400, body: null };
  }

  let monthYear = new Date().toLocaleString('default', { month: "short", year: "numeric" });
  let outPath = path.join(__dirname, '..', '..', 'data');
  let outFile;

  if (type === "Patient") {
    outFile = path.join(outPath, `Patient List(${monthYear}).xls`);
    return ExportPatientsAsXls(outFile);
  } else if (type === "Treatment") {
    outFile = path.join(outPath, `Treatment List(${monthYear}).xls`);
    return ExportTreatmentsAsXls(outFile);
  } else {
    outFile = path.join(outPath, `Appointment List(${monthYear}).xls`);
    return ExportAppointmentsAsXls(outFile);
  }
}

FileUtils.prototype.ImportXlsHandler = ImportXlsHandler;
FileUtils.prototype.ExportXlsHandler = ExportXlsHandler;
FileUtils.prototype.ExportPatientsAsXls = ExportPatientsAsXls;
FileUtils.prototype.ExportTreatmentsAsXls = ExportTreatmentsAsXls;
FileUtils.prototype.ExportAppointmentsAsXls = ExportAppointmentsAsXls;

module.exports = new FileUtils();
