'use strict';
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const PDF = require('pdfkit');
const dbUtils = require('./db-utils');
const posx = require('../coordinates.json');
const config = require('../config.json')[process.env.NODE_ENV ?? "development"];

function InvoiceUtils() { }

function makeNextInvid(db) {
  /**
   * Checks database and generates next invoice id.
   *
   * @version 3.1.2
   * @param {Object} db The connection to the database.
   * @returns {String} The invoice id generated.
   * @exception {Object} err The error object.
   */
  return new Promise((resolve, reject) => {
    db.Invoice.getLatestInvid()
      .then(top => {
        top = top && top[0] && top[0]?.inv_id
          ? parseInt(top[0].inv_id.replace('INV', ''))
          : null;
        if (top) {
          let invid = top < 1000
            ? "INV" + ("0000" + (top + 1).toString()).slice(-4)
            : "INV" + (top + 1).toString();
          return resolve(invid);
        } else {
          return resolve('INV0001');
        }
      })
      .catch(err => {
        console.error(`[UTILS] Error @ makeNextInvId \n ${JSON.stringify(err)}`);
        return reject(err);
      });
  });
}

function generatePdf(invoiceObj) {
  /**
   * Generates a PDF for an invoice object.
   *
   * @version 3.1.2
   * @param {Object} invoiceObj The inovice object.
   * @returns {String} Returns the absolute path of the PDF.
   * @example
   * invoiceObj sample keys
   * {
   *   inv_id,
   *   payment_method,
   *   payment_id,
   *   sub_total,
   *   grand_total,
   *   doctor: [],
   *   patient: {
   *     p_id,
   *     name,
   *     gender,
   *     age,
   *     contact
   *   }
   *   treatments: [
   *     {
   *       procedure_done,
   *       treatment_date,
   *       tooth_number,
   *       cost,
   *       qty,
   *       total
   *     }
   *   ],
   *   created_at
   * }
   */
  const outPath = path.join(__dirname, '..', '..', 'invoice');
  const miscPath = path.join(__dirname, '..', '..', 'misc');
  const outFile = path.resolve(path.join(outPath, invoiceObj.inv_id + '.pdf'));
  let doc = new PDF();

  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
  doc.pipe(fs.createWriteStream(outFile));

  // LOGO
  doc.image(path.join(miscPath, 'logo.png'), 60, 60, {
    fit: [70, 50],
    align: 'left',
    valign: 'center'
  });

  // BANNER
  doc.save()
    .moveTo(posx.table.head.banner_up.x, posx.table.head.banner_up.y)
    .lineTo(posx.table.head.banner_up.x, posx.table.head.banner_down.y)
    .lineTo(posx.table.head.banner_down.x, posx.table.head.banner_down.y)
    .lineTo(posx.table.head.banner_down.x, posx.table.head.banner_up.y)
    .fill('#0063A3').save() // HEADER MARGIN
    .moveTo(posx.table.foot.left_x, posx.table.foot.y)
    .lineTo(posx.table.foot.right_x, posx.table.foot.y)
    .fill('#CCC'); // FOOTER MARGIN

  // 20 BOLD BLUE
  doc
    .font(path.join(miscPath, 'ProximaNova-Bold.ttf'))
    .fontSize(20)
    .fill('#0063A3')
    .text(config.CLINIC_NAME ?? "JD CLINIC", posx.header.title.x, posx.header.title.y)
    .text("INVOICE", posx.header.invoice.x, posx.header.invoice.y);

  // 12 REGULAR BLACK
  doc.font(path.join(miscPath, 'ProximaNova-Regular.ttf')).fontSize(12).fill('#000')
    .text(config.CLINIC_ADDRESS_LINE_1 ?? "1, Doe Road", posx.header.address.x, posx.header.address.line_1_y)
    .text(config.CLINIC_ADDRESS_LINE_2 ?? "90000 90000", posx.header.address.x, posx.header.address.line_2_y)
    .text(config.CLINIC_ADDRESS_LINE_3 ?? "john@doe.com", posx.header.address.x, posx.header.address.line_3_y)
    .text(invoiceObj.payment_method ?? null, posx.payment.method.x, posx.payment.method.y)
    .text(invoiceObj.payment_id ?? null, posx.payment.id.x, posx.payment.id.y);

  invoiceObj.treatments.forEach((trt, ind) => {
    let currentHeight = posx.table.body.base_proc.y + 60 * ind;
    doc
      .text(trt.procedure_done, posx.table.body.base_proc.x, currentHeight, {
        width: posx.table.body.base_proc.max_width,
        height: posx.table.body.base_proc.max_height
      })
      .text(!_.isNil(trt.treatment_date)
        ? new Date(trt.treatment_date).toLocaleString("default", { day: "numeric", month: "short", year: "numeric" })
        : null
      )
      .text(!_.isNil(trt.teeth_number) && !_.isEmpty(trt.teeth_number) ? `Teeth: ${trt.teeth_number.join(',')}` : null)
      .text(trt.cost, posx.table.body.cost.x, currentHeight, { width: posx.table.body.cost.max_width })
      .text(trt.qty, posx.table.body.qty.x, currentHeight, { width: posx.table.body.qty.max_width })
      .text(!_.isNil(trt.total)
        ? parseFloat(trt.total).toFixed(2)
        : null,
        posx.table.body.total.x, currentHeight, { width: posx.table.body.total.max_width }
      );
  });

  // 14 REGULAR BLACK
  doc.fontSize(14)
    .text(`${invoiceObj.patient.name}`, posx.data.patient.name.x, posx.data.patient.name.y)
    .text(`${invoiceObj.patient.age} / ${invoiceObj.patient.gender}`)
    .text(invoiceObj.patient.contact)
    .text("Doctor:", posx.data.doctor.x, posx.data.doctor.y)
    .text("Sub Total: Rs.", posx.total_foot.x, posx.total_foot.sub_y)
    .text("Grand Total: Rs.", posx.total_foot.x, posx.total_foot.grand_y)
    .fontSize(10) // 10 REGULAR BLACK (SUB TEXT)
    .text(
      `Generated on ${invoiceObj.created_at.toLocaleString("default", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
      })}`,
      posx.data.date.x, posx.data.date.y, { align: "center" }
    );

  // 14 SEMIBOLD BLACK
  doc.fontSize(14).font(path.join(miscPath, 'ProximaNova-Semibold.ttf'))
    .text(invoiceObj.doctor.join(', '), posx.data.doctor.name_x, posx.data.doctor.y)
    .text(invoiceObj.patient.p_id, posx.data.patient.pid.x, posx.data.patient.pid.y, { align: 'right' })
    .text(!_.isNil(invoiceObj.sub_total)
      ? parseFloat(invoiceObj.sub_total).toFixed(2)
      : null,
      0, posx.total_foot.sub_y, { align: 'right' }
    )
    .text(!_.isNil(invoiceObj.grand_total)
      ? parseFloat(invoiceObj.grand_total).toFixed(2)
      : null,
      0, posx.total_foot.grand_y, { align: 'right' }
    )
    .fontSize(16).text(invoiceObj.inv_id, posx.data.invoice.x, posx.data.invoice.y, { align: 'right' }) // 16 SEMIBOLD BLACK
    .fontSize(12) // 12 SEMIBOLD BLACK
    .text("Payment Method:", posx.payment.method.name_x, posx.payment.method.y)
    .text("Payment ID:", posx.payment.id.name_x, posx.payment.id.y)
    .fill('#FFF') // 12 SEMIBOLD WHITE
    .text("TOTAL", posx.table.head.total_x, posx.table.head.y)
    .text("QTY", posx.table.head.qty_x, posx.table.head.y)
    .text("COST", posx.table.head.cost_x, posx.table.head.y)
    .text("PROCEDURE", posx.table.head.proc_x, posx.table.head.y);

  doc.end();
  return outFile;
}

