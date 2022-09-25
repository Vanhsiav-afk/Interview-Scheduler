const router = require('express').Router();
const Participant = require('../schema/Participant')

//CONVERT START AND END TIME TO IST : +5.30
//DEFAULT DB : UTC
router.get("/:id", async(req,res)=>{
    try {
        console.log("FIRED");
        const participant = await Participant.findById(req.params.id);
        res.send(participant);
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/find/all", async(req,res)=>{
    try {
        const participants = await Participant.find();
        res.send(participants);
    } catch (error) {
        res.status(500).json(error)
    }
})



router.post("/",async(req,res)=>{
    
    const newParticipant = new Participant(req.body)
    console.log("EWFWFE",newParticipant)
    try {
        const savedParticipant = await newParticipant.save();
        res.send(savedParticipant);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router