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
  return (
    <ButtonBase
      sx={{
        borderRadius: 5,
        width: '100%',
        backgroundColor: '#F9F9F9',
        display: 'flex',
        padding: '0.2rem',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: 5,
          backgroundColor: '#F9F9F9',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          transition: '0.3s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
        style={{
          boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
          backdropFilter: 'blur(1.5px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          <Avatar
            style={{
              height: '60px',
              width: '60px',
              fontSize: '1.5rem',
              marginRight: '1rem',
            }}
            variant="outlined"
            alt="Default Profile Image"
            {...stringAvatar(name)}
          />
          <div>
            <Typography
              sx={{
                fontSize: '1.2rem',
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
              }}
            >
              ID: {id}
            </Typography>
          </div>
        </div>
      </Card>
    </ButtonBase>
  );
}

export default PatientOverviewWidget;
