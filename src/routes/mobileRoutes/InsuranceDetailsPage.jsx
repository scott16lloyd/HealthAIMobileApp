import React, { useState } from 'react';
import TitleText from '../../components/widgets/TitleText/TitleText';
import BackButton from '../../components/widgets/BackButton/BackButton';
import AlertBox from '../../components/widgets/AlertBox/AlertBox';
import {
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  TextField,
} from '@mui/material';
import { ref, getDatabase, update } from 'firebase/database';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';
import { UserAuth } from '../../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function InsuranceDetailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  // Handle error messages
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedInsurance, setselectedInsurance] = useState('');
  const [policyNo, setPolicyNo] = useState('');
  const { user } = UserAuth();
  const database = getDatabase();
  const navigate = useNavigate();
  console.log(user.uid);

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const mainWrapper = {
    paddingTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '3rem',
    height: '68vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const inputStyle = {
    margin: '20px 40px',
    width: '75%',
    borderRadius: '11px',
    background:
      'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(1.5px)',
  };

  // Set selected value to selected insurance company
  const handleChange = (event) => {
    setselectedInsurance(event.target.value);
  };

  // Function to validate the policy number
  const isValidPolicyNumber = (policyNo) => {
    if (selectedInsurance !== 'None') {
      // Use a regular expression to check if the policy number is alphanumeric and 8 to 10 characters long
      const policyNoRegex = /^[a-zA-Z0-9]{8,10}$/;
      return policyNoRegex.test(policyNo);
    }
  };

  //   Add insurance company to user's details
  const addInsuranceToUser = (company, policyNo, uid) => {
    if (!company) {
      setErrorMessage('Please select insurance.');
      console.error('Invalid insurance details.');
      return;
    } else if (!uid) {
      setErrorMessage('Login issue please log back in.');
      console.error('Invalid user id');
    } else if (!isValidPolicyNumber(policyNo) && selectedInsurance !== 'None') {
      setErrorMessage(
        'Please enter a valid policy number (8 to 10 characters).'
      );
      console.error('Invalid policy number.');
      return;
    }

    update(ref(database, 'patients/' + user.uid), {
      insuranceProvider: company,
      insurancePolicyNo: policyNo,
    })
      .then(() => {
        console.log('Doctor added to user successfully.');
        navigate('/mobilePlanSelection');
      })
      .catch((error) => {
        console.error('Error adding doctor to user:', error);
      });
  };

  // Array of Irish insurance company
  const insuranceCompanies = [
    'Alianz',
    'Irish Life Health',
    'VHI',
    'Laya Healthcare',
    '123',
    'None',
  ];

  return (
    <div style={wrapperStyle}>
      <TitleText />
      <BackButton goBackPath={'/'} />
      <AlertBox
        message={errorMessage}
        severity={'error'}
        onClose={() => setErrorMessage('')}
      />
      <div style={mainWrapper}>
        <Typography variant="h4">Insurance Details</Typography>
        <Paper elevation={1} sx={{ padding: '0.5rem', borderRadius: 3 }}>
          <Typography variant="h5">Select Insurance Company</Typography>
        </Paper>
        <FormControl sx={{ width: '300px' }}>
          <InputLabel id="select-doctor-label">Select insurance</InputLabel>
          <Select
            labelId="select-insurance-label"
            label="Select insurance"
            value={selectedInsurance}
            onChange={handleChange}
            sx={{ height: '60px' }}
          >
            {isLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
                Loading...
              </MenuItem>
            ) : (
              insuranceCompanies &&
              insuranceCompanies.map((company, index) => (
                <MenuItem key={index} value={company}>
                  {company}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        {selectedInsurance !== 'None' && (
          <>
            <Paper elevation={1} sx={{ padding: '0.5rem', borderRadius: 3 }}>
              <Typography variant="h5">Policy Number</Typography>
            </Paper>
            <TextField
              label="Policy Number"
              variant="filled"
              style={inputStyle}
              required
              InputProps={{ disableUnderline: true }}
              value={policyNo}
              onChange={(e) => setPolicyNo(e.target.value)}
            />
          </>
        )}
        <PrimaryButton
          text={'Submit'}
          state="active"
          action={() =>
            addInsuranceToUser(selectedInsurance, policyNo, user.uid)
          }
        />
      </div>
    </div>
  );
}

export default InsuranceDetailsPage;
