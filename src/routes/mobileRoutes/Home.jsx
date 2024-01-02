import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Box,
  ListItem,
} from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import UserProfile from '../../components/widgets/UserProfile/UserProfile';
import { UserAuth } from '../../components/auth/AuthContext';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';
import ViewProfile from './ViewProfile';
import { database } from '../../firebase';
import { ref, set, get } from 'firebase/database';
import ReviewPage from './ReviewPage';
import TestHistoryWidget from '../../components/widgets/TestHistoryWidget/TestHistoryWidget';
import LandingPage from './LandingPage';

function MainPage() {
  const [value, setValue] = useState('home');
  const { user } = UserAuth();
  const [answers, setAnswers] = useState({});
  const [testHistory, setTestHistory] = useState([]); 

  const iconStyles = {
    fontSize: '35px',
  };
  const questions = [
    "Do you smoke regularly?",
    "Do you consume alcohol often?",
    "Do you struggle with any other chronic disease?",
    "Are you a diabetic?",
    "Do you feel constant fatigue or tiredness?",
    "Have you undergone any unexpected weight loss?",
    "Do you experience significant chest pain on a regular basis?",
    "Have you had any stomach cramps?",
    "What is your current Blood Pressure? (0 if not known)",
    "What is your current Heart Rate? (0 if not known)",
    "What is your Cholesterol level? (0 if not known)",
    "Are your fingertips a bright yellow?",
    "Have you experienced a high level of wheezing?",
    "Have you been coughing excessively?",
    "Have you been experiencing shortness of breath?",
    "Have you been experiencing bowel problems?",
    "Have you experienced any rectal bleeding?",
  ];

  useEffect(() => {
 
    if (user && user.uid) {
      const testHistoryRef = ref(database, `patients/${user.uid}/testHistory`);
  
      get(testHistoryRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const testHistoryData = snapshot.val();
            if (testHistoryData && typeof testHistoryData === 'object') {
             
              const testHistoryArray = Object.values(testHistoryData);

              setTestHistory(testHistoryArray);
            } else {
              console.error('Test history data is not in the expected format:', testHistoryData);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching test history:', error);
        });
    }
  }, [user]);
  

  const handleAnswerChange = (question, event) => {
    setAnswers({ ...answers, [question]: event.target.value });
  };


  const handleSubmit = async () => {
    if (!user || !user.uid) {
      console.error('User not authenticated');
      alert('User not authenticated'); 
      return;
    }
  
    console.log('Submitting test results for UID:', user.uid); 
  
    //const testHistoryRef = ref(database, `patients/${user.uid}/testHistory`);
  
    try {
      const answersToSave = {};
  
      questions.forEach((question, index) => {
        const answer = answers[question];
        var Q = 'Q';
        answersToSave[Q + (index + 1)] = answer;
        console.log(`Question ${index + 1}: ${question}, Answer: ${answer}`); 
      });
  
      console.log('Answers to be saved:', answersToSave); 
 
      setAnswers({}); 
      
      const today = new Date().toISOString().slice(0, 10);
      const medicalRecordsRef = ref(database, `patients/${user.uid}/medicalRecords/${today}`);
      await set(medicalRecordsRef, answersToSave);
      alert('Questionnaire submitted successfully!');
      console.log('Medical records submitted successfully');
    } catch (error) {
      console.error('Failed to submit test results:', error);
      alert('Failed to submit test results. Please try again.'); 
    }
  };
  
  

  const renderContent = () => {
    switch (value) {
      case 'home':
        return (
          <>
            <UserProfile username={user ? user.displayName : 'Guest'} />
            <Typography variant="h6" gutterBottom>
              Hello, {user ? user.displayName : 'Guest'}
            </Typography>
            <Typography variant="subtitle1">How are you feeling today?</Typography>
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: '16px' }}
                onClick={() => {
      
                  console.log('Contact Insurance button clicked');
                }}
              >
                Contact Insurance
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
      
                  console.log('Contact GP button clicked');
                }}
              >
                Contact GP
              </Button>
            </Box> <br></br>
            {Array.isArray(testHistory) ? (
              testHistory.map((testData, index) => (
                <Box key={index} mb={2}>
                <TestHistoryWidget key={index} date={testData.date} />
                </Box>
              ))
            ) : (
              <Typography variant="subtitle1">Test history data is not available.</Typography>
            )}
          </>
        );
  
  
      case 'test':
        return (
          <div>
            <Typography variant="h5" gutterBottom>Predict Your Health Results</Typography>
            <Typography variant="h6" color={'#268AFF'} gutterBottom>
              Answer these questions to get a prediction about your risk for colon cancer, lung cancer, and heart disease.
            </Typography>
            {questions.map((question, index) => (
              <FormControl key={index} component="fieldset">
                <Typography variant="subtitle1">{question}</Typography>
                <RadioGroup row onChange={(event) => handleAnswerChange(question, event)}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            ))}
            {/* Change back to PrimaryButton */}
            <Box display="flex" justifyContent="center" mb={3}>
              <PrimaryButton text={'Submit Test'} action={handleSubmit} state={'active'} />
            </Box>
          </div>
        );
  
      case 'chat':
        return <Typography variant="h4">Chat Content</Typography>;
  
      case 'profile':
        return (
          <>
            <UserProfile username={user ? user.displayName : 'Guest'} />
            <ViewProfile uid={user?.uid} />
          </>
        );
  
      case 'review':
        return (
          <>
            <ReviewPage />
          </>
        );
  
      default:
        return <Typography variant="h4">Page not found</Typography>;
    }
  };
  

  return (
    <>
      <div style={{ padding: '20px' }}>{renderContent()}</div>

      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        style={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          zIndex: 1000,
        
        }}
      >
         <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeIcon style={iconStyles} />} 
        />
        <BottomNavigationAction
          label="Test"
          value="test"
          icon={<CheckCircleIcon style={iconStyles} />} 
        />
        <BottomNavigationAction
          label="Chat"
          value="chat"
          icon={<ChatIcon style={iconStyles} />} 
        />
        <BottomNavigationAction
          label="Review"
          value="review"
          icon={<RateReviewIcon style={iconStyles} />} 
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<PersonIcon style={iconStyles} />} 
        />
      </BottomNavigation>
    </>
  );
}

export default MainPage;
