import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, List, ListItem } from '@mui/material';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';

function ViewProfile({ patID }) {
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      try {
        // Fetching data directly using patID
        const patientSnapshot = await get(ref(database, `patients/${patID}`));
        if (patientSnapshot.exists()) {
          setPatientData(patientSnapshot.val());
        } else {
          console.log('No patient data found for patID:', patID);
        }
      } catch (error) {
        console.error('Error accessing patient data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (patID) {
      fetchPatientData();
    } else {
      console.log('No patID provided');
      setIsLoading(false);
    }
  }, [patID]);

  
  const styles = {
  titleStyle: {
    fontFamily: 'Roboto, sans-serif',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: 'normal',
  },

   dropdownContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingTop: '2rem',
  },

  mainWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },

  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    
  }
  ,
  titleStyle: {
    fontFamily: 'Roboto, sans-serif',
    fontStyle: 'normal',
    fontWeight: 500, // Increased weight for emphasis
    fontSize: '1.5rem', // Larger font size for better visibility
    lineHeight: 'normal',
  },

};
return (
  <Box style={styles.mainWrapper}>
    <Box style={styles.titleWrapper}>
      <Typography variant="h6" style={styles.titleStyle}>
        {isLoading ? 'Loading...' : 'Patient Profile Details'}
      </Typography>
    </Box>
    {isLoading ? (
      <CircularProgress />
    ) : (
      patientData ? (
        <List>
          <ListItem>Name: {patientData.forename} {patientData.surname}</ListItem>
          {/* Render other patient details */}
        </List>
      ) : (
        <Typography>No patient data available.</Typography>
      )
    )}
  </Box>
);
}

export default ViewProfile;