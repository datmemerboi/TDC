/**
 * Invoice Schema
 *
 * Contains the schema for invoice collection and the binded static functions.
 * Exports the schema object.
 */
const Schema = require('mongoose').Schema;

let Invoice = new Schema({
  inv_id: { type: String, required: true, index: true, unique: true },
  p_id: { type: String, index: true },
  treatments: [{ type: String }],
  doctor: [{ type: String }],
  payment_method: String,
  payment_id: String,
  sub_total: Number,
  discount: Number,
  grand_total: Number,
  created_at: { type: Date, default: Date.now }
});

Invoice.statics.getAll = function () {
  return this.find({}, { _id: 0, __v: 0 })
    .lean()
    .exec();
};

Invoice.statics.countAll = function () {
  return this.countDocuments();
};

Invoice.statics.findByDoctor = function (doctor) {
  return this.find({ doctor: doctor }, { _id: 0, __v: 0 })
    .lean()
    .exec();
};

Invoice.statics.getByInvid = function (invid) {
  return this.findOne({ inv_id: invid }, { _id: 0, __v: 0 })
    .lean()
    .exec();
};

Invoice.statics.getLatestInvid = function () {
  return this.find({}, { inv_id: 1 })
    .sort('-created_at')
    .limit(1)
    .lean()
    .exec();
};

Invoice.statics.findByPid = function (pid) {
  return this.find({ p_id: pid }, { _id: 0, __v: 0 })
    .lean()
    .exec();
};

Invoice.statics.findBetweenDate = function (from, to) {
  return this.find(
    {
      $and: [
        { invoice_date: { $gte: from } },
        { invoice_date: { $lte: to } }
      ]
    },
    { _id: 0, __v: 0 }
  )
    .lean()
    .exec();
};

Invoice.statics.updateDoc = function (invid, doc) {
  return this.findOneAndUpdate(
    { inv_id: invid },
    doc,
    { new: true }
  )
    .exec();
};

Invoice.statics.deleteByInvid = function (invid) {
  return this.deleteOne({inv_id: invid}).exec();
};

Invoice.statics.deleteByPid = function (pid) {
  return this.deleteOne({ p_id: pid }).exec();
};

module.exports = Invoice;
