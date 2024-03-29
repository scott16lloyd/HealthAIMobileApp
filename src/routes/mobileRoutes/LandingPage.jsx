import React from 'react';
import TopNavigationBar from '../../components/widgets/TopNavigationBar/TopNavigationBar';
import Patient from '../../images/loginPatient.png';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';

function LandingPage() {
  const outerWrapperStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  };
  return (
    <>
      <div style={outerWrapperStyle}>
        <TopNavigationBar />
        <div>
          <img
            alt="Doctor"
            src={Patient}
            style={{ width: '100%', maxWidth: '600px' }}
          />
        </div>
        <div
          style={{
            paddingTop: '20px',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '85vw',
              maxWidth: '400px',
              height: '100%',
              borderRadius: '54px 54px 0 0',
              background:
                'linear-gradient(120deg, rgba(38, 85, 255, 0.80) 26.35%, rgba(0, 117, 255, 0.60) 83.58%)',
              boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
              backdropFilter: 'blur(1.5px)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                textAlign: 'center',
                fontSize: '50px',
                marginBottom: '20px',
              }}
            >
              Welcome Patient
            </Typography>
            <PrimaryButton
              component={Link}
              to="/login"
              text={'Login'}
              color={'rgba(217,217,217,0.4)'}
              state={'active'}
            />
          </Box>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
