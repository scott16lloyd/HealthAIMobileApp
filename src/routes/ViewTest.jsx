import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { database } from '../firebase';
import styled from 'styled-components';
import BackButton from '../components/widgets/BackButton/BackButton';

import { ref, get } from 'firebase/database';
import { UserAuth } from '../components/auth/AuthContext';

import lungImage from '../images/lungImage.png';
import heartImage from '../images/heartImage.png';
import colonImage from '../images/colonImage.png';

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Align content to the top */
  padding: 16px;
  margin: 16px;
  background-color: #f5f5f5;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the cards horizontally */
  width: 100%;
`;

const BackButtonContainer = styled.div`
  align-self: flex-start; /* Align the Back button to the left */
  margin-bottom: 16px; /* Add margin to separate the Back button from content */
`;

const StyledResultCard = styled(Card)`
  margin-top: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 16px;
`;

const CircularBorder = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid ${(props) => {
    const percentage = parseFloat(props.percentage);
    if (percentage < 33) return 'green'; // Green for < 33%
    if (percentage < 66) return 'orange'; // Orange for 33-66%
    return 'red'; // Red for > 66%
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const CardImage = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 16px;
`;

const CardTitle = styled(Typography)`
  font-size: 16px;
  text-align: center;
`;

const CardSubtitle = styled(Typography)`
  font-size: 12px;
  text-align: center;
`;

const CircularNumber = styled.div`
  font-size: 20px;
`;

const PatientInfo = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const ExplanationSection = styled.div`
  margin-top: 24px;
  text-align: left; /* Align the text to the left */
  max-width: 600px; /* Limit the width of the explanation section */
`;

function ViewTest() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { testDate } = useParams();
  const { user } = UserAuth();

  useEffect(() => {
    if (user && user.uid && testDate) {
      const testRef = ref(database, `patients/${user.uid}/testHistory/${testDate}`);
  
      get(testRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('Data from the database:', data); // Log the data
            setTestResults(data);
          } else {
            console.log('No test results available for this date.');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching test results:', error);
          setLoading(false);
        });
    }
  }, [user, testDate]);
  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  if (!testResults) {
    return (
      <StyledBox>
        <BackButtonContainer>
          <BackButton style={{ alignSelf: 'flex-start' }} />
        </BackButtonContainer>
        <Typography>No test results found for the selected date.</Typography>
      </StyledBox>
    );
  }

  return (
    <StyledBox>
      <BackButtonContainer>
        <BackButton style={{ alignSelf: 'flex-start' }} />
      </BackButtonContainer>
      <ContentContainer>
        <Typography variant="h6" align="center" gutterBottom>
          Test Results for {testDate}
        </Typography>


        <StyledResultCard>
  <CardImage src={lungImage} alt="Lung Cancer" />
  <CircularBorder percentage={parseFloat(testResults.lungResult)}>
    <CircularNumber>{testResults.lungResult || 'N/A'}</CircularNumber>
  </CircularBorder>
  <CardSubtitle variant="subtitle1">Lung Cancer</CardSubtitle>
</StyledResultCard>


        <StyledResultCard>
          <CardImage src={heartImage} alt="Heart Disease" />
          <CircularBorder percentage={parseFloat(testResults.heartResult)}>
            <CircularNumber>{testResults.heartResult || 'N/A'}</CircularNumber>
          </CircularBorder>
          <CardSubtitle variant="subtitle1">Heart Disease</CardSubtitle>
        </StyledResultCard>

        <StyledResultCard>
          <CardImage src={colonImage} alt="Colon Cancer" />
          <CircularBorder percentage={parseFloat(testResults.colonResult)}>
            <CircularNumber>{testResults.colonResult || 'N/A'}</CircularNumber>
          </CircularBorder>
          <CardSubtitle variant="subtitle1">Colon Cancer</CardSubtitle>
        </StyledResultCard>

        <ExplanationSection>
          <Typography variant="h6" gutterBottom>
            Test Result Explanations
          </Typography>
          <Typography>
            In the test results, color-coded circular borders are used to indicate the risk level associated with each result:
          </Typography>
          <ul>
            <li>
              <span style={{ color: 'red', fontWeight: 'bold' }}>Red:</span> High Risk
              <span role="img" aria-label="High Risk">🔴</span>
            </li>
            <li>
              <span style={{ color: 'orange', fontWeight: 'bold' }}>Orange:</span> Moderate Risk
              <span role="img" aria-label="Moderate Risk">🟠</span>
            </li>
            <li>
              <span style={{ color: 'green', fontWeight: 'bold' }}>Green:</span> Low Risk
              <span role="img" aria-label="Low Risk">🟢</span>
            </li>
          </ul>
          <Typography>
            These colors help you quickly assess the risk level associated with each test result. Red indicates a high risk, orange suggests a moderate risk, and green signifies a low risk.
          </Typography>
        </ExplanationSection>
      </ContentContainer>
    </StyledBox>
  );
}

export default ViewTest;
