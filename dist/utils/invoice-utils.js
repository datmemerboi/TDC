'use strict';var _process$env$NODE_ENV;const fs=require("fs"),path=require("path"),PDF=require("pdfkit"),dbUtils=require("./db-utils"),posx=require("../coordinates.json"),config=require("../config.json")[null!==(_process$env$NODE_ENV=process.env.NODE_ENV)&&void 0!==_process$env$NODE_ENV?_process$env$NODE_ENV:"development"];function InvoiceUtils(){}function makeNextInvid(a){return new Promise((b,c)=>{a.Invoice.getLatestInvid().then(a=>{var c;if(a=a&&a[0]&&null!==(c=a[0])&&void 0!==c&&c.inv_id?parseInt(a[0].inv_id.replace("INV","")):null,a){let c=1e3>a?"INV"+("0000"+(a+1).toString()).slice(-4):"INV"+(a+1).toString();return b(c)}return b("INV0001")}).catch(a=>c(a))})}function generatePdf(a){var b,c,d,e,f,g;/*
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
  */const h=path.join(__dirname,"..","..","invoice"),i=path.join(__dirname,"..","..","misc"),j=path.join(h,a.inv_id+".pdf");var k=new PDF;return fs.existsSync(h)||fs.mkdirSync(h),k.pipe(fs.createWriteStream(j)),k.image(path.join(i,"logo.png"),60,60,{fit:[70,50],align:"left",valign:"center"}),k.save().moveTo(posx.table.head.banner_up.x,posx.table.head.banner_up.y).lineTo(posx.table.head.banner_up.x,posx.table.head.banner_down.y).lineTo(posx.table.head.banner_down.x,posx.table.head.banner_down.y).lineTo(posx.table.head.banner_down.x,posx.table.head.banner_up.y).fill("#0063A3").save()// HEADER MARGIN
.moveTo(posx.table.foot.left_x,posx.table.foot.y).lineTo(posx.table.foot.right_x,posx.table.foot.y).fill("#CCC"),k.font(path.join(i,"ProximaNova-Bold.ttf")).fontSize(20).fill("#0063A3").text(null!==(b=config.CLINIC_NAME)&&void 0!==b?b:"JD CLINIC",posx.header.title.x,posx.header.title.y).text("INVOICE",posx.header.invoice.x,posx.header.invoice.y),k.font(path.join(i,"ProximaNova-Regular.ttf")).fontSize(12).fill("#000").text(null!==(c=config.CLINIC_ADDRESS_LINE_1)&&void 0!==c?c:"1, Doe Road",posx.header.address.x,posx.header.address.line_1_y).text(null!==(d=config.CLINIC_ADDRESS_LINE_2)&&void 0!==d?d:"90000 90000",posx.header.address.x,posx.header.address.line_2_y).text(null!==(e=config.CLINIC_ADDRESS_LINE_3)&&void 0!==e?e:"john@doe.com",posx.header.address.x,posx.header.address.line_3_y).text(null!==(f=a.payment_method)&&void 0!==f?f:null,posx.payment.method.x,posx.payment.method.y).text(null!==(g=a.payment_id)&&void 0!==g?g:null,posx.payment.id.x,posx.payment.id.y),a.treatments.forEach((a,b)=>{var c;let d=posx.table.body.base_proc.y+64*b;k.text(a.procedure_done,posx.table.body.base_proc.x,d,{width:posx.table.body.base_proc.max_width,height:posx.table.body.base_proc.max_height}).text(a.treatment_date?new Date(a.treatment_date).toLocaleString("default",{day:"numeric",month:"short",year:"numeric"}):null).text(a.teeth_number&&a.teeth_number.length?`Teeth: ${a.teeth_number.join(",")}`:null).text(a.cost,posx.table.body.cost.x,d,{width:posx.table.body.cost.max_width}).text(a.qty,posx.table.body.qty.x,d,{width:posx.table.body.qty.max_width}).text((null===(c=a.total)||void 0===c?void 0:c.toFixed(2))||null,posx.table.body.total.x,d,{width:posx.table.body.total.max_width})}),k.fontSize(14).text(`${a.patient.name}`,posx.data.patient.name.x,posx.data.patient.name.y).text(`${a.patient.age} / ${a.patient.gender}`).text(a.patient.contact).text("Doctor:",posx.data.doctor.x,posx.data.doctor.y).text(a.invoice_date,posx.data.date.x,posx.data.date.y,{align:"right"}).text("Sub Total: Rs.",posx.total_foot.x,posx.total_foot.sub_y).text("Grand Total: Rs.",posx.total_foot.x,posx.total_foot.grand_y),k.font(path.join(i,"ProximaNova-Semibold.ttf")).text(a.doctor.join(", "),posx.data.doctor.name_x,posx.data.doctor.y).text(a.patient.p_id,posx.data.patient.pid.x,posx.data.patient.pid.y,{align:"right"}).text(a.sub_total.toFixed(2),0,posx.total_foot.sub_y,{align:"right"}).text(a.grand_total.toFixed(2),0,posx.total_foot.grand_y,{align:"right"}).fontSize(16).text(a.inv_id,posx.data.invoice.x,posx.data.invoice.y,{align:"right"})// 16 SEMIBOLD BLACK
.fontSize(12)// 12 SEMIBOLD BLACK
.text("Payment Method:",posx.payment.method.name_x,posx.payment.method.y).text("Payment ID:",posx.payment.id.name_x,posx.payment.id.y).fill("#FFF")// 12 SEMIBOLD WHITE
.text("TOTAL",posx.table.head.total_x,posx.table.head.y).text("QTY",posx.table.head.qty_x,posx.table.head.y).text("COST",posx.table.head.cost_x,posx.table.head.y).text("PROCEDURE",posx.table.head.proc_x,posx.table.head.y),k.end(),j}function sanitize(a){var b=Object(a);for(let c in b)("inv_id"==c||null===b[c]||void 0===b[c]||""===b[c])&&delete b[c];return b}async function NewInvoiceHandler(a,b){try{const d=await dbUtils.connect();var c={p_id:a,doctor:[...new Set(b.treatments.map(a=>a.doctor))],treatments:b.treatments.map(JSON.stringify),payment_method:null!==b&&void 0!==b&&b.payment_method?b.payment_method:null,payment_id:null!==b&&void 0!==b&&b.payment_id?b.payment_id:null,sub_total:null!==b&&void 0!==b&&b.sub_total?b.sub_total:null,discount:null!==b&&void 0!==b&&b.discount?b.discount:null,grand_total:null!==b&&void 0!==b&&b.grand_total?b.grand_total:null};return c=sanitize(c),c.inv_id=await makeNextInvid(d),await d.Invoice.create(c),console.log(`[UTILS] NewInvoiceHandler success`),{status:201,body:c}}catch(a){throw console.error(`[UTILS] Error @ NewInvoiceHandler \n ${JSON.stringify(a)}`),a}}async function AllInvoiceHandler(a=!1){try{const d=await dbUtils.connect();var b=await d.Invoice.countAll();if(1>b)return console.log(`[UTILS] AllInvoiceHandler returns empty data`),{status:204,body:{}};if(a)return console.log(`[UTILS] AllInvoiceHandler success`),{status:200,body:{total_docs:b}};var c=await d.Invoice.getAll();// docs.treatments.map(JSON.parse);
for(let a of c)a.treatments=a.treatments.map(JSON.parse);return console.log(`[UTILS] AllInvoiceHandler success`),{status:200,body:{total_docs:b,docs:c}}}catch(a){throw console.error(`[UTILS] Error @ AllInvoiceHandler \n ${JSON.stringify(a)}`),a}}async function GetInvoiceHandler(a){try{const c=await dbUtils.connect();var b=await c.Invoice.getByInvid(a);return b?(console.log(`[UTILS] GetInvoiceHandler success`),{status:200,body:b}):(console.log(`[UTILS] GetInvoiceHandler returns empty data`),{status:404,body:null})}catch(a){return console.error(`[UTILS] Error @ GetInvoiceHandler \n ${JSON.stringify(a)}`),a}}async function PrintInvoiceHandler(a){try{const e=await dbUtils.connect();var b=await e.Invoice.getByInvid(a),c=await e.Patient.getByPid(b.p_id);b.treatments=b.treatments.map(JSON.parse),b.patient=c;var d=await generatePdf(b);return console.log(d),await dbUtils.close(),{status:201,body:{file:d}}}catch(a){throw console.error(`[UTILS] Error @ PrintInvoiceHandler \n ${JSON.stringify(a)}`),a}}InvoiceUtils.prototype.NewInvoiceHandler=NewInvoiceHandler,InvoiceUtils.prototype.AllInvoiceHandler=AllInvoiceHandler,InvoiceUtils.prototype.GetInvoiceHandler=GetInvoiceHandler,InvoiceUtils.prototype.PrintInvoiceHandler=PrintInvoiceHandler,module.exports=new InvoiceUtils;