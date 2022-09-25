import React from 'react'
import Interview from './Interview'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import './Interviews.css'

const Interviews = ({onInterviewDeleteMain,interviews}) => {

    const handleInterviewDelete = (id) => {
        onInterviewDeleteMain(id);
    }

  return (
    <Container maxWidth="md" className='interviewContainer'>
        <h1>Scheduled Interviews:</h1>
        <Grid container spacing={2}>
            {interviews.map((item)=>(
                <Interview onInterviewDelete={(id)=>handleInterviewDelete(id)} interview={item} key={item._id}/>
            ))}
        </Grid>
    </Container>
  )
}

export default Interviews