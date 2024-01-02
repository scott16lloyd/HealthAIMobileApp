import React, { useEffect, useState } from 'react';
import TestHistoryWidget from '../components/widgets/TestHistoryWidget/TestHistoryWidget';
import { Typography } from '@mui/material';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { Link, useParams } from 'react-router-dom';

function ViewTestResults() {
  const [isLoading, setIsLoading] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);
  const { patID } = useParams();
  const patientRef = ref(database, `patients/${patID - 1}`);

  useEffect(() => {
    const fetchDataAndFilterPatients = async () => {
      try {
        const userSnapshot = await get(patientRef);
        if (userSnapshot.exists()) {
          const patientData = userSnapshot.val();
          if (patientData['resultHistory']) {
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
        setIsLoading(false);
      }
    };

    fetchDataAndFilterPatients();
  }, []);

  const testWidgetContainer = {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '1rem',
    overflowY: 'auto',
  };

  return (
    <div style={testWidgetContainer}>
      {isLoading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
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
