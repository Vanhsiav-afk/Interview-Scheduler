const router = require('express').Router();
const Interview = require('../schema/Interview')
const Participant = require('../schema/Participant')

 const getParticipantData = async (participantID) => {
    const participantData = await Participant.findById(participantID);
    return participantData
}

//CONVERT START AND END TIME TO IST : +5.30
//DEFAULT DB : UTC
router.get("/find/all", async(req,res)=>{
    try {
        const interviews = await Interview.find();
        res.send(interviews)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET SINGLE
router.get("/:id", async(req,res)=>{
    try {
        const interviews = await Interview.findById(req.params.id);
        res.send(interviews)
    } catch (error) {
        res.status(500).json(error)
    }
})


//CREATE INTERVIEW
router.post("/",async(req,res)=>{
    const newInterview = new Interview(req.body)

    let startTime = new Date(req.body.startTime).toUTCString();
    startTime = new Date(startTime);
    let endTime = new Date(req.body.endTime).toUTCString();
    endTime = new Date(endTime);

    //add this interview for the participant schedule
    const participants = req.body.participantsHere;

    if(!participants || participants.length<2){
        res.status(400).json("Not enough participants");
        return;
    }

    for(let i=0;i<participants.length;i++){
        let participantData = await Participant.findById(participants[i]);
        console.log("PARTICIPANT DATA",participantData)
        let interviewSchedule = []

        if(participantData.interviewSchedule){
            interviewSchedule = participantData.interviewSchedule;
        }
        for(let i=0;i<interviewSchedule.length;i++){
            let interviewData = await Interview.findById(interviewSchedule[i]);
            console.log("INTERVIEW DATA",interviewData);
            const currStartTime = interviewData.startTime
            const currEndTime = interviewData.endTime

            if(!(endTime<currStartTime || startTime>currEndTime)){
                res.status(400).json("Participant Busy")
                return;
            }
        }
    }
   
    try {
        const savedInterview = await newInterview.save();

        for(let i=0;i<participants.length;i++){
            let participantData = await Participant.findById(participants[i]);
            participantData.interviewSchedule.push(savedInterview._id.toHexString());
            
            const {createdAt,updatedAt,__v,_id,...filteredData} = participantData._doc;
            const updatedParticipant = await Participant.findByIdAndUpdate(
                participants[i],filteredData,{new:true}
            )
        }

        res.send(newInterview);
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE INTERVIEW

//same as create + if change in participants,  participantsRemoved array and remove interviews from their schema too
router.put("/:id",async(req,res)=>{
    const updatedInterview = await Interview.findById(req.params.id);

    let startTime = new Date(req.body.startTime).toUTCString();
    startTime = new Date(startTime);
    let endTime = new Date(req.body.endTime).toUTCString();
    endTime = new Date(endTime);

    //add this interview for the participant schedule
    const participantsCurr = req.body.participantsHere;

    //participant for whom interview is to be deleted
    const prevParticipants = updatedInterview.participantsHere;
    let participantsToDelete = [];
    let participants = [];
    let newParticipants = [];

    //FOR PREV
    for(var i=0;i<prevParticipants.length;i++){
        console.log("THIS");
        if(participantsCurr.includes(prevParticipants[i])){
            participants.push(prevParticipants[i]);
        } else {
            participantsToDelete.push(prevParticipants[i]);
        }
    }

    for(var i=0;i<participantsCurr.length;i++){
        if(!prevParticipants.includes(participantsCurr[i])){
            newParticipants.push(participantsCurr[i]);
        }
    }

    participants = participantsCurr

    console.log("PREV",prevParticipants)
    console.log("TO DELETE", participantsToDelete);
    console.log("FINAL P", participants);
    console.log("NEW",newParticipants)

    if(!participants || participants.length<2){
        res.status(400).json("Not enough participants");
        return;
    }

    for(let i=0;i<participants.length;i++){
        let participantData = await Participant.findById(participants[i]);
       
        let interviewSchedule = []

        if(participantData.interviewSchedule){
            interviewSchedule = participantData.interviewSchedule;
        }
        for(let i=0;i<interviewSchedule.length;i++){
            if(interviewSchedule[i]!=req.params.id){
                let interviewData = await Interview.findById(interviewSchedule[i]);
                const currStartTime = interviewData.startTime
                const currEndTime = interviewData.endTime

                if(!(endTime<currStartTime || startTime>currEndTime)){
                    res.status(400).json("Participant Busy")
                    return;
                }
            }
        }
    }
   
    try {


        //REMOVE INTERVIEW ID FOR DELETE PARTICIPANTS
        for(let i=0;i<participantsToDelete.length;i++){
            let participantData = await Participant.findById(participantsToDelete[i]);
            console.log("BEFORE",participantData);

            participantData.interviewSchedule = participantData.interviewSchedule.filter((interviewID)=>{
                return interviewID!=req.params.id
            })

            console.log("DELETED",participantData)
            
            const {createdAt,updatedAt,__v,_id,...filteredData} = participantData._doc;
            const updatedParticipant = await Participant.findByIdAndUpdate(
                participantsToDelete[i],filteredData,{new:true}
            )
        }
        

        //ADD INTERVIEW ID FOR NEW PARTICPANTS
        for(let i=0;i<newParticipants.length;i++){
            let participantData = await Participant.findById(newParticipants[i]);
            console.log("BEFORE ADD",participantData);

            participantData.interviewSchedule.push(req.params.id)

            console.log("AFTER ADD",participantData)    
            
            const {createdAt,updatedAt,__v,_id,...filteredData} = participantData._doc;
            const updatedParticipant = await Participant.findByIdAndUpdate(
                newParticipants[i],filteredData,{new:true}
            )
        }

        //UPDATE PARTICIPANTS HERE FOR CURR INTERVIEW
        const finalUpdatedInterview  = await Interview.findByIdAndUpdate(req.params.id, {$set:req.body} ,{new:true});

        res.send(finalUpdatedInterview);
    } catch (error) {
        res.status(500).json(error)
    }
})

//DELETE INTERVIEW
router.delete("/:id",async(req,res)=>{
    const interviewToDelete = await Interview.findById(req.params.id);

    //participant for whom interview is to be deleted
    let participantsToDelete = interviewToDelete.participantsHere;
   
    try {


        //REMOVE INTERVIEW ID FOR DELETE PARTICIPANTS
        for(let i=0;i<participantsToDelete.length;i++){
            let participantData = await Participant.findById(participantsToDelete[i]);
            console.log("BEFORE",participantData);

            participantData.interviewSchedule = participantData.interviewSchedule.filter((interviewID)=>{
                return interviewID!=req.params.id
            })

            console.log("DELETED",participantData)
            
            const {createdAt,updatedAt,__v,_id,...filteredData} = participantData._doc;
            const updatedParticipant = await Participant.findByIdAndUpdate(
                participantsToDelete[i],filteredData,{new:true}
            )
        }

        await Interview.findByIdAndDelete(req.params.id)
        res.status(200).json("Succesfully deleted!");
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router