function sanitize(doc) {
  /**
   * Creates a sanitized object, fit for the db.
   *
   * @version 3.1.2
   * @returns {Object} cleanObj The sanitized object.
   */
  let cleanObj = new Object(doc);
  for (let key in cleanObj) {
    if (key === "inv_id" || _.isNil(cleanObj[key])) delete cleanObj[key];
  }
  if (!_.isNil(cleanObj.sub_total) && _.isFinite(cleanObj.sub_total) && _.isInteger(cleanObj.sub_total)) {
    cleanObj.sub_total = parseFloat(cleanObj.sub_total);
  }
  if (!_.isNil(cleanObj.grand_total) && _.isFinite(cleanObj.grand_total) && _.isInteger(cleanObj.grand_total)) {
    cleanObj.grand_total = parseFloat(cleanObj.grand_total);
  }
  return cleanObj;
}

async function NewInvoiceHandler(pid, body) {
  /**
   * Handles request to create new invoice.
   *
   * @version 3.1.2
   * @param {String} pid The patient id for the invoice.
   * @param {Object} body The document containing invoice details.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let invoiceObj = {
      p_id: pid,
      doctor: _.chain(body.treatments).map('doctor').uniq().value(),
      treatments: body.treatments.map(JSON.stringify),
      payment_method: _.has(body, "payment_method") ? body.payment_method : null,
      payment_id: _.has(body, "payment_id") ? body.payment_id : null,
      sub_total: _.has(body, "sub_total") ? body.sub_total : null,
      discount: _.has(body, "discount") ? body.discount : null,
      grand_total: _.has(body, "grand_total") ? body.grand_total : null
    };
    invoiceObj = sanitize(invoiceObj);
    invoiceObj.inv_id = await makeNextInvid(db);
    await db.Invoice.create(invoiceObj);
    console.log(`[UTILS] NewInvoiceHandler success`);
    return { status: 201, body: invoiceObj };
  } catch (err) {
    console.error(`[UTILS] Error @ NewInvoiceHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function AllInvoiceHandler(count = false) {
  /**
   * Handles request to list all invoice documents.
   *
   * @version 3.1.2
   * @param {Boolean} count When true, only count of documents is returned.
   * @returns {Object} Returns the HTTP status and the invoice documents fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let instances = await db.Invoice.countAll();
    if (instances < 1) {
      // No invoices found
      console.log(`[UTILS] AllInvoiceHandler returns empty data`);
      return { status: 204, body: {} };
    } else {
      if (count) {
        console.log(`[UTILS] AllInvoiceHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        let docs = await db.Invoice.getAll();
        _.chain(docs)
          .map(doc => {
            return _.set(doc, 'treatments', _.map(doc.treatments, JSON.parse));
          })
          .value();
        console.log(`[UTILS] AllInvoiceHandler success`);
        return { status: 200, body: { total_docs: instances, docs } };
      }
    }
  } catch (err) {
    console.error(`[UTILS] Error @ AllInvoiceHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function GetInvoiceHandler(invid) {
  /**
   * Handles request to get invoice document.
   *
   * @version 3.1.2
   * @param {Stirng} invid The invoice id to be fetched.
   * @returns {Object} Returns the HTTP status and the document fetched.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let doc = await db.Invoice.getByInvid(invid);
    if (_.isNil(doc) || _.isEmpty(doc)) {
      console.log(`[UTILS] GetInvoiceHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      console.log(`[UTILS] GetInvoiceHandler success`);
      return { status: 200, body: doc };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ GetInvoiceHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

async function PrintInvoiceHandler(invid) {
  /**
   * Handles request to return PDF of an invoice.
   *
   * @version 3.1.2
   * @param {String} invid The invoice id to print.
   * @returns {Object} Returns the HTTP status and the location of created file.
   * @throws {Object} Throws the error object.
   */
  try {
    const db = await dbUtils.connect();
    let doc = await db.Invoice.getByInvid(invid);
    doc.treatments = doc.treatments.map(JSON.parse);
    doc.patient = await db.Patient.getByPid(doc.p_id);
    let outFile = await generatePdf(doc);
    await dbUtils.close();
    return { status: 201, body: { file: outFile } };
  } catch (err) {
    console.error(`[UTILS] Error @ PrintInvoiceHandler \n ${JSON.stringify(err)}`);
    throw err;
  }
}

InvoiceUtils.prototype.NewInvoiceHandler = NewInvoiceHandler;
InvoiceUtils.prototype.AllInvoiceHandler = AllInvoiceHandler;
InvoiceUtils.prototype.GetInvoiceHandler = GetInvoiceHandler;
InvoiceUtils.prototype.PrintInvoiceHandler = PrintInvoiceHandler;

module.exports = new InvoiceUtils();
