const _ = require('lodash');
const router = require('express').Router();
const AppointmentUtils = require('../utils/appointment-utils');
const FileUtils = require('../utils/file-utils');

router.post('/new', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/new/`);
  if (_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.body.p_id) || _.isNil(req.body.appointment_date) || _.isNil(req.body.doctor)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else if (!_.isString(req.body.p_id) || !_.isString(req.body.doctor) || !_.isFinite(req.body.appointment_date)) {
    console.error(`[API] Bad Request: parameters of invalid type`);
    res.sendStatus(400).end();
  } else {
    AppointmentUtils.NewAppointmentHandler(req.body)
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.all('/all', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/all/`);
  if (_.has(req.query, "from") && _.has(req.query, "to")) {
    // Date request
    if (_.isNaN(req.query.from) || _.isNaN(req.query.to)) {
      console.error(`[API] Bad Request: parameters of invalid type`);
      res.sendStatus(400).end();
    }
    let count = _.has(req.query, "count") ? req.query.count.toLowerCase() === "true" : false;
    AppointmentUtils.DateAppointmentHandler(req.query.from, req.query.to, count)
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  } else {
    AppointmentUtils.AllAppointmentHandler()
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.all('/patient/:pid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/patient/`);
  if (_.isNil(req.params.pid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    let count = _.has(req.query, "count") ? req.query.count.toLowerCase() === "true" : false;
    AppointmentUtils.PatientAppointmentHandler(req.params.pid, count)
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.all('/doctor', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/doctor/`);
  if (req.method === "GET") {
    if (_.isNil(req.query.doctor)) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else {
      let count = _.has(req.query, "count") ? req.query.count.toLowerCase() === "true" : false;
      AppointmentUtils.DoctorAppointmentHandler(req.query.doctor, count)
        .then(result => {
          console.log(`[API] Request handled successfully`);
          res.status(result.status).json(result.body).end();
        })
        .catch(err => {
          console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
          res.sendStatus(500).end();
        });
    }
  } else {
    if (_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.body.doctor)) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else if (!_.isString(req.body.doctor)) {
      console.error(`[API] Bad Request: parameters of invalid type`);
      res.sendStatus(400).end();
    } else {
      let count = _.has(req.query, "count") ? req.query.count.toLowerCase() === "true" : false;
      AppointmentUtils.DoctorAppointmentHandler(req.body.doctor.trim(), count)
        .then(result => {
          console.log(`[API] Request handled successfully`);
          res.status(result.status).json(result.body).end();
        })
        .catch(err => {
          console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
          res.sendStatus(500).end();
        });
    }
  }
});

router.all('/status', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/status/`);
  if (req.method === "GET") {
    if (_.isNil(req.query.status)) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else {
      let count = _.has(req.query, "count") ? req.query.count.toLowerCase() === "true" : false;
      AppointmentUtils.StatusAppointmentHandler(req.query.status.trim(), count)
        .then(result => {
          console.log(`[API] Request handled successfully`);
          res.status(result.status).json(result.body).end();
        })
        .catch(err => {
          console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
          res.sendStatus(500).end();
        });
    }
  } else {
    if (_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.body.status)) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else if (_.isNaN(req.body.status)) {
      console.error(`[API] Bad Request: parameters of invalid type`);
      res.sendStatus(400).end();
    } else {
      let count = _.has(req.query, "count") ? req.query.count.toLowerCase() === "true" : false;
      AppointmentUtils.StatusAppointmentHandler(req.body.status, count)
        .then(result => {
          console.log(`[API] Request handled successfully`);
          res.status(result.status).json(result.body).end();
        })
        .catch(err => {
          console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
          res.sendStatus(500).end();
        });
    }
  }
});

router.put('/update/:appid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/update/`);
  if (_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.params.appid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    AppointmentUtils.UpdateAppointmentHandler(req.params.appid, req.body)
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.put('/import', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/import`);
  if (_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.body.file)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else if (!_.isString(req.body.file)) {
    console.error(`[API] Bad Request: parameters of invalid type`);
    res.sendStatus(400).end();
  } else {
    FileUtils.ImportXlsHandler(req.body.file, "Appointment")
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.post('/export', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/export`);
  FileUtils.ExportXlsHandler("Appointment")
    .then(result => {
      console.log(`[API] Request handled successfully`);
      res.status(result.status).json(result.body).end();
    })
    .catch(err => {
      console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
      res.sendStatus(500).end();
    });
});

module.exports = router;
