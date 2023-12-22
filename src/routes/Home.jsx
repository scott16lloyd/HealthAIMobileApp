import React, { useState } from 'react';
import { Typography, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import UserProfile from '../components/widgets/UserProfile/UserProfile';
import { UserAuth } from '../components/auth/AuthContext';

function MainPage() {
  const [value, setValue] = useState('home');
  const { user } = UserAuth();

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

  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (question, event) => {
    setAnswers({ ...answers, [question]: event.target.value });
  };

  const renderContent = () => {
    switch (value) {
      case 'home':
        return (
          <>
            <UserProfile username={user ? user.displayName : 'Guest'} />
            <Typography variant="h6" gutterBottom>Hello, {user ? user.displayName : 'Guest'}</Typography>
            <Typography variant="subtitle1">How are you feeling today?</Typography>
          </>
        );
      case 'test':
        return (
          <div>
            <Typography variant="h4" gutterBottom>Health Questions</Typography>
            {questions.map((question, index) => (
              <FormControl key={index} component="fieldset">
                <Typography variant="h6">{question}</Typography>
                <RadioGroup row onChange={(event) => handleAnswerChange(question, event)}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            ))}
          </div>
        );
      case 'chat':
        return <Typography variant="h4">Chat Content</Typography>;
      case 'profile':
        return <Typography variant="h4">Profile Content</Typography>;
      default:
        return <Typography variant="h4">Page not found</Typography>;
    }
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        {renderContent()}
      </div>

      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        style={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          zIndex: 1000
        }}
      >
        <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Test" value="test" icon={<CheckCircleIcon />} />
        <BottomNavigationAction label="Chat" value="chat" icon={<ChatIcon />} />
        <BottomNavigationAction label="Profile" value="profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </>
  );
}

export default MainPage;
