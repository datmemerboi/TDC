const _ = require('lodash');
const router = require('express').Router();
const TreatmentUtils = require('../utils/treatment-utils');

router.all('/new', (req, res) => {
  console.log(`[API] ${req.method} request to /api/treatment/new/`);
  if(_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.body.p_id) || _.isNil(req.body.doctor) || _.isNil(req.body.procedure_done)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    TreatmentUtils.NewTreatmentHandler(req.body)
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
  console.log(`[API] ${req.method} request to /api/treatment/all/`);
  TreatmentUtils.AllTreatmentHandler()
    .then(result => {
      console.log(`[API] Request handled successfully`);
      res.status(result.status).json(result.body).end();
    })
    .catch(err => {
      console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
      res.sendStatus(500).end();
    });
});

router.all('/get/:tid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/treatment/get/`);
  if(_.isNil(req.params.tid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    TreatmentUtils.GetTreatmentHandler(req.params.tid)
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
  console.log(`[API] ${req.method} request to /api/treatment/patient/`);
  if(_.isNil(req.params.pid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    TreatmentUtils.PidTreatmentHandler(req.params.pid)
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
  console.log(`[API] ${req.method} request to /api/treatment/doctor/`);
  if(_.isNil(req.query.doctor) && _.isNil(req.body.doctor)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    let doctor = req.query.doctor ?? req.body.doctor;
    TreatmentUtils.DoctorTreatmentHandler(doctor)
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

router.all('/history/:pid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/treatment/history/`);
  if (_.isNil(req.params.pid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    let quick = _.has(req.query, "quick") ? req.query.quick.toLowerCase() === "true" : false;
    TreatmentUtils.TreatmentHistoryHandler(req.params.pid, quick)
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body);
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500);
      });
  }
});

router.put('/update/:tid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/treatment/update/`);
  if(_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.params.tid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    TreatmentUtils.UpdateTreatmentHandler(req.params.tid, req.body)
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

router.post('/compatibility', (req, res) => {
  console.log(`[API] ${req.method} request to /api/treatment/compatibility`);
  if (_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.body.list) || _.isEmpty(req.body.list)) {
    console.error(`[API] Bad Request: missing required parameters`);
  } else {
    TreatmentUtils.CheckCompatibilityHandler(req.body.list)
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
