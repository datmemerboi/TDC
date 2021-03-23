const router = require('express').Router(),
      PatientUtils = require('../utils/patient-utils');

router.post('/new', function(req, res) {
  console.log(`[API] ${req.method} request to /api/patient/new/`);
  if(!req.body || req.body === {}) {
    console.error(`[API] Bad Request: missing request body`);
    res.sendStatus(400).end();
  } else if(!req.body.name || !req.body.contact) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.NewPatientHandler(req.body)
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

router.all('/all', function (req, res) {
  console.log(`[API] ${req.method} request to /api/patient/all/`);
  PatientUtils.AllPatientHandler()
    .then(result => {
      console.log(`[API] Request handled successfully`);
      res.status(result.status).json(result.body).end();
    })
    .catch(err => {
      console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
      res.sendStatus(500).end();
    });
});

router.all('/get/:pid', function (req, res) {
  console.log(`[API] ${req.method} request to /api/patient/get/`);
  if(!req.params.pid) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.GetPatientHandler(req.params.pid)
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

router.post('/bulk', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/bulk/`);
  if (!req.body || req.body === {} || !req.body.pids) {
    console.error(`[API] Bad request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.BulkPatientsHandler(req.body.pids)
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

router.get('/areas', function (req, res) {
  console.log(`[API] ${req.method} request to /api/patient/areas/`);
  PatientUtils.GetDistinctAreasHandler()
    .then(result => {
      res.status(result.status).json(result.body).end();
    })
    .catch(err => {
      res.sendStatus(500).json(err).end();
    });
});

router.put('/update/:pid', function (req, res) {
  console.log(`[API] ${req.method} request to /api/patient/update/`);
  if(!req.body || req.body === {} || !req.params.pid) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.UpdatePatientHandler(req.params.pid.trim(), req.body)
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

router.all('/search', function (req, res) {
  console.log(`[API] ${req.method} request to /api/patient/search/`);
  if (req.method === "GET") {
    // Check query params
    if (!req.query?.term || !req.query?.type) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else {
      let term = req.query.term, type = req.query.type;
      PatientUtils.SearchPatientHandler(term, type.toLowerCase())
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
    if (!req.body?.term && !req.body?.type) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else {
      let term = req.body.term, type = req.body.type;
      PatientUtils.SearchPatientHandler(term, type.toLowerCase())
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

module.exports = router;
