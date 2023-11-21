import React from 'react';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import Doctor from '../images/doctorImage.png';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import Footer from '../components/widgets/Footer/Footer';

function LandingPage() {
  return (
    <>
      <TopNavigationBar />
      <div
        style={{
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <img alt="Doctor" src={Doctor} style={{ maxHeight: '700px' }}></img>{' '}
        {/* Adjust the maxHeight */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            backgroundColor: '#2655FF',
            height: '700px',
            borderTopLeftRadius: '5rem',
            borderBottomLeftRadius: '5rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h2"
            margin="2rem"
            sx={{
              color: 'white',
              width: '500px',
              textAlign: 'center',
            }}
          >
            Welcome Medical Professional
          </Typography>
          <PrimaryButton
            component={Link}
            to="/signUp"
            text={'Sign Up'}
            color={'rgba(217,217,217,0.4)'}
            state={'active'}
          />
          <PrimaryButton
            component={Link}
            to="/login"
            text={'Login'}
            color={'rgba(217,217,217,0.4)'}
            state={'active'}
          />
        </Box>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
