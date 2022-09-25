import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import { useState } from 'react';
import moment from 'moment'
import 'moment-timezone'
import axios from 'axios'

const Interview = ({onInterviewDelete,interview}) => {
    console.log("SINGLE",interview);

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('')

    const [emails, setEmails] = useState([])

    useEffect(() => {

      const getParticipantDetail = async () => {
        try {
          let tmp = []
          for(var i=0;i<interview.participantsHere.length;i++){
            const res = await axios.get(`http://localhost:5000/api/participants/${interview.participantsHere[i]}`)
            console.log("FETCHED",res.data); 
            tmp.push(res.data.email)
          }

          console.log("TMP",tmp);

          setEmails(tmp);

        } catch (error) {
          console.log("ERR",error)
        }
    };

    getParticipantDetail();

      var a = moment.utc(interview.date).tz("Asia/Kolkata");
      var tmpDate = a.format();        
      tmpDate = tmpDate.split("T")[0];
      setDate(tmpDate);

      var a = moment.utc(interview.startTime).tz("Asia/Kolkata");
      var timeIST = a.format();        
      var timeIST = timeIST.split("T")[1];
      timeIST = timeIST.substring(5,-1)
      setStartTime(timeIST);

      var a = moment.utc(interview.endTime).tz("Asia/Kolkata");
      var timeIST = a.format();        
      var timeIST = timeIST.split("T")[1];
      timeIST = timeIST.substring(5,-1)
      setEndTime(timeIST);
      
    }, [interview])
    

    const handleInterviewDelete = () => {
      //calls its parent
      onInterviewDelete(interview._id)
    }

  return (
    <Grid item xs={4}>
        <Card sx={{ minWidth: 275 }} style={{maxHeight: 200, overflow: 'auto'}}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Date: {date}
            </Typography>
           
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Start Time: {startTime}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              End Time: {endTime}
            </Typography>
            {emails.map((email)=>(
              <p key={email}>{email}</p>
            ))}
          </CardContent>
          <CardActions>

          <Link to={`/interviews/edit/${interview._id}`}>
            <Button size="small">Edit</Button>
          </Link>

            
            <Button size="small" onClick={handleInterviewDelete}>Delete</Button>
          </CardActions>
        </Card>
    </Grid>
  )
}

export default Interview