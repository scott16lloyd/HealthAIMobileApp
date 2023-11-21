import React from 'react';
import { Card, Avatar, Typography, ButtonBase } from '@mui/material';

function stringToColor(string) {
  if (string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  } else {
    let color = '#D9D9D9';
    return color;
  }
}

function stringAvatar(name) {
  if (name && typeof name === 'string') {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  } else {
    return 'n/a';
  }
}

function PatientOverviewWidget({ name, id }) {
  const avatarContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '40%',
    paddingLeft: '1rem',
  };

  const textContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
    paddingLeft: '1rem',
  };

  return (
    <ButtonBase
      sx={{
        borderRadius: 5,
        width: {
          xs: 160,
          sm: 200,
          md: 240,
          lg: 280,
          xl: 320,
        },
        height: 150,
        backgroundColor: '#F9F9F9',
        display: 'flex',
        padding: '0.2rem',
      }}
    >
      <Card
        size="md"
        variant="outlined"
        sx={{
          width: 320,
          height: 150,
          borderRadius: 5,
          backgroundColor: '#F9F9F9',
          display: 'flex',
          transition: '0.3s', // Optional: Add a transition for smooth hover effect
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
        style={{
          boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
          backdropFilter: 'blur(1.5px)',
        }}
      >
        <div style={avatarContainerStyles}>
          <Avatar
            style={{
              height: '80px',
              width: '80px',
              fontSize: '2rem',
            }}
            variant="outlined"
            alt="Default Profile Image"
            {...stringAvatar(name)}
          />
        </div>
        <div style={textContainerStyles}>
          <Typography
            sx={{
              fontSize: '2rem',
            }}
            style={{ textAlign: 'left' }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontSize: '1.2rem',
            }}
          >
            ID: {id}
          </Typography>
        </div>
      </Card>
    </ButtonBase>
  );
}

export default PatientOverviewWidget;
