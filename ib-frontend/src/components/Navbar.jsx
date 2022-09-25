import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
  return (
    <AppBar position="static">
        <Toolbar>

        
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to={`/interviews/`} className='link'>
                HOME
            </Link>
        </Typography>

        <Link to={`/interviews/create`} className='link'>
            <Button className='button-link'>Create</Button>
        </Link>
        </Toolbar>
  </AppBar>
  )
}

export default Navbar