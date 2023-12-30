import React, { useEffect, useState } from 'react';
import MobileUserHeader from '../../components/widgets/MobileUserHeader/MobileUserHeader';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { database } from '../../firebase';
import { ref, get } from 'firebase/database';
import TargetAreaWidget from '../../components/widgets/TargetAreaWidget/TargetAreaWidget';

function ViewTest() {
  const [patientsData, setPatientsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { patID, testDate } = useParams();
  const patIDNumber = parseInt(patID, 10);
  const patientRef = ref(database, 'patients');

  // Read the data at the reference
  const [patient, setPatient] = useState(null);
  const [testResult, setTestResult] = useState({
    colonResult: 'N/A',
    heartResult: 'N/A',
    lungResult: 'N/A',
  });
  console.log(testResult);
  console.log(testResult.colonResult);
  console.log(patient);

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

          // Access resultHistory from the patient object
          const testResult = patient.resultHistory[testDate];

          if (testResult) {
            setTestResult(testResult);
          } else {
            console.log(`No test result found for ${testDate}`);
          }
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

  const mainWrapper = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  };

  const subheadingStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: '1rem',
  };

  const titleWrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: '1rem',
  };

  const widgetContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginLeft: '1rem',
    paddingTop: '1rem',
  };

  return (
    <>
      <MobileUserHeader />
      <div style={mainWrapper}>
        <div style={titleWrapper}>
          <Typography variant="h3">Your Results</Typography>
          <div style={subheadingStyle}>
            <Typography variant="h5">Viewing test From</Typography>
            <Typography variant="h5" color={'#2187FF'}>
              {testDate ? testDate : 'N/A'}
            </Typography>
          </div>
        </div>
        <div style={widgetContainer}>
          {testResult && (
            <>
              <TargetAreaWidget
                cancerType={'Colon Cancer'}
                result={testResult.colonResult}
              />
              <TargetAreaWidget
                cancerType={'Heart Cancer'}
                result={testResult.heartResult}
              />
              <TargetAreaWidget
                cancerType={'Lung Cancer'}
                result={testResult.lungResult}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewTest;
