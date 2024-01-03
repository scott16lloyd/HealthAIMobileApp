//Home page for app
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Slider as MuiSlider,
  Input,
} from '@mui/material';
import axios from 'axios';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AlertBox from '../../components/widgets/AlertBox/AlertBox';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import DocBotPage from './DocBotPage';

function MainPage() {
  const [value, setValue] = useState('home');
  const { user } = UserAuth();
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [testHistory, setTestHistory] = useState([]);
  const [severity, setSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.uid) {
      const testHistoryRef = ref(database, `patients/${user.uid}/testHistory`);
      get(testHistoryRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setTestHistory(Object.entries(data)); // Changed to entries to get the date keys
          }
        })
        .catch((error) => {
          console.error('Error fetching test history:', error);
        });
    }
  }, [user]);

  const handleJournalClick = () => {
    navigate('/diary');
  };

  const handleTestHistoryClick = (testDate) => {
    navigate(`/viewTest/${testDate}`);
  };

  const PrimaryButton = ({ text, action, state }) => {
    return (
      <button
        variant="contained"
        color="primary"
        onClick={action}
        disabled={state !== 'active'}
      >
        {text}
      </button>
    );
  };

  const iconStyles = {
    fontSize: '35px',
  };
  const questions = [
    'Do you smoke regularly?',
    'Do you consume alcohol often?',
    'Do you struggle with any other chronic disease?',
    'Are you a diabetic?',
    'Do you feel constant fatigue or tiredness?',
    'Have you undergone any unexpected weight loss?',
    'Do you experience significant chest pain on a regular basis?',
    'Have you had any stomach cramps?',
    'What is your current Blood Pressure? (0-200)',
    'What is your current Heart Rate? (0-200)',
    'What is your Cholesterol level? (0-300)',
    'Are your fingertips a bright yellow?',
    'Have you experienced a high level of wheezing?',
    'Have you been coughing excessively?',
    'Have you been experiencing shortness of breath?',
    'Have you been experiencing bowel problems?',
    'Have you experienced any rectal bleeding?',
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

  const handleAnswerChange = (question, newValue) => {
    const value = newValue.target ? newValue.target.value : newValue;
    setAnswers({ ...answers, [question]: value });
  };

  const handleSliderChange = (question, newValue) => {
    setAnswers({ ...answers, [question]: newValue });
  };

  const handleInputChange = (question, event) => {
    setAnswers({ ...answers, [question]: event.target.value === '' ? 0 : Number(event.target.value) });
  };

  const handleBlur = (question) => {
    const newValue = answers[question];
    if (newValue < 0) {
      setAnswers({ ...answers, [question]: 0 });
    } else if (newValue > 100) {
      setAnswers({ ...answers, [question]: 100 });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !user.uid) {
      console.error('User not authenticated');
      setErrorMessage('User not authenticated');
      setSeverity('error');
      return;
    }
  
    const unansweredQuestions = questions.filter(
      (question) => !answers.hasOwnProperty(question)
    );
  
    if (unansweredQuestions.length > 0) {
      setErrorMessage('Please answer all questions before submitting.');
      setSeverity('error');
      return;
    }
  
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;


    
    const answersToSave = {};
  
    questions.forEach((question, index) => {
      const answerKey = `Q${index + 1}`;
      const answerValue = answers[question];
      answersToSave[answerKey] = isNaN(answerValue) ? answerValue : parseInt(answerValue, 10);
    });
  
    try {
      const medicalRecordsRef = ref(database, `patients/${user.uid}/medicalRecords/${formattedDate}`);
      await set(medicalRecordsRef, answersToSave);
  
      axios.post('https://predict-app-tmzbdquo3q-lz.a.run.app/predict', { user_uuid: user.uid })
        .then(response => {
          setErrorMessage('Questionnaire submitted successfully and prediction initiated!');
          setSeverity('success');
          setAnswers({}); // Reset answers here
        })
        .catch(error => {
          console.error('Prediction API call failed:', error);
          setErrorMessage('Prediction API call failed. Please try again.');
          setSeverity('error');
        });

    } catch (error) {
      console.error('Failed to submit test results:', error);
      setErrorMessage('Failed to submit test results. Please try again.');
      setSeverity('error');
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
            <Box display="flex" justifyContent="center" mt={3}>
              <PrimaryButton
                text="Health Journal"
                action={handleJournalClick}
                state="active"
              />
            </Box>
            <br />

            {testHistory.map(([testDate, testData], index) => (
              <Box
                key={index}
                mb={2}
                onClick={() => handleTestHistoryClick(testDate)}
              >
                <TestHistoryWidget date={testDate} />
              </Box>
            ))}
          </>
        );

      case 'test':
        return (
          <div>
            <Typography variant="h5" gutterBottom>
              Predict Your Health Results
            </Typography>
            <Typography variant="h6" color={'#268AFF'} gutterBottom>
              Answer these questions to get a prediction about your risk for
              colon cancer, lung cancer, and heart disease.
            </Typography>
            {questions.map((question, index) => {
              const isSliderQuestion = [
                'What is your current Blood Pressure? (0-200)',
                'What is your current Heart Rate? (0-200)',
                'What is your Cholesterol level? (0-300)',
              ].includes(question);
              const value = answers[question] || 0;

              return (
                <FormControl key={index} component="fieldset">
                  <Typography variant="subtitle1">{question}</Typography>
                  {isSliderQuestion ? (
                    <Box sx={{ width: 250 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                          <MuiSlider
                            value={typeof value === 'number' ? value : 0}
                            onChange={(event, newValue) =>
                              handleSliderChange(question, newValue)
                            }
                            aria-labelledby={`input-slider-${index}`}
                            step={1}
                            min={0}
                            max={question.includes('Cholesterol') ? 300 : 200}
                          />
                        </Grid>
                        <Grid item>
                          <Input
                            value={value}
                            size="small"
                            onChange={(event) =>
                              handleInputChange(question, event)
                            }
                            onBlur={() => handleBlur(question)}
                            inputProps={{
                              step: 1,
                              min: 0,
                              max: question.includes('Cholesterol') ? 300 : 200,
                              type: 'number',
                              'aria-labelledby': `input-slider-${index}`,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <RadioGroup
                      row
                      onChange={(event) => handleAnswerChange(question, event)}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio checked={answers[question] === '1'} />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio checked={answers[question] === '0'} />}
                        label="No"
                      />
                    </RadioGroup>
                  )}
                </FormControl>
              );
            })}
            <AlertBox
              message={errorMessage}
              severity={severity}
              onClose={() => setErrorMessage('')}
            />
            <Box display="flex" justifyContent="center" mb={3}>
              <PrimaryButton
                text={'Submit Test'}
                action={handleSubmit}
                state={'active'}
              />
            </Box>
          </div>
        );

      case 'chat':
        return <DocBotPage />;

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
      <div style={{ padding: '20px', overflow: 'hidden' }}>
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
