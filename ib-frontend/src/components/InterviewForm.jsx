import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import React from 'react'
import dayjs from 'dayjs';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Button from '@mui/material/Button';
import './InterviewForm.css'
import { useState } from 'react';
import { useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import axios from 'axios'
import moment from 'moment'
import 'moment-timezone'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


const InterviewForm = ({onInterviewSubmit,interviewDetails,participants}) => {

    const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));

    const [interview, setInterview] = useState({
        date:"2014-08-18",
        startTime:"2014-08-18T21:11:54",
        endTime:"2014-08-18T21:11:54",
        participantsHere:[]
    });

    const [emails, setEmails] = useState([])
    const [selectedEmails, setSelectedEmails] = useState([])

    //YE DEKHNA
    useEffect(() => {
      if(interviewDetails){
        setInterview(interviewDetails)
        // setValue(interviewDetails.startTime)
      }

      if(interviewDetails && interviewDetails.participantsHere){
        let tmp = [];

        for(var i=0;i<participants.length;i++){
            if(interviewDetails.participantsHere.includes(participants[i]._id)){
                tmp.push(participants[i].email);
            }
        }
        setSelectedEmails(tmp);
      }
    }, [interviewDetails])
    

    const handleChangeDate = (event) => {
        var tmpDate = new Date(event.$d);
        var a = moment.utc(tmpDate).tz("Asia/Kolkata");
        tmpDate = a.format();        
        tmpDate = tmpDate.split("T")[0];
        interview.date = tmpDate;
        setInterview({...interview})
    };
    const handleChangeStartTime = (event) => {
        setValue(event);
        var tmpTime = new Date(event.$d);
        var a = moment.utc(tmpTime).tz("Asia/Kolkata");
        var timeIST = a.format();        
        timeIST = timeIST.split("T")[1];
        timeIST = timeIST.substring(5,-1)
        timeIST = timeIST+":00.000";

        var date = interview.date.split("T")[0];
        timeIST = String(date)+"T"+timeIST

        interview.startTime = timeIST;
        setInterview({...interview})

        
        
    }
    const handleChangeEndTime = (event) => {
        setValue(event);
        var tmpTime = new Date(event.$d);
        var a = moment.utc(tmpTime).tz("Asia/Kolkata");
        var timeIST = a.format();        
        timeIST = timeIST.split("T")[1];
        timeIST = timeIST.substring(5,-1)
        timeIST = timeIST+":00.000";

        var date = interview.date.split("T")[0];
        timeIST = String(date)+"T"+timeIST

        interview.endTime = timeIST;
        setInterview({...interview})
    }

    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);
  
    const handleChangeParticipants = (event) => {
      const {
        target: { value },
      } = event;

      
        // On autofill we get a stringified value.
        setSelectedEmails(typeof value === 'string' ? value.split(',') : value);
      
      
    //   console.log("FINAL",selectedEmails);
    };

 

  useEffect(() => {
    var tmpEmails = [];
    for(var i=0;i<participants.length;i++){
        tmpEmails.push(participants[i].email)
    }
    setEmails(tmpEmails);
  }, [participants])
  
  const handleInterviewCreate = () => {

    var date = interview.date.split("T")[0];
    var tmpStartTime = interview.startTime.split("T")[1];
    var tmpEndTime = interview.endTime.split("T")[1];

    interview.startTime = date+"T"+tmpStartTime;
    interview.endTime = date+"T"+tmpEndTime;


    let tmp = []
    for(var i=0;i<participants.length;i++){
        if(selectedEmails.includes(participants[i].email)){
            tmp.push(participants[i]._id);
        }   
    }
    interview.participantsHere = tmp;
    const tmpInterview = {...interview};
    onInterviewSubmit(tmpInterview);
    setInterview({...interview});
  }


  return (
    <Container maxWidth="xs" className="interviewFormContainer">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
                <DesktopDatePicker
                label="Interview Date"
                inputFormat="MM/DD/YYYY"
                value={interview.date}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                label="Interview Start Time"
                value={interview.startTime}
                onChange={handleChangeStartTime}
                renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                label="Interview End Time"
                value={interview.endTime}
                onChange={handleChangeEndTime}
                renderInput={(params) => <TextField {...params} />}
                />

            </Stack>
            </LocalizationProvider>
            <br />
           

            <div>
            <InputLabel id="demo-multiple-name-label">Participants</InputLabel>
                <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={selectedEmails}
                onChange={handleChangeParticipants}
                label="Participants"
                MenuProps={MenuProps}
                >
                {emails.map((name) => (
                    <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(emails, selectedEmails, theme)}
                    >
                    {name}
                    </MenuItem>
                ))}
                </Select>
            </div>
                    <br/>
            <div>
                {/* handle submit me bhi append date selected (interview.date) */}
                <Button onClick={handleInterviewCreate} variant="outlined">SUBMIT</Button>
            </div>

    </Container>
  )
}

export default InterviewForm