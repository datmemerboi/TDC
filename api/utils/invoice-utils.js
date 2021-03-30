'use strict';
const fs = require('fs'),
  path = require('path'),
  PDF = require('pdfkit'),
  dbUtils = require('./db-utils'),
  posx = require('../coordinates.json');

const config = require('../config.json')[process.env.NODE_ENV ?? "development"];

function InvoiceUtils() { }

function makeNextInvid(db) {
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
      .catch(err => reject(err));
  });
}

function generatePdf(obj) {
  /*
  obj = {
    inv_id,
    payment_method,
    payment_id,
    sub_total,
    grand_total,
    doctor: [],
    patient: {
      p_id,
      name,
      gender,
      age,
      contact
    }
    treatments: [
      {
        procedure_done,
        treatment_date,
        tooth_number,
        cost,
        qty,
        total
      }
    ]
  }
  */
  const outputPath = path.join(__dirname, '..', '..', 'invoice');
  const miscPath = path.join(__dirname, '..', '..', 'misc');
  const outputFile = path.join(outputPath, obj.inv_id + '.pdf');
  var doc = new PDF();

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  doc.pipe(fs.createWriteStream(outputFile));

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
    .text(obj.payment_method ?? null, posx.payment.method.x, posx.payment.method.y)
    .text(obj.payment_id ?? null, posx.payment.id.x, posx.payment.id.y);
  obj.treatments.forEach((trt, ind) => {
    let currentHeight = posx.table.body.base_proc.y + 64 * ind;
    doc
      .text(trt.procedure_done, posx.table.body.base_proc.x, currentHeight, {
        width: posx.table.body.base_proc.max_width,
        height: posx.table.body.base_proc.max_height
      })
      .text(trt.treatment_date ? new Date(trt.treatment_date).toLocaleString("default", { day: "numeric", month: "short", year: "numeric" }) : null)
      .text(trt.teeth_number && trt.teeth_number.length ? `Teeth: ${trt.teeth_number.join(',')}` : null)
      .text(trt.cost, posx.table.body.cost.x, currentHeight, { width: posx.table.body.cost.max_width })
      .text(trt.qty, posx.table.body.qty.x, currentHeight, { width: posx.table.body.qty.max_width })
      .text(trt.total?.toFixed(2) || null, posx.table.body.total.x, currentHeight, { width: posx.table.body.total.max_width });
  });

  // 14 REGULAR BLACK
  doc.fontSize(14)
    .text(`${obj.patient.name}`, posx.data.patient.name.x, posx.data.patient.name.y)
    .text(`${obj.patient.age} / ${obj.patient.gender}`)
    .text(obj.patient.contact)
    .text("Doctor:", posx.data.doctor.x, posx.data.doctor.y)
    .text(obj.invoice_date, posx.data.date.x, posx.data.date.y, { align: 'right' })
    .text("Sub Total: Rs.", posx.total_foot.x, posx.total_foot.sub_y)
    .text("Grand Total: Rs.", posx.total_foot.x, posx.total_foot.grand_y);

  // 14 SEMIBOLD BLACK
  doc.font(path.join(miscPath, 'ProximaNova-Semibold.ttf'))
    .text(obj.doctor.join(', '), posx.data.doctor.name_x, posx.data.doctor.y)
    .text(obj.patient.p_id, posx.data.patient.pid.x, posx.data.patient.pid.y, { align: 'right' })
    .text(obj.sub_total.toFixed(2), 0, posx.total_foot.sub_y, { align: 'right' })
    .text(obj.grand_total.toFixed(2), 0, posx.total_foot.grand_y, { align: 'right' })
    .fontSize(16).text(obj.inv_id, posx.data.invoice.x, posx.data.invoice.y, { align: 'right' }) // 16 SEMIBOLD BLACK
    .fontSize(12) // 12 SEMIBOLD BLACK
    .text("Payment Method:", posx.payment.method.name_x, posx.payment.method.y)
    .text("Payment ID:", posx.payment.id.name_x, posx.payment.id.y)
    .fill('#FFF') // 12 SEMIBOLD WHITE
    .text("TOTAL", posx.table.head.total_x, posx.table.head.y)
    .text("QTY", posx.table.head.qty_x, posx.table.head.y)
    .text("COST", posx.table.head.cost_x, posx.table.head.y)
    .text("PROCEDURE", posx.table.head.proc_x, posx.table.head.y);

  doc.end();
  return outputFile;
}

function sanitize(doc) {
  var cleanObj = new Object(doc);
  for (let key in cleanObj) {
    if (key === "inv_id" || cleanObj[key] === null || cleanObj[key] === undefined || cleanObj[key] === "") {
      delete cleanObj[key];
    }
  }
  return cleanObj;
}

async function NewInvoiceHandler(pid, body) {
  try {
    const db = await dbUtils.connect();
    var invoiceObj = {
      p_id: pid,
      doctor: [...new Set(body.treatments.map(obj => obj.doctor))],
      treatments: body.treatments.map(JSON.stringify),
      payment_method: body?.payment_method ? body.payment_method : null,
      payment_id: body?.payment_id ? body.payment_id : null,
      sub_total: body?.sub_total ? body.sub_total : null,
      discount: body?.discount ? body.discount : null,
      grand_total: body?.grand_total ? body.grand_total : null
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
  try {
    const db = await dbUtils.connect();
    var instances = await db.Invoice.countAll();
    if (instances < 1) {
      console.log(`[UTILS] AllInvoiceHandler returns empty data`);
      return { status: 204, body: {} };
    } else {
      if (count) {
        console.log(`[UTILS] AllInvoiceHandler success`);
        return { status: 200, body: { total_docs: instances } };
      } else {
        var docs = await db.Invoice.getAll();
        // docs.treatments.map(JSON.parse);
        for (let doc of docs) {
          doc.treatments = doc.treatments.map(JSON.parse);
        }
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
  try {
    const db = await dbUtils.connect();
    var doc = await db.Invoice.getByInvid(invid);
    if (!doc) {
      console.log(`[UTILS] GetInvoiceHandler returns empty data`);
      return { status: 404, body: null };
    } else {
      console.log(`[UTILS] GetInvoiceHandler success`);
      return { status: 200, body: doc };
    }
  } catch (err) {
    console.error(`[UTILS] Error @ GetInvoiceHandler \n ${JSON.stringify(err)}`);
    return err;
  }
}

async function PrintInvoiceHandler(invid) {
  try {
    const db = await dbUtils.connect();
    var doc = await db.Invoice.getByInvid(invid);
    var patientObj = await db.Patient.getByPid(doc.p_id);
    doc.treatments = doc.treatments.map(JSON.parse);
    doc.patient = patientObj;
    var outputFile = await generatePdf(doc);
    console.log(outputFile);
    await dbUtils.close();
    return { status: 201, body: { file: outputFile } };
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
