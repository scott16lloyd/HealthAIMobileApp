import React from 'react';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function TopNavigationBar({ aboutNav, helpNav }) {
  const healthAIStyle = {
    color: '#000',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '96px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
  };

  const developedByStyle = {
    color: '#747171',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 500,
    textAlign: 'left',
    paddingLeft: '5px',
    lineHeight: 'normal',
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100px',
        display: 'flex',
        flexDirection: 'column', 
        marginTop: '30px',
        alignItems: 'center', 
        justifyContent: 'center', 
      }}
    >
      <Button
        variant="text"
        size="large"
        sx={{
          fontSize: 30,
          boxShadow: 'none',
          margin: '0.5rem',
          textTransform: 'none',
        }}
        component={Link}
        to="/home"
        style={{ textAlign: 'center' }} 
      >
        <Box>
          <Typography variant="h1" style={healthAIStyle}>
            <span>Health</span>
            <span style={{ color: '#268AFF' }}>AI</span>
          </Typography>
          <Typography variant="h6" style={developedByStyle}>
            Developed by SSSD
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}

export default TopNavigationBar;
