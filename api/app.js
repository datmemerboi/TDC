const express = require('express'),
      app = express(),
      AppointmentRoutes = require('./routes/appointment-routes'),
      TreatmentRoutes = require('./routes/treatment-routes'),
      PatientRoutes = require('./routes/patient-routes'),
      InvoiceRoutes = require('./routes/invoice-routes');

const config = require('./config.json')[process.env.NODE_ENV ?? "dev"],
      PORT = config?.PORT ?? 8080;

app.use(express.json());

app.use('/api/patient', PatientRoutes);
app.use('/api/treatment', TreatmentRoutes);
app.use('/api/appointment', AppointmentRoutes);
app.use('/api/invoice', InvoiceRoutes);

app.get('/_health', (req, res) => {
  console.log(`[API] ${req.method} request to /_health/`);
  console.log(`[API] Request handled successfully`);
  res.json({ success: true, health: "Good" }).end();
});

app.all('*', (req, res) => {
  res.sendStatus(404).end();
})

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`API running at http://localhost:${PORT}\nOpen a browser and go to http://localhost:${PORT}/_health/\n`);
  }
});

module.exports = app;
