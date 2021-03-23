"use strict";const Schema=require("mongoose").Schema;var Treatment=new Schema({t_id:{type:String,required:!0,index:!0,unique:!0},p_id:{type:String,required:!0,index:!0},procedure_done:{type:String,default:""},teeth_number:[{type:Number}],treatment_date:{type:Date,default:Date.now},doctor:{type:String},remarks:{type:String,default:null},created_at:{type:Date,default:Date.now}});// ALT MOST RECENT TREATMENT ID
// db.patients.aggregate({ $group: { _id: null, max: { $max: '$Age' }}})
// find().sort().limit()
Treatment.statics.getAll=function(){return this.find({},{_id:0,__v:0}).sort("-created_at").lean().exec()},Treatment.statics.countAll=function(){return this.countDocuments()},Treatment.statics.getByTid=function(a){return this.findOne({t_id:a},{_id:0,__v:0}).lean().exec()},Treatment.statics.findInTid=function(a){return this.find({t_id:{$in:a}},{_id:0,__v:0}).lean().exec()},Treatment.statics.findByPid=function(a){return this.find({p_id:a},{_id:0,__v:0}).lean().exec()},Treatment.statics.getLatestTid=function(){return this.find({},{t_id:1,_id:0}).sort("-created_at").limit(1).exec()},Treatment.statics.countByPid=function(a){return this.find({p_id:a}).countDocuments()},Treatment.statics.findByDoctor=function(a){return this.find({doctor:a},{_id:0,__v:0}).sort("-treatment_date").lean().exec()},Treatment.statics.countByDoctor=function(a){return this.find({doctor:a}).countDocuments()},Treatment.statics.getDistinctProcedures=function(){return this.distinct("procedure_done")},Treatment.statics.findBetweenDate=function(a,b){return this.find({$and:[{treatment_date:{$gte:a}},{treatment_date:{$lte:b}}]},{_id:0,__v:0}).lean().exec()},Treatment.statics.updateDoc=function(a,b){return this.findOneAndUpdate({t_id:a},{$set:b},{upsert:!0}).exec()},Treatment.statics.deleteByTid=function(a){return this.deleteOne({t_id:a}).exec()},module.exports=Treatment;