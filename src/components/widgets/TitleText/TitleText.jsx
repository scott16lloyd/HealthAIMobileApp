import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function TitleText() {
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
    lineHeight: 'normal',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Button
        variant="text"
        size="large"
        sx={{
          fontSize: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          boxShadow: 'none',
          textTransform: 'none',
        }}
        component={Link}
        to="/home"
      >
        <Typography variant="h1" style={healthAIStyle}>
          <span>Health</span>
          <span style={{ color: '#268AFF' }}>AI</span>
        </Typography>
        <Typography variant="h6" style={developedByStyle}>
          Developed by SSSD
        </Typography>
      </Button>
    </div>
  );
}

export default TitleText;
