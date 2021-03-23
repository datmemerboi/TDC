'use strict';function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}const dbUtils=require("./db-utils");function AppointmentUtils(){}function makeNextAid(a){return new Promise((b,c)=>{a.Appointment.getLatestAppId().then(a=>{var c;if(a=a[0]&&null!==(c=a[0])&&void 0!==c&&c.app_id?parseInt(a[0].app_id.replace("APP","")):null,a){let c=1e3>a?"APP"+("0000"+(a+1).toString()).slice(-4):"APP"+(a+1).toString();return b(c)}return b("APP0001")}).catch(a=>(console.error(`[UTILS] Error @ makeNextAid \n ${JSON.stringify(a)}`),c(a)))})}function generateStatsForAppointment(a){let b=[...new Set(a.map(a=>a.doctor))],c=[...new Set(a.map(a=>a.status))],d=b.map(b=>({type:"doctor",name:b,count:a.filter(a=>a.doctor===b).length})),e=c.map(b=>({type:"status",value:b,count:a.filter(a=>a.status===b).length}));// Get list of unique doctors
return[...d,...e]}function mergePatientDetails(a,b,c){return new Promise(d=>{a.Patient.getByPid(b).then(a=>{var b=_objectSpread(_objectSpread({},c),{},{patient:{name:a.name,age:a.age,gender:a.gender}});return d(b)}).catch(a=>(console.error(`[UTILS] Error @ mergePatientDetails \n ${JSON.stringify(a)}`),d(c)))})}function checkAppointmentFeasibility(a,b){// Check if a new appointment doc is feasible
return new Promise((c,d)=>{if(!b.app_id||!b.appointment_date||!b.doctor||!b.status)// Appointment id, timing, doctor and status not mentioned
return c(!1);else{let e=b.appointment_date-899e3,// 15 minutes before appointment_date
f=b.appointment_date+899e3;// 15 minutes after appointment_date
// Check if the doctor has any appointments 15 mins before or after the mentioned timing
a.Appointment.findByAvailability(b.doctor,e,f).then(a=>{if(a&&0<a.length){// Every record is either status Cancelled or Postponed
let b=a.every(a=>1!==a.status&&2!==a.status);return c(b)}return c(!0)}).catch(a=>(console.error(`[UTILS] Error @ checkAppointmentFeasibility \n ${JSON.stringify(a)}`),d(!1)))}})}function sanitize(a){// Create a clean object fit for the db
var b=Object(a);for(let c in b)// Removing empty & id keys from the object
("app_id"==c||null===b[c]||void 0===b[c]||""===b[c])&&delete b[c];// Convert appointment_date to JS milliseconds
return b.appointment_date=1e12>b.appointment_date?new Date(1e3*b.appointment_date).getTime():b.appointment_date,b}async function NewAppointmentHandler(a){try{const b=await dbUtils.connect(),c=await makeNextAid(b);return a=sanitize(a),a.app_id=c,(await checkAppointmentFeasibility(b,a))?(await b.Appointment.create(a),console.log(`[UTILS] NewAppointmentHandler success`),{status:201,body:a}):(console.log(`[UTILS] Mentioned appointment is not feasible`),{status:409,body:a})}catch(a){return console.error(`[UTILS] Error @ NewAppointmentHandler \n ${JSON.stringify(a)}`),a}}async function AllAppointmentHandler(){try{const c=await dbUtils.connect();var a=await c.Appointment.countAll();if(1>a)return console.error(`[UTILS] AllAppointmentHandler returns empty data`),{status:404,body:null};var b=await c.Appointment.getAll();return console.log(`[UTILS] AllAppointmentHandler success`),{status:200,body:{total_docs:a,docs:b,meta:generateStatsForAppointment(b)}}}catch(a){return console.error(`[UTILS] Error @ AllAppointmentHandler \n ${JSON.stringify(a)}`),a}}async function PatientAppointmentHandler(a,b=!1){try{const e=await dbUtils.connect();var c=await e.Appointment.countByPid(a);if(1>c)return console.log(`[UTILS] PatientAppointmentHandler returns empty data`),{status:404,body:null};if(b)return console.log(`[UTILS] PatientAppointmentHandler success`),{status:200,body:{total_docs:c}};var d=e.Appointment.findByPid(a);return console.log(`[UTILS] PatientAppointmentHandler success`),{status:200,body:{total_docs:c,docs:d}}}catch(a){return console.error(`[UTILS] Error @ PatientAppointmentHandler \n ${JSON.stringify(a)}`),a}}async function DoctorAppointmentHandler(a,b=!1){try{const e=await dbUtils.connect();var c=await e.Appointment.countByDoctor(a);if(1>c)return console.error(`[UTILS] DoctorAppointmentHandler returns empty data`),{status:404,body:null};if(b)return console.log(`[UTILS] DoctorAppointmentHandler success`),{status:200,body:{total_docs:c}};var d=await e.Appointment.findByDoctor(a);return console.log(`[UTILS] DoctorAppointmentHandler success`),{status:200,body:{total_docs:c,docs:d}}}catch(a){return console.error(`[UTILS] Error @ DoctorAppointmentHandler \n ${JSON.stringify(a)}`),a}}async function StatusAppointmentHandler(a,b=!1){try{const e=await dbUtils.connect();var c=await e.Appointment.countByStatus(a);if(0>c)return console.log(`[UTILS] StatusAppointmentHandler return empty data`),{status:404,body:null};if(b)return console.log(`[UTILS] StatusAppointmentHandler success`),{status:200,body:{total_docs:c}};var d=await e.Appointment.findByStatus(a);return console.log(`[UTILS] StatusAppointmentHandler success`),{status:200,body:{total_docs:c,docs:d}}}catch(a){return console.error(`[UTILS] Error @ StatusAppointmentHandler \n ${JSON.stringify(a)}`),a}}async function UpdateAppointmentHandler(a,b){try{const c=await dbUtils.connect();return b=sanitize(b),await c.Appointment.updateDoc(a,b),console.log(`[UTILS] UpdateAppointmentHandler success`),{status:200,body:b}}catch(a){return console.error(`[UTILS] Error @ UpdateAppointmentHandler \n ${JSON.stringify(a)}`),a}}async function DateAppointmentHandler(a,b,c=!1){try{a=1e12>a?1e3*a:a,b=1e12>b?1e3*b:b;const f=await dbUtils.connect();var d=await f.Appointment.findBetweenDate(a,b);if(c)// Request for only count of records
return{status:200,body:{total_docs:d.length}};else{const a=await Promise.all(d.map(a=>mergePatientDetails(f,a.p_id,a)));var e={total_docs:d.length,docs:a,meta:generateStatsForAppointment(d)};return console.log(`[UTILS] DateAppointmentHandler success`),{status:200,body:e}}}catch(a){return console.error(`[UTILS] Error @ DateAppointmentHandler \n ${JSON.stringify(a)}`),a}}AppointmentUtils.prototype.NewAppointmentHandler=NewAppointmentHandler,AppointmentUtils.prototype.AllAppointmentHandler=AllAppointmentHandler,AppointmentUtils.prototype.PatientAppointmentHandler=PatientAppointmentHandler,AppointmentUtils.prototype.DoctorAppointmentHandler=DoctorAppointmentHandler,AppointmentUtils.prototype.StatusAppointmentHandler=StatusAppointmentHandler,AppointmentUtils.prototype.UpdateAppointmentHandler=UpdateAppointmentHandler,AppointmentUtils.prototype.DateAppointmentHandler=DateAppointmentHandler,module.exports=new AppointmentUtils;