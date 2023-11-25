import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ref, get, getDatabase, update } from 'firebase/database';
import Dropdown from '../../components/widgets/Dropdown/Dropdown';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';
import { UserAuth } from '../../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function GPDetailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = UserAuth();
  const database = getDatabase();
  const navigate = useNavigate();

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  };

  const mainWrapper = {
    paddingTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '3rem',
    height: '80vh',
  };

  // Set selected value to GP ID number
  const handleChange = (event) => {
    setGpIdNumber(event.target.value);
  };

  const doctorRef = ref(database, 'doctors');

  // Handle error messages
  const [errorMessage, setErrorMessage] = useState('');

  // Read the data at the reference
  const [doctorData, setDoctorData] = useState(null);

  // Set selected doctor ID
  const [gpIdNumber, setGpIdNumber] = useState('');

  // Gather doctor details
  const generateDoctorDetails = () => {
    if (doctorData && gpIdNumber !== '') {
      const selectedDoctor = doctorData.find(
        (doctor) => doctor.gpIdNumber === gpIdNumber
      );
      if (selectedDoctor) {
        return {
          Name: `${selectedDoctor.forename} ${selectedDoctor.surname}`,
          'Office Address': `${selectedDoctor.officeAddress}`,
          Telephone: `${selectedDoctor.telephone}`,
          'GPID Number': `${selectedDoctor.gpIdNumber}`,
        };
      } else {
        return {
          Error: `Selected doctor not found`,
        };
      }
    } else {
      return {
        Error: `No Data found`,
      };
    }
  };

  // Get doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      // Fetch user data
      try {
        const userSnapshot = await get(doctorRef);
        if (userSnapshot.exists()) {
          const doctorData = userSnapshot.val();
          // Convert object values to an array
          const doctorArray = Object.values(doctorData);
          setDoctorData(doctorArray);
        } else {
          console.log('No doctor data found.');
        }
      } catch (error) {
        console.error('Error accessing doctor data:', error);
      } finally {
        // Set isLoading to false after fetching data
        setIsLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const doctorDetails = generateDoctorDetails();

  const addDoctorToUser = (uid, gpIdNumber) => {
    if (!uid || !gpIdNumber) {
      setErrorMessage('Please select a medical practitioner');
      console.error('Invalid uid or gpIdNumber');
      return;
    }

    update(ref(database, 'patients/' + user.uid), {
      doctor: gpIdNumber,
    })
      .then(() => {
        console.log('Doctor added to user successfully.');
        navigate('/mobileInsuranceDetails');
      })
      .catch((error) => {
        console.error('Error adding doctor to user:', error);
      });
  };

  return (
    <>
      <div style={wrapperStyle}>
        <TitleText />
        <BackButton />
        <AlertBox
          message={errorMessage}
          severity={'error'}
          onClose={() => setErrorMessage('')}
        />
        <div style={mainWrapper}>
          <Typography variant="h4">GP Details</Typography>
          <Paper elevation={1} sx={{ padding: '0.5rem', borderRadius: 3 }}>
            <Typography variant="h5">Select Medical Practitioner</Typography>
          </Paper>
          <FormControl sx={{ width: '300px' }}>
            <InputLabel id="select-doctor-label">Select doctor</InputLabel>
            <Select
              labelId="select-doctor-label"
              label="Select doctor"
              value={gpIdNumber}
              onChange={handleChange}
              sx={{ height: '60px' }}
            >
              {isLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  Loading...
                </MenuItem>
              ) : (
                doctorData &&
                doctorData.map((doctor, index) => (
                  <MenuItem key={index} value={doctor.gpIdNumber}>
                    {doctor.forename} {doctor.surname}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          {gpIdNumber && (
            <Dropdown title={'View Doctor Details'} data={doctorDetails} />
          )}
          <PrimaryButton
            text={'Submit'}
            state="active"
            action={() => addDoctorToUser(user.uid, gpIdNumber)}
          />
        </div>
      </div>
    </>
  );
}

export default GPDetailsPage;
