"use strict";var _process$env$NODE_ENV;const mongoose=require("mongoose"),config=require("../config.json")[null!==(_process$env$NODE_ENV=process.env.NODE_ENV)&&void 0!==_process$env$NODE_ENV?_process$env$NODE_ENV:"development"],Patient=require("../schema/patient-schema"),Treatment=require("../schema/treatment-schema"),Appointment=require("../schema/appointment-schema"),Invoice=require("../schema/invoice-schema");mongoose.set("useCreateIndex",!0),mongoose.set("useNewUrlParser",!0),mongoose.set("useFindAndModify",!1),mongoose.set("useUnifiedTopology",!0);function connect(){return new Promise((a,b)=>{mongoose.connect(config.DB_URI,{connectTimeoutMS:3e3},(c,d)=>c?b(c):(d.model("Patient",Patient),d.model("Treatment",Treatment),d.model("Appointment",Appointment),d.model("Invoice",Invoice),a(d.models)))})}function close(){return mongoose.disconnect()}module.exports={connect,close};