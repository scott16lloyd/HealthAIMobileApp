import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import TopNavigationBar from '../../components/widgets/TopNavigationBar/TopNavigationBar';
import AlertBox from '../../components/widgets/AlertBox/AlertBox';
import { Container, Typography, Stack, TextField } from '@mui/material';
import BackButton from '../../components/widgets/BackButton/BackButton';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';
import { UserAuth } from '../../components/auth/AuthContext';
import { database } from '../../firebase';
import { ref, get } from 'firebase/database';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = UserAuth();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successful sign-in
        console.log('Sign-in successful');
        // Navigate to home or do other actions upon successful sign-in
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

  const checkCompleteProfile = async (user) => {
    const patientsRef = ref(database, `patients/${user.uid}`);
    console.log(patientsRef);
    try {
      const userSnapshot = await get(patientsRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        console.log(userData);
        if (!userData.insuranceProvider) {
          navigate('/mobileInsuranceDetails');
        } else if (userData.subscribed === false) {
          navigate('/mobilePlanSelection');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (user != null && checkCompleteProfile(user)) {
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

  const troubleLoggingInSectionStyle = {
    marginTop: '20px',
    textAlign: 'center',
    fontFamily: 'Roboto, sans-serif',
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
          style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}
        >
          <BackButton style={backButtonStyle} goBackPath={'/'} />
          <Typography variant="h5" paddingLeft={'35px'}>
            Login
          </Typography>
          <span style={spaceStyle}></span>
        </div>
        <Stack direction="row" spacing={2} justifyContent="center">
          {' '}
          <div style={columnStyle}>
            <Typography fontSize={'15px'} paddingLeft={'20px'}>
              Using your temporary password.
            </Typography>
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
            <div style={troubleLoggingInSectionStyle}>
              Trouble logging in?{' '}
              <Link to="/help" style={{ textDecoration: 'underline' }}>
                Click here.
              </Link>
            </div>
          </div>
        </Stack>
      </Container>
    </>
  );
}

export default SignInPage;
