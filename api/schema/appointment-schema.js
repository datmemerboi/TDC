const Schema = require('mongoose').Schema;

var Appointment = new Schema({
  app_id: { type: String, required: true, index: true },
  p_id: { type: String, index: true },
  appointment_date: { type: Date, required: true },
  doctor: { type: String, index: true, required: true },
  status: { type: Number, default: 1 }, // 0-Cancelled, 1-Scheduled, 2-Completed, 3-Postponed
  room: Number,
  created_at: { type: Date, default: Date.now }
});

Appointment.statics.getAll = function () {
  return this.find({}, { _id: 0, __v: 0 })
    .sort('-appointment_date')
    .lean()
    .exec();
};

Appointment.statics.countAll = function () {
  return this.countDocuments();
};

Appointment.statics.getByAppid = function (appid) {
  return this.findOne({ app_id: appid }, { _id: 0, __v: 0 })
    .lean()
    .exec();
};

Appointment.statics.findByPid = function (pid) {
  return this.find({ p_id: pid }, { _id: 0, __v: 0 })
    .sort('-appointment_date')
    .lean()
    .exec();
};

Appointment.statics.countByPid = function (pid) {
  return this.find({ p_id: pid }).countDocuments();
};

Appointment.statics.getLatestAppId = function () {
  return this.find({}, { app_id: 1 })
    .sort('-created_at')
    .limit(1)
    .exec();
};

Appointment.statics.findByDoctor = function (doctor) {
  return this.find({ doctor: doctor }, { _id: 0, __v: 0 })
    .sort('-appointment_date')
    .lean()
    .exec();
};

Appointment.statics.countByDoctor = function (doctor) {
  return this.find({ doctor: doctor }).countDocuments();
};

Appointment.statics.getDistinctDoctor = function () {
  return this.distinct('doctor');
};

Appointment.statics.findBetweenDate = function (from, to) {
  return this.find(
    {
      $and: [
        { appointment_date: { $gte: from } },
        { appointment_date: { $lte: to } }
      ]
    },
    { _id: 0, __v: 0 }
  )
    .sort('-appointment_date')
    .lean()
    .exec();
};

Appointment.statics.countBetweenDate = function (from, to) {
  return this.find(
    {
      $and: [
        { appointment_date: { $gte: from } },
        { appointment_date: { $lte: to } }
      ]
    }
  ).countDocuments();
};

Appointment.statics.findByStatus = function (status) {
  return this.find({ status: status }, { _id: 0, __v: 0 })
    .sort('-created_at')
    .lean()
    .exec();
};

Appointment.statics.countByStatus = function (status) {
  return this.find({ status: status }).countDocuments();
};

Appointment.statics.findByAvailability = function (doctor, from, to) {
  return this.find(
    {
      $and: [
        { appointment_date: { $gte: from } },
        { appointment_date: { $lte: to } },
        { doctor: doctor }
      ]
    }
  )
    .sort('-created_at')
    .lean()
    .exec();
};

Appointment.statics.updateDoc = function (appid, doc) {
  return this.findOneAndUpdate({ app_id: appid }, { $set: doc }).exec();
};

Appointment.statics.deleteByAppid = function (appid) {
  return this.deleteOne({ app_id: appid }).exec();
};

module.exports = Appointment;
