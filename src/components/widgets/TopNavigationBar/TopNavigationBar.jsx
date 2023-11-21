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
    lineHeight: 'normal',
  };

  const aboutHelpStyle = {
    color: '#000',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '45px',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: '12px',
    letterSpacing: '0.15px',
    fontFeatureSettings: "'clig' off, 'liga' off",
  };

  return (
    <Box
      sx={{
        width: '50%',
        height: '160px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', margin: '0.5rem' }}
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
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          padding: '1rem',
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
          to="/about"
        >
          <Typography variant="h2" style={aboutHelpStyle}>
            About
          </Typography>
        </Button>
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
          to="/help"
        >
          <Typography variant="h2" style={aboutHelpStyle}>
            Help
          </Typography>
        </Button>
      </div>
    </Box>
  );
}

export default TopNavigationBar;
