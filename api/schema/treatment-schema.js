/**
 * Treatment Schema
 *
 * Contains the schema for treatment collection and the binded static functions.
 * Exports the schema object.
 */
const Schema = require('mongoose').Schema;

let Treatment = new Schema({
  t_id: { type: String, required: true, index: true, unique: true },
  p_id: { type: String, required: true, index: true },
  procedure_done: { type: String, default: "" },
  teeth_number: [{ type: Number }],
  treatment_date: { type: Date, default: Date.now },
  doctor: { type: String },
  remarks: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});

Treatment.statics.getAll = function () {
  return this.find({}, { _id: 0, __v: 0 })
    .sort('-created_at')
    .lean()
    .exec();
};

Treatment.statics.countAll = function () {
  return this.countDocuments();
};

Treatment.statics.getByTid = function (tid) {
  return this.findOne({ t_id: tid }, { _id: 0, __v: 0 })
    .lean()
    .exec();
};

Treatment.statics.findInTid = function (tid) {
  return this.find({ t_id: { $in: tid } }, { _id: 0, __v: 0 })
    .lean()
    .exec();
};

Treatment.statics.findByPid = function (pid) {
  return this.find({ p_id: pid }, { _id: 0, __v: 0 })
    .lean()
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
  return this.find({ doctor: doctor }, { _id: 0, __v: 0 })
    .sort('-treatment_date')
    .lean()
    .exec();
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
  )
    .lean()
    .exec();
};

Treatment.statics.updateDoc = function (tid, doc) {
  return this.findOneAndUpdate(
    { t_id: tid },
    doc,
    { new: true }
  )
    .lean()
    .exec();
};

Treatment.statics.deleteByTid = function (tid) {
  return this.deleteOne({ t_id: tid }).exec();
};

Treatment.statics.deleteByPid = function (pid) {
  return this.deleteMany({ p_id: pid }).exec();
};

module.exports = Treatment;
