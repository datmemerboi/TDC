const _ = require('lodash');
const router = require('express').Router();
const InvoiceUtils = require('../utils/invoice-utils');

router.post('/new', (req, res) => {
  console.log(`[API] ${req.method} request to /api/invoice/new/`);
  if (_.isNil(req.body) || _.isEmpty(req.body) || _.isNil(req.body.p_id) || _.isNil(req.body.treatments)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    InvoiceUtils.NewInvoiceHandler(req.body.p_id, req.body)
      .then(result => {
        console.log(`[API] Request handled successfully`);
        res.status(result.status).json(result.body ?? {}).end();
      })
      .catch(err => {
        console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
        res.sendStatus(500).end();
      });
  }
});

router.all('/all', (req, res) => {
  console.log(`[API] ${req.method} request to /api/invoice/all/`);
  let count = _.has(req.query, "count") ? req.query.count.toLocaleLowerCase() === "true" : false;
  InvoiceUtils.AllInvoiceHandler(count)
    .then(result => {
      console.log(`[API] Request handled successfully`);
      res.status(result.status).json(result.body).end();
    })
    .catch(err => {
      console.error(`[API] Failed to handle request \n ${JSON.stringify(err)}`);
      res.sendStatus(500).end();
    });
});

router.all('/print/:invid', (req, res) => {
  console.log(`[API] ${req.method} request to /api/invoice/print/`);
  if (_.isNil(req.params.invid)) {
    console.error(`[API] Bad Request: missing required parameters`);
    res.sendStatus(400).end();
  } else {
    InvoiceUtils.PrintInvoiceHandler(req.params.invid)
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
