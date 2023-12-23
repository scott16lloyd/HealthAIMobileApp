import React, { useState } from 'react';
import {
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Box,
} from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RateReviewIcon from '@mui/icons-material/RateReview'; 
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import UserProfile from '../components/widgets/UserProfile/UserProfile';
import { UserAuth } from '../components/auth/AuthContext';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import ViewProfile from './ViewProfile'; // Ensure only one import statement for ViewProfile
import { database } from '../firebase';
import { ref, set } from 'firebase/database';
import ReviewPage from './mobileRoutes/ReviewPage';


function MainPage() {
  const [value, setValue] = useState('home');
  const { user } = UserAuth();
  const [answers, setAnswers] = useState({}); // Store the test answers

  const iconStyles = {
    fontSize: '35px', // Adjust the size as needed
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
    "Are your fingertips a bright yellow?",
    "Have you experienced a high level of wheezing?",
    "Have you been coughing excessively?",
    "Have you been experiencing shortness of breath?",
    "Have you been experiencing bowel problems?",
    "Have you experienced any rectal bleeding?",
  ];

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
  
    const testHistoryRef = ref(database, `patients/${user.uid}/testHistory`);
  
    try {
      const answersToSave = {};
  
      questions.forEach((question, index) => {
        const answer = answers[question];
        answersToSave[question] = answer;
        console.log(`Question ${index + 1}: ${question}, Answer: ${answer}`); 
      });
  
      console.log('Answers to be saved:', answersToSave); 

      await set(testHistoryRef, answersToSave);
      console.log('Test results submitted successfully');
      alert('Test results submitted successfully!'); 
      setAnswers({}); 
  
      const today = new Date().toISOString().slice(0, 10);
      const medicalRecordsRef = ref(database, `patients/${user.uid}/medicalRecords/${today}`);
      await set(medicalRecordsRef, answersToSave);
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
            <Typography variant="subtitle1">
              How are you feeling today?
            </Typography>
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
            <Box display="flex" justifyContent="center" mb={3}>
              <PrimaryButton text={'Submit Test'} onClick={handleSubmit} state={'active'} />
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
            {/* Content for the Review page */}
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
          icon={<HomeIcon style={iconStyles} />} // Apply custom CSS style
        />
        <BottomNavigationAction
          label="Test"
          value="test"
          icon={<CheckCircleIcon style={iconStyles} />} // Apply custom CSS style
        />
        <BottomNavigationAction
          label="Chat"
          value="chat"
          icon={<ChatIcon style={iconStyles} />} // Apply custom CSS style
        />
        <BottomNavigationAction
          label="Review"
          value="review"
          icon={<RateReviewIcon style={iconStyles} />} // Apply custom CSS style
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<PersonIcon style={iconStyles} />} // Apply custom CSS style
        />
      </BottomNavigation>
    </>
  );
}

export default MainPage;
