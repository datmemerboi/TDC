"use strict";const _=require("lodash"),router=require("express").Router(),TreatmentUtils=require("../utils/treatment-utils");router.all("/new",(a,b)=>{console.log(`[API] ${a.method} request to /api/treatment/new/`),console.log(a.body),_.isNil(a.body)||_.isEmpty(a.body)||_.isNil(a.body.p_id)||_.isNil(a.body.doctor)||_.isNil(a.body.procedure_done)?(console.error(`[API] Bad Request: missing required parameters`),b.sendStatus(400).end()):TreatmentUtils.NewTreatmentHandler(a.body).then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body).end()}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500).end()})}),router.all("/all",(a,b)=>{console.log(`[API] ${a.method} request to /api/treatment/all/`),TreatmentUtils.AllTreatmentHandler().then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body).end()}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500).end()})}),router.all("/get/:tid",(a,b)=>{console.log(`[API] ${a.method} request to /api/treatment/get/`),_.isNil(a.params.tid)?(console.error(`[API] Bad Request: missing required parameters`),b.sendStatus(400).end()):TreatmentUtils.GetTreatmentHandler(a.params.tid).then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body).end()}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500).end()})}),router.all("/patient/:pid",(a,b)=>{console.log(`[API] ${a.method} request to /api/treatment/patient/`),_.isNil(a.params.pid)?(console.error(`[API] Bad Request: missing required parameters`),b.sendStatus(400).end()):TreatmentUtils.PidTreatmentHandler(a.params.pid).then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body).end()}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500).end()})}),router.all("/doctor",(a,b)=>{if(console.log(`[API] ${a.method} request to /api/treatment/doctor/`),_.isNil(a.query.doctor)&&_.isNil(a.body.doctor))console.error(`[API] Bad Request: missing required parameters`),b.sendStatus(400).end();else{var c;let d=null!==(c=a.query.doctor)&&void 0!==c?c:a.body.doctor;TreatmentUtils.DoctorTreatmentHandler(d).then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body).end()}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500).end()})}}),router.all("/history/:pid",(a,b)=>{console.log(`[API] ${a.method} request to /api/treatment/history/`),_.isNil(a.params.pid)?(console.error(`[API] Bad Request: missing required parameters`),b.sendStatus(400).end()):TreatmentUtils.TreatmentHistoryHandler(a.params.pid,!!_.has(a.query,"quick")&&"true"===a.query.quick.toLowerCase()).then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body)}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500)})}),router.put("/update/:tid",(a,b)=>{console.log(`[API] ${a.method} request to /api/treatment/update/`),_.isNil(a.body)||_.isEmpty(a.body)||_.isNil(a.params.tid)?(console.error(`[API] Bad Request: missing required parameters`),b.sendStatus(400).end()):TreatmentUtils.UpdateTreatmentHandler(a.params.tid,a.body).then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body).end()}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500).end()})}),router.post("/compatibility",(a,b)=>{console.log(`[API] ${a.method} request to /api/treatment/compatibility`),_.isNil(a.body)||_.isEmpty(a.body)||_.isNil(a.body.list)||_.isEmpty(a.body.list)?console.error(`[API] Bad Request: missing required parameters`):TreatmentUtils.CheckCompatibilityHandler(a.body.list).then(a=>{console.log(`[API] Request handled successfully`),b.status(a.status).json(a.body).end()}).catch(a=>{console.error(`[API] Failed to handle request \n ${JSON.stringify(a)}`),b.sendStatus(500).end()})}),module.exports=router;