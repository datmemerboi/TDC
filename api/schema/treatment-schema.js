const Schema = require('mongoose').Schema;

var Treatment = new Schema({
  t_id: { type: String, required: true, index: true, unique: true },
  p_id: { type: String, required: true, index: true },
  procedure_done: String,
  teeth_number: [{ type: Number }],
  treatment_date: { type: Date, default: Date.now },
  doctor: { type: String },
  remarks: String,
  created_at: { type: Date, default: Date.now }
});

Treatment.statics.getAll = function () {
  return this.find({}, { _id: 0, __v: 0 }).sort('-created_at').exec();
};

Treatment.statics.countAll = function () {
  return this.countDocuments();
};

Treatment.statics.getByTid = function (tid) {
  return this.findOne({ t_id: tid }, { _id: 0, __v: 0 }).exec();
};

Treatment.statics.findInTid = function (tid) {
  return this.find({ t_id: { $in: tid } }, { _id: 0, __v: 0 })
    .exec();
};

Treatment.statics.findByPid = function (pid) {
  return this.find({ p_id: pid }, { _id: 0, __v: 0 })
    .exec();
};

Treatment.statics.getLatestTid = function () {
  return this.find({}, { t_id: 1, _id: 0 })
    .sort('-created_at')
    .limit(1)
    .exec();
};

Treatment.statics.countByPid = function (pid) {
  return this.find({ p_id: pid }).countDocuments();
};

Treatment.statics.findByDoctor = function (doctor) {
  return this.find(
    { doctor: doctor },
    { _id: 0, __v: 0 }
  ).sort('-treatment_date').exec();
};

Treatment.statics.countByDoctor = function (doctor) {
  return this.find({ doctor: doctor }).countDocuments();
};

Treatment.statics.getDistinctProcedures = function () {
  return this.distinct('procedure_done');
};

Treatment.statics.findBetweenDate = function (from, to) {
  return this.find(
    {
      $and: [
        { treatment_date: { $gte: from } },
        { treatment_date: { $lte: to } }
      ]
    },
    { _id: 0, __v: 0 }
  ).exec();
};

Treatment.statics.updateDoc = function (tid, doc) {
  return this.findOneAndUpdate(
    { t_id: tid },
    { $set: doc },
    { upsert: true }
  ).exec();
};

Treatment.statics.updateOldToNew = function (o, n) {
  return this.findOneAndUpdate(
    { t_id: o.t_id },
    { $set: n }
  ).exec();
};

Treatment.statics.deleteByTid = function (tid) {
  return this.deleteOne(
    { t_id: tid }
  ).exec();
};

// ALT MOST RECENT TREATMENT ID
// db.patients.aggregate({ $group: { _id: null, max: { $max: '$Age' }}})
// find().sort().limit()
module.exports = Treatment;
