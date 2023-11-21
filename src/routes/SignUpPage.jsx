import React, { useState } from 'react';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import BackButton from '../components/widgets/BackButton/BackButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import Container from '@mui/material/Container';
import Footer from '../components/widgets/Footer/Footer';
import Typography from '@mui/material/Typography';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../components/widgets/AlertBox/AlertBox';
import { ref, push, database } from '../firebase';
import { child, set } from '@firebase/database';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState(false);
  const [inputValues, setInputValues] = useState({
    forename: '',
    middleName: '',
    surname: '',
    email: '',
    telephone: '',
    officeTelephone: '',
    gpIdNumber: '',
    personalAddress: '',
    officeAddress: '',
    password: '',
  });

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputValues({
      ...inputValues,
      [field]: value,
    });
    setInputError({
      ...inputError,
      [field]: value.trim() === '',
    });
  };

  // Format validation
  const isNameValid = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };
  const isPhoneNumberValid = (telephone) => {
    const phoneRegex = /^\d{10}$/; // For a 10-digit phone number
    return phoneRegex.test(telephone);
  };
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isGPIDValid = (gpIdNumber) => {
    const gpIDRegex = /^\d{10}$/; // Matches exactly 10 digits
    return gpIDRegex.test(gpIdNumber);
  };
  const isAddressValid = (address) => {
    const addressRegex = /^[a-zA-Z0-9\s,.'-]+$/;
    return addressRegex.test(address);
  };

  const createAccount = (e) => {
    e.preventDefault();

    const isForenameInputValid = isNameValid(inputValues.forename);
    const isSurnameInputValid = isNameValid(inputValues.surname);
    const isEmailAddressInputValid = isEmailValid(inputValues.email);
    const isPhoneNumberInputValid = isPhoneNumberValid(inputValues.telephone);
    const isGPIDInputValid = isGPIDValid(inputValues.gpIdNumber);
    const isPersonalAddressInputValid = isAddressValid(
      inputValues.personalAddress
    );
    const isOfficeAddressInputValid = isAddressValid(inputValues.officeAddress);

    if (!isForenameInputValid) {
      setErrorMessage('Please enter a valid name.');
      return;
    } else if (!isSurnameInputValid) {
      setErrorMessage('Please enter a valid surname.');
      return;
    } else if (!isEmailAddressInputValid) {
      setErrorMessage('Please enter a valid email.');
      return;
    } else if (!isPhoneNumberInputValid) {
      setErrorMessage('Please enter a valid phone number. e.g. 0831234567');
      return;
    } else if (!isGPIDInputValid) {
      setErrorMessage('GPID must be 10 numerical digits in length.');
      return;
    } else if (!isPersonalAddressInputValid) {
      setErrorMessage('Please enter a valid personal address.');
      return;
    } else if (!isOfficeAddressInputValid) {
      setErrorMessage('Please enter a valid office address.');
      return;
    }

    // Check if any required fields are empty
    const requiredFields = [
      'forename',
      'surname',
      'email',
      'telephone',
      'gpIdNumber',
      'personalAddress',
      'officeAddress',
      'password',
    ];
    const hasEmptyField = requiredFields.some((field) => !inputValues[field]);
    if (hasEmptyField) {
      setInputError((prevErrors) => ({
        ...prevErrors,
        ...requiredFields.reduce((acc, field) => {
          acc[field] = !inputValues[field];
          return acc;
        }, {}),
      }));
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!password) {
      setInputError((prevErrors) => ({
        ...prevErrors,
        password: true,
      }));
      return;
    }

    //Function to push user info to database under 
    const addUserInfoToFirebase = (userInfo, uid) => {
      const dbRef = ref(database, 'doctors'); //pushes to doctor db
      console.log(dbRef);
      set(child(dbRef, uid), userInfo); //sets info in db to given user info
    };


    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(userCredential);
        navigate('/home');
        // Set the display name for the user
        const displayName = inputValues.forename + ' ' + inputValues.surname;

        updateProfile(user, {
          displayName: displayName,
        });
        console.log(inputValues);
        //Creates const userInfo
        const userInfo = {
          forename: inputValues.forename,
          middleName: inputValues.middleName,
          surname: inputValues.surname,
          email: inputValues.email,
          telephone: inputValues.telephone,
          gpIdNumber: inputValues.gpIdNumber,
          personalAddress: inputValues.personalAddress,
          officeAddress: inputValues.officeAddress,
        };

        //pushes userInfo to firebase database
        addUserInfoToFirebase(userInfo, userCredential.user.uid);
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('Email is already in use.');
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      });
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

  // small text in header of page
  const mandatoryStyle = {
    color: 'red',
    fontFamily: 'Roboto, sans-serif',
  };

  // to display padding between sign up and mandatory
  const spaceStyle = {
    marginRight: '10px',
  };

  const backButtonStyle = {
    marginRight: 'auto',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
          {' '}
          {/** Header of the page */}
          <BackButton style={backButtonStyle} />
          <Typography variant="h4" align="left">
            Sign Up
          </Typography>
          <span style={spaceStyle}></span>
          <Typography variant="h7" align="left" style={mandatoryStyle}>
            Mandatory *
          </Typography>
        </div>
        <Stack direction="row" spacing={2} justifyContent="center">
          {/** Stacking textfields in 4, 4, 2 + 1 button */}
          <div style={columnStyle}>
            <TextField
              label="Forename"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.forename}
              onChange={handleInputChange('forename')}
              error={inputError['forename']}
              helperText={
                inputError['forename'] ? 'Forename cannot be blank' : ''
              }
            />
            <TextField
              label="Middle Name"
              variant="filled"
              style={inputStyle}
              InputProps={{ disableUnderline: true }}
              value={inputValues.middleName}
              onChange={handleInputChange('middleName')}
            />

            <TextField
              label="Surname"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.surname}
              onChange={handleInputChange('surname')}
              error={inputError['surname']}
              helperText={
                inputError['surname'] ? 'Surname cannot be blank' : ''
              }
            />

            <TextField
              label="Email Address"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange('email')(e);
              }}
              error={inputError['email']}
              helperText={inputError['email'] ? 'Email cannot be blank' : ''}
            />
          </div>
          <div style={columnStyle}>
            <TextField
              label="Telephone"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.telephone}
              onChange={handleInputChange('telephone')}
              error={inputError['telephone']}
              helperText={
                inputError['telephone'] ? 'Phone cannot be blank' : ''
              }
            />

            <TextField
              label="GP ID number"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.gpIdNumber}
              onChange={handleInputChange('gpIdNumber')}
              error={inputError['gpIdNumber']}
              helperText={
                inputError['gpIdNumber'] ? 'GP ID Number cannot be blank' : ''
              }
            />

            <TextField
              label="Personal Address"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.personalAddress}
              onChange={handleInputChange('personalAddress')}
              error={inputError['personalAddress']}
              helperText={
                inputError['personalAddress']
                  ? 'Personal address cannot be blank'
                  : ''
              }
            />
          </div>
          <div style={columnStyle}>
            <TextField
              label="Office Address"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.officeAddress}
              onChange={handleInputChange('officeAddress')}
              error={inputError['officeAddress']}
              helperText={
                inputError['officeAddress']
                  ? 'Office address cannot be blank'
                  : ''
              }
            />
            <TextField
              label="Password"
              type="password"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleInputChange('password')(e);
              }}
              error={inputError['password']}
              helperText={
                inputError['password'] ? 'Password cannot be blank' : ''
              }
            />
            {/** Sign Up Button */}
          </div>
        </Stack>
        <div style={buttonContainerStyle}>
          <PrimaryButton
            text={'Sign Up'}
            action={createAccount}
            state={'active'}
          />{' '}
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default SignUpPage;
