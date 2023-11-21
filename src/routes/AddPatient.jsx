import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../components/widgets/AlertBox/AlertBox';

import { getFirestore, collection, addDoc } from 'firebase/firestore'; 
function AddPatient() {
  const navigate = useNavigate();
  const db = getFirestore(); // Initialize Firestore

  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState(false);
  const [inputValues, setInputValues] = useState({
    forename: '',
    middleName: '',
    surname: '',
    email: '',
    telephone: '',
    PPSNumber: '',
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

  const createAccount = (e) => {
    e.preventDefault();

    // Validation code here (same as your previous code)

    // Now, if all validation checks pass, you can send the data to Firestore

    const userData = {
      forename: inputValues.forename,
      middleName: inputValues.middleName,
      surname: inputValues.surname,
      email: inputValues.email,
      telephone: inputValues.telephone,
      PPSNumber: inputValues.PPSNumber,
    };

    // Add the user data to Firestore
    addDoc(collection(db, 'patients'), userData) // Replace 'patients' with your Firestore collection name
      .then(() => {
        console.log('Patient data added to Firestore successfully.');
        navigate('/home');
        console.log(inputValues);
      })
      .catch((error) => {
        console.error('Error adding patient data to Firestore: ', error);
        setErrorMessage('An error occurred. Please try again.');
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

  const titleStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: 'normal',
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
          <Typography varient="h1" style={titleStyle}>
          Add Patient
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


          </div>
          <div style={columnStyle}>
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
              label="PPS number"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={inputValues.gpIdNumber}
              onChange={handleInputChange('PPSNumber')}
              error={inputError['PPSNumber']}
              helperText={
                inputError['PPSNumber'] ? 'PSS Number cannot be blank' : ''
              }
            />
            {/** Sign Up Button */}
          </div>
        </Stack>
        <div style={buttonContainerStyle}>
          <PrimaryButton
            text={'Add Patient'}
            action={createAccount}
            state={'active'}
          />{' '}
        </div>
      </Container>

    </>
  );
}

export default  AddPatient;