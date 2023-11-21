import React, { useState, useEffect } from 'react';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import UserProfile from '../components/widgets/UserProfile/UserProfile';
import { UserAuth } from '../components/auth/AuthContext';
import PatientOverviewWidget from '../components/widgets/PatientOverviewWidget/PatientOverviewWidget';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import BackButton from '../components/widgets/BackButton/BackButton';
import ViewTestResults from './ViewTestResults';
import ViewFullDetails from './ViewFullDetails';

function ViewPatientScreen() {
  const [isLoading, setIsLoading] = useState(true);
  // Manage state of button, including default state
  const [buttonStates, setButtonStates] = useState({
    viewFullDetails: 'active',
    viewTestResults: 'unactive',
  });

  const handleButtonClick = (buttonKey) => {
    // Update the state based on the clicked button
    if (buttonKey === 'viewFullDetails') {
      setButtonStates({
        viewFullDetails: 'active',
        viewTestResults: 'unactive',
      });
    } else if (buttonKey === 'viewTestResults') {
      setButtonStates({
        viewFullDetails: 'unactive',
        viewTestResults: 'active',
      });
    }
  };

  const { user } = UserAuth();

  // Get patient info
  const { patID } = useParams();
  const patIDNumber = parseInt(patID, 10);
  const patientRef = ref(database, 'patients');

  // Read the data at the reference
  const [patient, setPatient] = useState(null);
  useEffect(() => {
    const fetchPatientData = async () => {
      // Fetch user data
      try {
        const userSnapshot = await get(patientRef);
        if (userSnapshot.exists()) {
          const patientData = userSnapshot.val();

          // Convert object values to an array
          const patientArray = Object.values(patientData);

          // Find the patient with the matching patID
          const patient = patientArray.find(
            (patient) => patient.patID === patIDNumber
          );
          setPatient(patient);
        } else {
          console.log('No patient data found.');
        }
      } catch (error) {
        console.error('Error accessing patient data:', error);
      } finally {
        // Set isLoading to false after fetching data
        setIsLoading(false);
      }
    };
    // Add a closing brace for the fetchPatientData function
    fetchPatientData();
  }, []);

  const titleStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: 'normal',
  };
  const topBarWrapper = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '2rem',
  };
  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    gap: '1rem',
    margin: '2rem',
    paddingTop: '3rem',
    marginLeft: '5%',
  };

  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    marginLeft: '10%',
  };

  const outerDivStyle = {
    display: 'flex',
    flexDirection: 'row',
  };

  const textButtonWrapper = {
    display: 'flex',
    flexDirection: 'row',
    padding: '1rem',
  };
  return (
    <>
      <div style={topBarWrapper}>
        <TopNavigationBar />
        {user ? <UserProfile /> : null}
      </div>
      <div style={outerDivStyle}>
        <div style={leftColumnStyle}>
          {patient ? (
            <PatientOverviewWidget
              name={`${patient.first_name} ${patient.last_name}`}
              id={patient.patID}
            />
          ) : (
            <div>Loading patient data...</div>
          )}
          <PrimaryButton
            text={'View Full Details'}
            state={buttonStates.viewFullDetails}
            action={() => handleButtonClick('viewFullDetails')}
          />
          <PrimaryButton
            text={'View Test Results'}
            state={buttonStates.viewTestResults}
            action={() => handleButtonClick('viewTestResults')}
          />
        </div>
        <div style={rightColumnStyle}>
          <div style={textButtonWrapper}>
            <BackButton goBackPath={'/home'} />
            {buttonStates.viewFullDetails === 'active' && (
              <Typography variant="h1" style={titleStyle}>
                Viewing Patient Details
              </Typography>
            )}
            {buttonStates.viewTestResults === 'active' && (
              <Typography variant="h1" style={titleStyle}>
                Viewing Test History
              </Typography>
            )}
          </div>
          {buttonStates.viewFullDetails === 'active' && <ViewFullDetails />}
          {buttonStates.viewTestResults === 'active' && <ViewTestResults />}
        </div>
      </div>
    </>
  );
}

export default ViewPatientScreen;
