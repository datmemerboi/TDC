/**
 * Patient Routes
 *
 * Registers all routes required for patient module.
 * Exports the router.
 */
const _ = require('lodash');
const router = require('express').Router();
const PatientUtils = require('../utils/patient-utils');
const FileUtils = require('../utils/file-utils');

router.post('/new', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/new/`);
  if (
    _.isNil(req.body) ||
    _.isEmpty(req.body) ||
    _.isNil(req.body.name) ||
    _.isNil(req.body.contact)
  ) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else if (!_.isString(req.body.name) || !_.isFinite(req.body.contact)) {
    console.error(`[API] Bad Request: parameters of invalid type`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.NewPatientHandler(req.body)
      .then((result) => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch((err) => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.all('/all', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/all/`);
  PatientUtils.AllPatientHandler()
    .then((result) => {
      console.log(`[API] Request handled successfully`);
      res.status(result.status).json(result.body).end();
    })
    .catch((err) => {
      console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
      res.sendStatus(500).end();
    });
});

router.all('/get/:pid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/get/`);
  if (_.isNil(req.params.pid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.GetPatientHandler(req.params.pid)
      .then((result) => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch((err) => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.post('/bulk', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/bulk/`);
  if (
    _.isNil(req.body) ||
    _.isEmpty(req.body) ||
    _.isNil(req.body.pids) ||
    _.isEmpty(req.body.pids)
  ) {
    console.error(`[API] Bad request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.BulkPatientsHandler(req.body.pids)
      .then((result) => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch((err) => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.get('/areas', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/areas/`);
  PatientUtils.GetDistinctAreasHandler()
    .then((result) => {
      console.log(`[API] Request handled successfully`);
      res.status(result.status).json(result.body).end();
    })
    .catch((err) => {
      res.sendStatus(500).json(err).end();
    });
});

router.put('/update/:pid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/update/`);
  if (_.isNil(req.params.pid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.UpdatePatientHandler(req.params.pid, req.body)
      .then((result) => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch((err) => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.all('/search', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/search/`);
  if (req.method === 'GET') {
    // Check query params
    if (_.isNil(req.query.term) || _.isNil(req.query.type)) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else {
      let term = req.query.term;
      let type = req.query.type;
      PatientUtils.SearchPatientHandler(term, type.toLowerCase())
        .then((result) => {
          console.log(`[API] Request handled successfully`);
          res.status(result.status).json(result.body).end();
        })
        .catch((err) => {
          console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
          res.sendStatus(500).end();
        });
    }
  } else {
    if (
      _.isNil(req.body) ||
      _.isEmpty(req.body) ||
      _.isNil(req.body.term) ||
      _.isNil(req.body.type)
    ) {
      console.error(`[API] Bad Request: missing required parameters`);
      res.sendStatus(400).end();
    } else {
      let term = req.body.term;
      let type = req.body.type;
      PatientUtils.SearchPatientHandler(term, type.toLowerCase())
        .then((result) => {
          console.log(`[API] Request handled successfully`);
          res.status(result.status).json(result.body).end();
        })
        .catch((err) => {
          console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
          res.sendStatus(500).end();
        });
    }
  }
});

router.all('/import', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/import`);
  if (_.isNil(req.query.file)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    FileUtils.ImportXlsHandler(req.query.file, 'Patient')
      .then((result) => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body).end();
      })
      .catch((err) => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.all('/export', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/export`);
  FileUtils.ExportXlsHandler('Patient')
    .then((result) => {
      console.log(`[API] Request handled successfully`);
      res.status(result.status).json(result.body).end();
    })
    .catch((err) => {
      console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
      res.sendStatus(500).end();
    });
});

router.delete('/delete/:pid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/patient/delete/`);
  if (_.isNil(req.params.pid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    PatientUtils.DeletePatientHandler(req.params.pid)
      .then((result) => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).end();
      })
      .catch((err) => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

module.exports = router;
