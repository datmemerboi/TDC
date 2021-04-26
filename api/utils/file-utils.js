'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const XLSX = require('xlsx');
const PatientUtils = require('./patient-utils');
const TreatmentUtils = require('./treatment-utils');
const AppointmentUtils = require('./appointment-utils');

const STATUS_AS_WORDS = ["Cancelled", "Scheduled", "Completed", "Postponed"];

function FileUtils() {}

function fitForXls(doc) {
  let fitObj = new Object(doc);
  // w.r.t Patient
  fitObj.dob = !_.isNil(doc.dob)
    ? new Date(doc.dob).toISOString()
    : null;
  fitObj.med_history = !_.isNil(doc.med_history) && !_.isEmpty(doc.med_history)
    ? doc.med_history.join(',')
    : null;
  fitObj.current_meds = !_.isNil(doc.current_meds) && !_.isEmpty(doc.current_meds)
    ? doc.current_meds.join(',')
    : null;
  fitObj.files = !_.isNil(doc.files) && !_.isEmpty(doc.files)
    ? doc.files.join(',')
    : null;

  // w.r.t Treatment
  fitObj.teeth_number = !_.isNil(doc.teeth_number)
    ? doc.teeth_number.join(',')
    : null;
  fitObj.treatment_date = !_.isNil(doc.treatment_date)
    ? new Date(doc.treatment_date).toISOString()
    : null;

  // w.r.t Appointment
  fitObj.appointment_date = !_.isNil(doc.appointment_date)
    ? new Date(doc.appointment_date).toISOString()
    : null;
  fitObj.status = !_.isNil(doc.status)
    ? STATUS_AS_WORDS[doc.status]
    : null;

  fitObj.created_at = doc.created_at.toISOString();
  delete fitObj._id, fitObj.__v;
  return fitObj;
}

function fitForDB(doc) {
  let fitObj = new Object(doc);
  // w.r.t Patient
  fitObj.dob = !_.isNil(doc.dob)
    ? new Date(doc.dob)
    : null;
    fitObj.med_history = !_.isNil(doc.med_history)
    ? doc.med_history.split(',')
    : null;
  fitObj.current_meds = !_.isNil(doc.current_meds)
    ? doc.current_meds.split(',')
    : null;
  fitObj.files = !_.isNil(doc.files)
    ? doc.files.split(',')
    : null;
  fitObj.age = !_.isNil(doc.age) && _.isFinite(parseInt(doc.age))
    ? parseInt(fitObj.age)
    : null;
  fitObj.contact = !_.isNil(doc.contact)
    ? parseInt(doc.contact)
    : null;

  // w.r.t Treatment
  fitObj.teeth_number = !_.isNil(doc.teeth_number)
    ? doc.teeth_number.split(',').map(n => parseInt(n, 10))
    : null;
  fitObj.treatment_date = !_.isNil(doc.treatment_date)
    ? new Date(doc.treatment_date)
    : null;

  // w.r.t Appointment
  fitObj.appointment_date = !_.isNil(doc.appointment_date)
    ? new Date(doc.appointment_date)
    : null;
  fitObj.status = !_.isNil(doc.status) && _.includes(STATUS_AS_WORDS, doc.status)
    ? _.indexOf(STATUS_AS_WORDS, doc.status)
    : null;

  fitObj.created_at = new Date(doc.created_at);
  return fitObj;
}

async function createXlsFile(outFile, docs, keys) {
  try {
    let workbook = XLSX.utils.book_new();
    let data = XLSX.utils.json_to_sheet(docs, { header: keys });
    XLSX.utils.book_append_sheet(workbook, data, "Sheet1");
    await XLSX.writeFileSync(workbook, outFile);
    return true;
  } catch (err) {
    return err;
  }
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
    return err;
  }
}

async function ExportPatientsAsXls(outFile) {
  try {
    let keys = [
      "p_id","name","dob","age","area",
      "gender","address","contact","med_history",
      "current_meds","files","created_at"
    ];

    const { status, body } = await PatientUtils.AllPatientHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = body.docs.map(fitForXls);
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportPatientsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportPatientsAsXls \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function ExportTreatmentsAsXls(outFile) {
  try {
    let keys = [
      "t_id", "p_id","procedure_done","teeth_number",
      "treatment_date","doctor", "remarks","created_at"
    ];

    const { status, body } = await TreatmentUtils.AllTreatmentHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = body.docs.map(fitForXls);
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportTreatmentsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportTreatmentsAsXls \n ${JSON.stringify(err)}`);
    return err;
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
    let docs = body.docs.map(fitForXls);
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportAppointmentsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportAppointmentsAsXls \n ${JSON.stringify(err)}`);
    return err;
  }
}

function ExportXlsHandler(type) {
  try {
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
  } catch (err) {
    return err;
  }
}

FileUtils.prototype.ImportXlsHandler = ImportXlsHandler;
FileUtils.prototype.ExportXlsHandler = ExportXlsHandler;
FileUtils.prototype.ExportPatientsAsXls = ExportPatientsAsXls;
FileUtils.prototype.ExportTreatmentsAsXls = ExportTreatmentsAsXls;
FileUtils.prototype.ExportAppointmentsAsXls = ExportAppointmentsAsXls;

module.exports = new FileUtils();
