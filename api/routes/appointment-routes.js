const router = require('express').Router(),
      AppointmentUtils = require('../utils/appointment-utils');

router.post('/new', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/new/`);
  if(!req.body || req.body === {}) {
    console.error(`[API] Bad Request: missing request body`);
    res.sendStatus(400).end();
  }
  else if(!(req.body?.p_id ?? req.body?.date ?? req.body?.doctor ?? false)) {
    console.error(`[API] Bad Request: missing required parameters`);
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
  if (req.query?.from && req.query?.to) {
    // Date request
    AppointmentUtils.DateAppointmentHandler(req.query.from, req.query.to, req.query?.count?.toLowerCase() === "true")
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

router.post('/patient/:pid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/patient/`);
  if(!req.body || req.body === {} || !req.params?.pid) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    AppointmentUtils.PatientAppointmentHandler(req.params.pid, req.query?.count?.toLowerCase() === "true")
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
  if(!req.body || req.body === {} || !("doctor" in req.body)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    AppointmentUtils.DoctorAppointmentHandler(req.body.doctor, req.query?.count?.toLowerCase() === "true")
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

router.all('/status', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/status/`);
  if(!req.body || req.body === {} || !("status" in req.body)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    AppointmentUtils.StatusAppointmentHandler(req.body.status, req.query?.count?.toLowerCase() === "true")
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

router.put('/update/:appid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/appointment/update/`);
  if(!req.body || req.body === {} || !req.params?.appid) {
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

module.exports = router;
