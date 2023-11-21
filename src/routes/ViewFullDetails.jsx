import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { Typography } from '@mui/material';
import Dropdown from '../components/widgets/Dropdown/Dropdown';

function ViewFullDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const dropdownContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingTop: '2rem',
  };

  const titleStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: 'normal',
  };

  // Get patient info
  const { patID } = useParams();
  const patIDNumber = parseInt(patID, 10);
  const patientRef = ref(database, 'patients');

  // Read the data at the reference
  const [patient, setPatient] = useState(null);

  // Gather patient details
  const generatePatientDetails = () => {
    if (patient) {
      return {
        Name: `${patient.first_name} ${patient.last_name}`,
        Gender: `${patient.gender}`,
        Address: `${patient.home_address}`,
        'Patient ID': `${patient.patID}`,
        Phone: `${patient.telephone}`,
      };
    } else {
      // Handle the case when patient is null
      return {
        Name: 'Name could not be found.',
        Gender: 'Gender could not be found.',
        Address: 'Address could not be found.',
        'Patient ID': 'Patient ID could not be found.',
        Phone: 'Phone could not be found.',
      };
    }
  };

  // Gather patient insurance details
  const generatePatientInsuranceDetails = () => {
    if (patient) {
      return {
        'Insurance Company': `${patient.insurance_company}`,
        'Policy Number': `${patient.policy_number}`,
      };
    } else {
      return {
        'Insurance Company': `insurance company could not be found`,
        'Policy Number': `policy number could not be found`,
      };
    }
  };

  const patientDetails = generatePatientDetails();
  const patientInsuranceDetails = generatePatientInsuranceDetails();

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

  return (
    <div style={dropdownContainerStyle}>
      {isLoading ? (
        <Typography variant="h1" style={titleStyle}>
          Loading...
        </Typography>
      ) : (
        <>
          <Dropdown title={'Patient Details'} data={patientDetails} />
          <Dropdown
            title={'View Patient Insurance Details'}
            data={patientInsuranceDetails}
          />
        </>
      )}
    </div>
  );
}

export default ViewFullDetails;
