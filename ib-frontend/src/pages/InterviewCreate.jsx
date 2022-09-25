import React, { useEffect } from 'react'
import { useState } from 'react'
import InterviewForm from '../components/InterviewForm'
import axios from 'axios'
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';


const InterviewCreate = () => {
    const [participants, setParticipants] = useState([])
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMsg, setErrorMsg] = useState()

    const navigate = useNavigate();

    useEffect(() => {
        const getParticipants = async () => {
          try {
  
              const res = await axios.get("http://localhost:5000/api/participants/find/all")
              console.log("FETCHED",res.data); 
              setParticipants(res.data)
  
          } catch (error) {
            console.log("ERR",error)
          }
      };
      getParticipants();
    
      }, [])


      const handleInterviewSubmit = async (interview) => {
        console.log("FINAL",interview)
        

        try {
            if(interview.startTime>=interview.endTime){
                setErrorMsg("Start Time should be before End Time")
            } else {
                const res = await axios.post("http://localhost:5000/api/interviews/",interview);
                console.log("SAVED",res.data);
                navigate("/interviews")
            }

        } catch (error) {
            console.log("ERR",error.response.data)
            setErrorMsg(error.response.data);

        }
      }

  return (
    <div>
        <Navbar/>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <InterviewForm onInterviewSubmit={(interview)=>handleInterviewSubmit(interview)} participants={participants} />
    </div>
  )
}

export default InterviewCreate