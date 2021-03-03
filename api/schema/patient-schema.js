const Schema = require('mongoose').Schema;

var Patient = new Schema({
  p_id: { type: String, required: true, index: true, unique: true },
  name: String,
  dob: Date,
  age: Number,
  area: String,
  gender: String,
  address: String,
  contact: { type: Number, index: true },
  med_history: [{ type: String }],
  current_meds: [{ type: String }],
  files: [{ type: String }],
  created_at: { type: Date, default: Date.now }
});

Patient.statics.getAll = function () {
  return this.find({}, { _id: 0, __v: 0 }).exec();
};

Patient.statics.countAll = function () {
  return this.countDocuments();
};

Patient.statics.getByPid = function (pid) {
  return this.findOne({ p_id: pid }, { _id: 0, __v: 0 }).exec();
};

Patient.statics.getLatestPid = function () {
  return this.find({}, { p_id: 1, _id: 0 })
    .sort('-created_at')
    .limit(1)
    .exec();
};

Patient.statics.getDistinctArea = function () {
  return this.distinct('area');
};

Patient.statics.findByName = function (name) {
  return this.find(
    { name: { $regex: name, $options: 'i' } },
    { _id: 0, __v: 0 }
  ).exec();
};

Patient.statics.findByArea = function (area) {
  return this.find(
    { area: { $regex: area, $options: 'i' } },
    { _id: 0, __v: 0 }
  ).exec();
};

Patient.statics.findByContact = function (contact) {
  return this.find(
    { contact: contact },
    { _id: 0, __v: 0 }
  ).exec();
};

Patient.statics.updateDoc = function (pid, doc) {
  return this.findOneAndUpdate(
    { p_id: pid },
    { $set: doc },
    { upsert: true }
  ).exec();
};

Patient.statics.deleteByPid = function (pid) {
  return this.deleteOne(
    { p_id: pid }
  ).exec();
};

module.exports = Patient;
