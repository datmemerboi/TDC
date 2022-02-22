'use strict';
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const XLSX = require('xlsx');

const PatientUtils = require('./patient-utils');
const InvoiceUtils = require('./invoice-utils');
const TreatmentUtils = require('./treatment-utils');
const AppointmentUtils = require('./appointment-utils');

const STATUS_AS_WORDS = ['Cancelled', 'Scheduled', 'Completed', 'Postponed'];

function FileUtils() {}

function fitForXls(doc) {
  /**
   * Creates an object fit for XLS file.
   *
   * @version 3.1.2
   * @param {Object} doc The document to be altered.
   * @returns {Object} Returns the fit object.
   */
  let fitObj = _.cloneDeep(doc);
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
  if (!_.isNil(doc.teeth_number) && !_.isEmpty(doc.teeth_number)) {
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
  if (_.isNil(fitObj.created_at) || _.isFinite(fitObj.created_at)) {
    fitObj.created_at = doc.created_at.toISOString();
  }

  // w.r.t Invoice
  if (!_.isNil(doc.treatments) && !_.isEmpty(doc.treatments) && Array.isArray(doc.treatments)) {
    fitObj.treatments = doc.treatments.join('|');
  }

  _.omit(fitObj, '_id');
  _.omit(fitObj, '__v');

  return fitObj;
}

function fitForDB(doc) {
  /**
   * Creates an object fit for the db.
   *
   * @version 3.1.2
   * @param {Object} doc The document to be altered.
   * @returns {Object} Returns the fit object.
   */
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
  if (!_.isNil(doc.contact) && !_.isEmpty(doc.contact)) {
    fitObj.contact = parseInt(doc.contact);
  }

  // w.r.t Treatment
  if (!_.isNil(doc.teeth_number) && !_.isEmpty(doc.teeth_number)) {
    fitObj.teeth_number = doc.teeth_number
      .split(',')
      .map((n) => (!isNaN(parseInt(n, 10)) ? parseInt(n, 10) : null));
  }
  if (!_.isNil(doc.treatment_date) && !_.isEmpty(doc.treatment_date)) {
    fitObj.treatment_date = new Date(doc.treatment_date);
  }

  // w.r.t Appointment
  if (!_.isNil(doc.appointment_date) && !_.isEmpty(doc.appointment_date)) {
    fitObj.appointment_date = new Date(doc.appointment_date);
  }
  if (!_.isNil(doc.status) && _.includes(STATUS_AS_WORDS, doc.status)) {
    fitObj.status = _.indexOf(STATUS_AS_WORDS, doc.status);
  }

  // w.r.t Invoice
  if (!_.isNil(doc.treatments) && !_.isEmpty(doc.treatments)) {
    fitObj.treatments = doc.treatments.split('|').filter((t) => !_.isEmpty(t));
  }

  return fitObj;
}

async function createXlsFile(outFile, docs, keys) {
  /**
   * Creates an XLS file for a list of documents.
   *
   * @version 3.1.2
   * @param {Path} outFile The output file path.
   * @param {Array} docs The list of documents to convert into XLS.
   * @param {Array} keys The list of column keys.
   * @returns {Function} Returns the writeFileSync function.
   */
  _.chain(docs)
    .map((doc) => _.pick(doc, keys))
    .value(); // Removing fields not present in keys
  let workbook = XLSX.utils.book_new();
  let data = XLSX.utils.json_to_sheet(docs, { header: keys });
  XLSX.utils.book_append_sheet(workbook, data, 'Sheet1');
  return await XLSX.writeFileSync(workbook, outFile);
}

function ImportXlsHandler(filename, type) {
  /**
   * Handles request to import data from XLS file.
   *
   * @version 3.1.3
   * @param {String} filename The filename to be imported (located in data/ folder).
   * @param {String} type The type of data contained in the file (Patient/Treatment/Appointment)
   * @returns {Function} Returns the import function according to the type.
   * @throws {Object} Throws the error object.
   */
  try {
    if (!_.includes(['Patient', 'Treatment', 'Appointment', 'Invoice'], type)) {
      console.error(`[UTILS] Invalid type @ ImportXlsHandler \n ${type}`);
      return { status: 400, body: null };
    }
    if (
      filename.split('.')[1].toLowerCase() !== 'xlsx' &&
      filename.split('.')[1].toLowerCase() !== 'xls'
    ) {
      throw 'Not an excel workbook';
    }
    let inPath = path.join(__dirname, '..', '..', 'data');
    let inFile = path.join(inPath, filename);
    if (!fs.existsSync(inFile)) {
      console.error('[UTILS] Mentioned File not found');
      return { status: 404, body: null };
    }
    let workbook = XLSX.readFile(inFile);
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const docs = data.map(fitForDB);

    switch (type) {
      case 'Patient':
        return PatientUtils.ImportPatientsHandler(docs);
      case 'Treatment':
        return TreatmentUtils.ImportTreatmentsHandler(docs);
      case 'Appointment':
        return AppointmentUtils.ImportAppointmentsHandler(docs);
      case 'Invoice':
        return InvoiceUtils.ImportInvoicesHandler(docs);
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
  /**
   * Exports all patient documents into XLS file.
   *
   * @version 3.1.2
   * @param {Path} outFile The output file path.
   * @returns {Object} Returns the HTTP status and the count of documents.
   * @throws {Object} Throws the error object.
   */
  try {
    let keys = [
      'p_id',
      'name',
      'dob',
      'age',
      'area',
      'gender',
      'address',
      'contact',
      'med_history',
      'current_meds',
      'files',
      'created_at'
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
    throw err;
  }
}

async function ExportTreatmentsAsXls(outFile) {
  /**
   * Exports all treatment documents into XLS file.
   *
   * @version 3.1.2
   * @param {Path} outFile The output file path.
   * @returns {Object} Returns the HTTP status and the count of documents.
   * @throws {Object} Throws the error object.
   */
  try {
    let keys = [
      't_id',
      'p_id',
      'procedure_done',
      'teeth_number',
      'treatment_date',
      'doctor',
      'remarks',
      'created_at'
    ];

    const { status, body } = await TreatmentUtils.AllTreatmentHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = _.chain(body.docs).sortBy('created_at').map(fitForXls).value();
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportTreatmentsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportTreatmentsAsXls \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function ExportAppointmentsAsXls(outFile) {
  /**
   * Exports all appointment documents into XLS file.
   *
   * @version 3.1.2
   * @param {Path} outFile The output file path.
   * @returns {Object} Returns the HTTP status and the count of documents.
   * @throws {Object} Throws the error object.
   */
  try {
    let keys = ['app_id', 'p_id', 'appointment_date', 'doctor', 'status', 'room', 'created_at'];

    const { status, body } = await AppointmentUtils.AllAppointmentHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = _.chain(body.docs).sortBy('created_at').map(fitForXls).value();
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportAppointmentsAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportAppointmentsAsXls \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function ExportInvoiceAsXls(outFile) {
  /**
   * Exports all invoice records into XLS file.
   *
   * @version 3.1.2
   * @param {Path} outFile The output file path.
   * @returns {Object} Returns the HTTP status and the count of documents.
   * @throws {Object} Throws the error object.
   */
  try {
    let keys = [
      'inv_id',
      'p_id',
      'treatments',
      'doctor',
      'payment_method',
      'payment_id',
      'sub_total',
      'discount',
      'grand_total',
      'created_at'
    ];

    const { status, body } = await InvoiceUtils.AllInvoiceHandler();
    if (status !== 200 || _.isEmpty(body.docs)) {
      console.log(`[UTILS] Empty response from db`);
      return { status: 204, body: null };
    }
    let docs = _.chain(body.docs).sortBy('created_at').map(fitForXls).value();
    await createXlsFile(outFile, docs, keys);

    console.log(`[UTILS] ExportInvoiceAsXls success`);
    return { status: 200, body: { total_docs: docs.length } };
  } catch (err) {
    console.error(`[UTILS] Error @ ExportInvoiceAsXls \n ${JSON.stringify(err)}`);
    throw err;
  }
}

function ExportXlsHandler(type) {
  /**
   * Handles request to export documents into XLS.
   *
   * @version 3.1.2
   * @param {String} type The type of data to export (Patient/Treatment/Appointment).
   * @returns {Function} Returns the export function according to the type.
   */
  if (!_.includes(['Patient', 'Treatment', 'Appointment', 'Invoice'], type)) {
    console.error(`[UTILS] Invalid type @ ExportXlsHandler \n ${type}`);
    return { status: 400, body: null };
  }

  let monthYear = new Date().toLocaleString('default', {
    month: 'short',
    year: 'numeric'
  });
  let outPath = path.join(__dirname, '..', '..', 'data');
  let outFile;

  switch (type) {
    case 'Patient': {
      outFile = path.join(outPath, `Patient List (${monthYear}).xls`);
      return ExportPatientsAsXls(outFile);
    }
    case 'Treatment': {
      outFile = path.join(outPath, `Treatment List (${monthYear}).xls`);
      return ExportTreatmentsAsXls(outFile);
    }
    case 'Appointment': {
      outFile = path.join(outPath, `Appointment List (${monthYear}).xls`);
      return ExportAppointmentsAsXls(outFile);
    }
    case 'Invoice': {
      outFile = path.join(outPath, `Invoice List (${monthYear}).xls`);
      return ExportInvoiceAsXls(outFile);
    }
    default: {
      console.error(`[UTILS] Invalid type @ ExportXlsHandler \n ${type}`);
      return { status: 400, body: null };
    }
  }
}

async function ChangeDoctorsInConfig(req, res) {
  /**
   * Handles API request to change the list of doctors in
   * config file of React repo.
   *
   * @version 3.1.3
   * @param {Array} doctors The final list of doctors to be inserted into JSON.
   * @returns {Array | Null} The final array of doctors post modification.
   */
  if (_.isNil(req.body) || _.isEmpty(req.body) || !Array.isArray(req.body)) {
    return res.sendStatus(400).end();
  }
  try {
    let file = path.resolve(path.join(__dirname, '..', '..', '..', 'TDC-client', 'config.json'));
    let text = await fs.readFileSync(file);
    let jsonObj = JSON.parse(text);

    let doctors = req.body
      .map((d) => {
        if (!/^Dr(\.| )/gi.test(d)) {
          return 'Dr. ' + d;
        }
        return d;
      })
      .filter((d) => !jsonObj.DOCTORS.includes(d));

    jsonObj.DOCTORS = [...jsonObj.DOCTORS, ...doctors];

    await fs.writeFileSync(file, JSON.stringify(jsonObj, null, 2));
    console.log('[UTILS] ChangeDoctorsInConfig success');
    return res.status(200).json(jsonObj.DOCTORS).end();
  } catch (e) {
    console.error(`[UTILS] Error @ ChangeDoctorsInConfig \n ${JSON.stringify(e)}`);
    return res.sendStatus(500).end();
  }
}

FileUtils.prototype.ImportXlsHandler = ImportXlsHandler;
FileUtils.prototype.ExportXlsHandler = ExportXlsHandler;
FileUtils.prototype.ExportPatientsAsXls = ExportPatientsAsXls;
FileUtils.prototype.ExportTreatmentsAsXls = ExportTreatmentsAsXls;
FileUtils.prototype.ExportAppointmentsAsXls = ExportAppointmentsAsXls;
FileUtils.prototype.ChangeDoctorsInConfig = ChangeDoctorsInConfig;

module.exports = new FileUtils();
