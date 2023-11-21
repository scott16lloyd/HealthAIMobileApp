import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/widgets/SearchBar/SearchBar';
import PatientOverviewWidget from '../components/widgets/PatientOverviewWidget/PatientOverviewWidget';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { UserAuth } from '../components/auth/AuthContext';
import { Link } from 'react-router-dom';

function ViewAllPatients() {
  const { user } = UserAuth();
  const doctorID = user.uid;
  console.log(doctorID);
  const apiUrl = `https://healthai-40b47-default-rtdb.europe-west1.firebasedatabase.app/patients.json?Authorization=Bearerhttps&orderBy=%22doctor%22&equalTo="1234567890"`;

  // State
  const [patientsData, setPatientsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handleSearch = (value) => {
    setSearch(value);
  };

  const filteredPatientsData = patientsData.filter((patient) => {
    const patient_name = patient.first_name + ' ' + patient.last_name;
    return patient_name.toLowerCase().includes(search.toLowerCase());
  });

  // Fetch doctor's patient data
  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const patientsArray = Object.keys(data).map((key) => data[key]);
      setPatientsData(patientsArray);
      console.log(patientsData);
      console.log(patientsArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Updated patientsData:', patientsData);
  }, [patientsData]);

  // Styling
  const titleStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: 'normal',
  };

  const topBarStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '4rem',
    paddingBottom: '4rem',
  };

  const dataContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    height: '52vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingTop: '0.1rem',
  };

  return (
    <>
      <div style={topBarStyle}>
        <Typography varient="h1" style={titleStyle}>
          View Patients
        </Typography>
        {isLoading ? (
          <p>Loading...</p> // You can replace this with a loading indicator
        ) : (
          <SearchBar
            options={patientsData.map(
              (patient) => `${patient.first_name} ${patient.last_name}`
            )}
            onSearch={handleSearch}
          />
        )}
      </div>
      <div style={dataContainerStyle}>
        {isLoading ? (
          <p>Loading...</p> // You can replace this with a loading indicator
        ) : patientsData.length === 0 ? (
          <p>No patients available</p>
        ) : (
          <Grid container spacing={2}>
            {filteredPatientsData.map((patient, index) => (
              <Grid item xs={4} key={index}>
                <Link
                  to={`/viewPatientDetails/${patient.patID}`}
                  key={index}
                  style={{ textDecoration: 'none' }}
                >
                  <PatientOverviewWidget
                    name={`${patient.first_name} ${patient.last_name}`}
                    id={patient.patID}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </>
  );
}

export default ViewAllPatients;
