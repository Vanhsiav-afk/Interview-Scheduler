import React, { useState } from 'react'
import InterviewForm from '../components/InterviewForm'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios'
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';

const InterviewEdit = () => {
    const location = useLocation();
    const interviewID = location.pathname.split("/")[3];
    console.log("URL",interviewID);

    const navigate = useNavigate();

    const [participants, setParticipants] = useState([])
    const [interview, setInterview] = useState({
        date:"2014-08-18",
        startTime:"2014-08-18T21:11:54",
        endTime:"2014-08-18T21:11:54",
        participantsHere:[]
    })
    const [errorMsg, setErrorMsg] = useState()

    useEffect(() => {
        const getInterview = async () => {
            try {
    
                const res = await axios.get(`http://localhost:5000/api/interviews/${interviewID}`)
                console.log("FETCHED",res.data); 
                setInterview(res.data)
    
            } catch (error) {
              console.log("ERR",error)
            }
        };
        getInterview();

        const getParticipants = async () => {
            try {
    
                const res = await axios.get("http://localhost:5000/api/participants/find/all")
                console.log("FETCHED2",res.data); 
                setParticipants(res.data)
    
            } catch (error) {
              console.log("ERR",error)
            }
        };
        getParticipants();
    }, [interviewID])

    const handleInterviewEdit = async (interviewUpdated) => {
        try {
            const {createdAt,updatedAt,__v,_id,...filteredData} = interviewUpdated;

            const res = await axios.put(`http://localhost:5000/api/interviews/${interview._id}`,filteredData);
            console.log("EDITED",res.data);
            navigate("/interviews")
        } catch (error) {
            setErrorMsg(error.response.data);
        }
    }
    

  return (
    <div>
        <Navbar/>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <InterviewForm onInterviewSubmit={(interview)=> handleInterviewEdit(interview)} participants={participants} interviewDetails={interview}/>
    </div>
  )
}

export default InterviewEdit