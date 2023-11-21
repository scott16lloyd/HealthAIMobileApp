import React, { useEffect, useState } from 'react';
import TestHistoryWidget from '../components/widgets/TestHistoryWidget/TestHistoryWidget';
import { Typography } from '@mui/material';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { Link, useParams } from 'react-router-dom';

function ViewTestResults() {
  const [isLoading, setIsLoading] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);

  // Get the current user's UID
  const { patID } = useParams();

  // Create a reference to the user's data in the database
  // -1 used to get index of patient from patID
  const patientRef = ref(database, `patients/${patID - 1}`);

  // Read the data at the reference
  useEffect(() => {
    const fetchDataAndFilterPatients = async () => {
      // Fetch user data
      try {
        const userSnapshot = await get(patientRef);
        if (userSnapshot.exists()) {
          const patientData = userSnapshot.val();
          if (patientData['resultHistory']) {
            // Access the resultHistory object and store it in an array
            const resultHistoryArray = Object.entries(
              patientData['resultHistory']
            ).map(([date, results]) => ({
              date,
              colonResult: results.colonResult,
              heartResult: results.heartResult,
              lungResult: results.lungResult,
            }));
            setResultHistory(resultHistoryArray);
          }
        } else {
          console.log('No patient data found.');
        }
      } catch (error) {
        console.error('Error accessing user or patient data:', error);
      } finally {
        // Set isLoading to false after fetching data
        setIsLoading(false);
      }
    };

    fetchDataAndFilterPatients();
  }, []);

  const testWidgetContainer = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '56vh',
    padding: '2rem',
    paddingLeft: '1rem',
    gap: '2rem',
    overflowY: 'auto',
    overflowX: 'hidden',
  };
  return (
    <div style={testWidgetContainer}>
      {isLoading ? (
        <Typography variant="h1">Loading...</Typography>
      ) : (
        // ADD LOADER
        resultHistory.map((testResult, index) => (
          <Link
            to={`/viewPatientDetails/${patID}/test/${testResult.date}`}
            key={index}
            style={{ textDecoration: 'none' }}
          >
            <TestHistoryWidget date={testResult.date} key={index} />
          </Link>
        ))
      )}
    </div>
  );
}

export default ViewTestResults;
