import React, { useEffect, useState } from 'react';
import { Typography, Card } from '@mui/material';
import { UserAuth } from '../components/auth/AuthContext';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import UserProfile from '../components/widgets/UserProfile/UserProfile';
import BackButton from '../components/widgets/BackButton/BackButton';
import TargetAreaWidget from '../components/widgets/TargetAreaWidget/TargetAreaWidget';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';

function ViewTest() {
  const doctorID = '1234567890';
  const apiUrl = `https://healthai-40b47-default-rtdb.europe-west1.firebasedatabase.app/patients.json?Authorization=Bearerhttps&orderBy="Doctor"&equalTo="${doctorID}"`;

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

  const topBarWrapper = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '2rem',
  };

  const outerWrapper = {
    width: '100%',
    height: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const titleWrapper = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1rem',
  };

  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '4rem',
    gap: '3rem',
    width: '50vw',
  };

  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: '15rem',
  };

  const widgetContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    marginLeft: '9rem',
  };

  const questionCardStyle = {
    width: '550px',
    height: '90%',
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    padding: '2rem',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const { user } = UserAuth();

  var questions = {
    'Question 1': 'Answer 1',
    'Question 2': 'Answer 2',
    'Question 3': 'Answer 3',
    'Question 4': 'Answer 4',
    'Question 5': 'Answer 5',
    'Question 6': 'Answer 6',
    'Question 7': 'Answer 7',
    'Question 8': 'Answer 8',
    'Question 9': 'Answer 9',
    'Question 10': 'Answer 10',
  };

  return (
    <>
      <div style={topBarWrapper}>
        <TopNavigationBar />
        {user ? <UserProfile /> : null}
      </div>
      <div style={outerWrapper}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div style={leftColumnStyle}>
            <div style={titleWrapper}>
              <BackButton goBackPath={`/viewPatientDetails/${patID}`} />
              <Typography variant="h3">View Test From:</Typography>
              <Typography variant="h3" color={'#2187FF'}>
                {testDate}
              </Typography>
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
        )}
        <div style={rightColumnStyle}>
          <Card style={questionCardStyle}>
            {Object.entries(questions).map(([question, answer]) => (
              <div key={question}>
                <Typography variant="h5">{question}</Typography>
                <Typography variant="subtitle1">{answer}</Typography>
                <hr style={{ margin: '1rem 0', border: '0.5px solid #000' }} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

export default ViewTest;
