import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import AlertBox from '../components/widgets/AlertBox/AlertBox';
import { Container, Typography, Stack, TextField } from '@mui/material';
import BackButton from '../components/widgets/BackButton/BackButton';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import SocialMediaSignInButton from '../components/widgets/SocialMediaSignInButton/SocialMediaSignInButton';
import { UserAuth } from '../components/auth/AuthContext';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { googleSignIn, user } = UserAuth();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Successful sign-in
        console.log('Sign-in successful');
        // Navigate to home or do other actions upon successful sign-in
        navigate('/home');
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'auth/invalid-login-credentials') {
          setErrorMessage('Invalid login credentials.');
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email.');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate('/home');
    }
  });

  // Styling
  const backButtonStyle = {
    marginRight: 'auto',
  };

  const spaceStyle = {
    marginRight: '10px',
  };

  const mandatoryStyle = {
    color: 'red',
    fontFamily: 'Roboto, sans-serif',
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const inputStyle = {
    margin: '20px 40px',
    width: '100%',
    borderRadius: '11px',
    background:
      'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(1.5px)',
  };

  const socialButtonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <TopNavigationBar />
      <AlertBox
        message={errorMessage}
        severity={'error'}
        onClose={() => setErrorMessage('')}
      />
      <Container>
        <div
          style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}
        >
          <BackButton style={backButtonStyle} goBackPath={'/'} />
          <Typography variant="h4" align="left">
            Login
          </Typography>
          <span style={spaceStyle}></span>
          <Typography variant="h7" align="left" style={mandatoryStyle}>
            Mandatory *
          </Typography>
        </div>
        <Stack direction="row" spacing={2} justifyContent="center">
          {' '}
          {/** Stacking textfields in 4, 4, 2 + 1 button */}
          <div style={columnStyle}>
            <TextField
              label="Email"
              variant="filled"
              type="email"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true, autoComplete: 'email' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="filled"
              type="password"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PrimaryButton
              text={'Login'}
              type="submit"
              action={signIn}
              state={'active'}
            />{' '}
          </div>
        </Stack>
        <div style={socialButtonContainerStyle}>
          <SocialMediaSignInButton
            socialPlatform={'google'}
            action={handleGoogleSignIn}
          />
        </div>
      </Container>
    </>
  );
}

export default SignInPage;
