import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import PaymentForm from './PaymentForm';
import ReviewPayment from './ReviewPayment';
import { useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { UserAuth } from '../../components/auth/AuthContext';
import { ref, get, update } from 'firebase/database';
import { Typography } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Health AI
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['Payment details', 'Review your order'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <PaymentForm />;
    case 1:
      return <ReviewPayment />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const { user } = UserAuth();
  const [message, setMessage] = useState('');

  const setPatientSubscribed = async () => {
    if (!user.uid) {
      console.error('User ID is undefined.');
      return;
    }

    const patientsRef = ref(database, 'patients');

    try {
      const snapshot = await get(patientsRef);
      if (snapshot.exists()) {
        const allPatientsData = snapshot.val();

        // Access the specific patient using the user's UID
        const specificPatientKey = user.uid;
        const specificPatientData = allPatientsData[specificPatientKey];

        if (specificPatientData) {
          console.log('Specific Patient Data:', specificPatientData);

          // Reference to the specific patient using their key
          update(ref(database, 'patients/' + user.uid), {
            subscribed: true,
          });

          console.log(
            `Patient with key ${specificPatientKey} has been subscribed.`
          );
        } else {
          console.log(
            `No data found for patient with key ${specificPatientKey}`
          );
          setMessage('There was an error please try again.');
        }
      } else {
        console.log(`No data found for patients`);
      }
    } catch (error) {
      console.error('Error accessing patient data:', error);
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if ((activeStep === steps.length) & (message === '')) {
      const redirectTimeout = setTimeout(() => {
        setPatientSubscribed().then(navigate('/home'));
        // Navigate to /home after a delay
      }, 3000); // Adjust the delay as needed (in milliseconds)

      return () => clearTimeout(redirectTimeout);
    }
  }, [activeStep, navigate]);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Health AI
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. Redirecting to home...
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </React.Fragment>
  );
}
