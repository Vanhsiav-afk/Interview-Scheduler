import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Interviews from '../components/Interviews'
import axios from 'axios'
import Navbar from '../components/Navbar'

const InterviewsDetail = () => {

    const [interviews, setInterviews] = useState([])

    useEffect(() => {
      const getInterviews = async () => {
        try {

            const res = await axios.get("http://localhost:5000/api/interviews/find/all")
            console.log("FETCHED",res.data); 
            setInterviews(res.data)

        } catch (error) {
          console.log("ERR",error)
        }
    };
    getInterviews();
  
    }, [])

    const handleInterviewDeleteMain = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/interviews/${id}`);
        const res = await axios.get("http://localhost:5000/api/interviews/find/all")
        console.log("FETCHED",res.data); 
        setInterviews(res.data)
      } catch (error) {
        console.log("ERR",error)
      }
    }
    

    //FETCH HERE ALL
  return (
    <div>
      <Navbar/>
      <Interviews onInterviewDeleteMain={(id)=> handleInterviewDeleteMain(id)} interviews={interviews} />
    </div>
  )
}

export default InterviewsDetail