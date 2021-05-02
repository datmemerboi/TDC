const mongoose = require('mongoose');

const Patient = require('../schema/patient-schema');
const Treatment = require('../schema/treatment-schema');
const Appointment = require('../schema/appointment-schema');
const Invoice = require('../schema/invoice-schema');

const config = require('../config.json')[process.env.NODE_ENV ?? "development"];

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

function connect() {
  /**
   * Creates a mongoose connection to MongoDB and binds the Schema Models.
   * Uses the DB_URI from config for the connection.
   *
   * @version 3.1.2
   * @returns {Object} Returns the connection.
   */
  return new Promise((resolve, reject) => {
    mongoose.connect(config.DB_URI, { connectTimeoutMS: 3000 }, (err, conn) => {
      if (err) {
        return reject(err);
      } else {
        // Registering Models
        conn.model('Patient', Patient);
        conn.model('Treatment', Treatment);
        conn.model('Appointment', Appointment);
        conn.model('Invoice', Invoice);

        return resolve(conn.models);
      }
    });
  });
}

function close() {
  /**
   * Closes the mongoose connection.
   *
   * @version 3.1.2
   * @returns {Function} Returns the disconnect function.
   */
  return mongoose.disconnect();
}

module.exports = { connect, close };
