const mongoose = require('mongoose');

const ParticipantSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    interviewSchedule:[]
},{timestamps:true})

module.exports = mongoose.model("Participants",ParticipantSchema);