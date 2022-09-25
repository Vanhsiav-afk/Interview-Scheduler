const mongoose = require('mongoose');

const InterviewSchema = mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    participantsHere:[]
},{timestamps:true})

module.exports = mongoose.model("Interviews",InterviewSchema);