import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, List, ListItem, Paper, Divider } from '@mui/material';
import { getDatabase, ref, get } from 'firebase/database';
import { UserAuth } from '../../components/auth/AuthContext';

function ViewProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setPatientData] = useState({});
  const [doctorDetails, setDoctorDetails] = useState({});
  const [error, setError] = useState('');
  const { user } = UserAuth();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user || !user.uid) {
        setError('User not logged in or UID not available');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const database = getDatabase();

      try {
        // Fetch patient data
        const patientSnapshot = await get(ref(database, `patients/${user.uid}`));
        if (!patientSnapshot.exists()) {
          setError('No patient data found.');
          setIsLoading(false);
          return;
        }
        setPatientData(patientSnapshot.val());

        // Fetch all doctors to find the one with matching GP ID
        const gpIdNumber = patientSnapshot.val().doctor;
        const doctorsSnapshot = await get(ref(database, 'doctors'));
        if (doctorsSnapshot.exists()) {
          const doctors = doctorsSnapshot.val();
          const doctorKey = Object.keys(doctors).find(key => doctors[key].gpIdNumber === gpIdNumber);
          if (doctorKey) {
            setDoctorDetails(doctors[doctorKey]);
          }
        }
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  const renderPatientDataHeader = () => {
    const fullName = `${patientData.forename || ''} ${patientData.surname || ''}`.trim();
    return fullName && (
      <Typography variant="h7" style={styles.header}>
        Viewing Full Details for, <br></br> {fullName}
      </Typography>
    );
  };


  const renderPatientData = () => {
    const fieldsToExclude = ['verified', 'subscribed', 'testHistory', 'medicalRecords'];
    return (
      <Paper style={styles.paperStyle} elevation={3}>
        <Typography variant="h6" style={styles.headerStyle}>Patient Information</Typography>
        <List>
          {Object.entries(patientData)
            .filter(([key]) => !fieldsToExclude.includes(key))
            .map(([key, value]) => (
              <ListItem key={key}>{`${key}: ${value || 'N/A'}`}</ListItem>
            ))}
        </List>
      </Paper>
    );
  };

  const renderDoctorData = () => {
    return doctorDetails && (
      <Paper style={styles.paperStyle} elevation={3}>
        <Typography variant="h6" style={styles.headerStyle}>Doctor Information</Typography>
        <List>
          <ListItem>Doctor: {doctorDetails.forename} {doctorDetails.surname}</ListItem>
          <ListItem>Office Address: {doctorDetails.officeAddress || 'N/A'}</ListItem>
          <ListItem>Telephone: {doctorDetails.telephone || 'N/A'}</ListItem>
          {/* Add more doctor details here if needed */}
        </List>
      </Paper>
    );
  };
  

  const styles = {
    mainWrapper: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, sans-serif',
      gap: '20px', // Add space between sections
      padding: '20px',
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '20px', // Space above the title
    },
    titleStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 'normal',
    },
    paperStyle: {
      padding: '20px',
      backgroundColor: '#f5f5f5', // Light gray background for paper
    },
    headerStyle: {
      fontWeight: 600,
      color: '#1976d2', // 
      marginBottom: '10px',
    },
    header: {
      fontWeight: 500,
      color: '#000', 
      marginBottom: '10px',
      fontSize: '20px',
      fontFamily: 'Roboto, sans-serif',
      textAlign: 'left'
    },
  };

  return (
    <Box style={styles.mainWrapper}>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error" style={styles.titleStyle}>{error}</Typography>
      ) : (
        <>
          {renderPatientDataHeader()}
          {renderPatientData()}
          <Divider style={{ margin: '20px 0' }} />
          {renderDoctorData()}
          <br></br>
        </>
      )}
    </Box>
  );
}

export default ViewProfile;