import React, { useState } from 'react';
import { UserAuth } from '../components/auth/AuthContext';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import ViewPatientDetails from './ViewPatientScreen';
import ViewTest from './ViewTest';
import BackButton from '../components/widgets/BackButton/BackButton';
import Footer from '../components/widgets/Footer/Footer';
import PatientOverviewWidget from '../components/widgets/PatientOverviewWidget/PatientOverviewWidget';

function PatientDetails() {
  // Manage state of buttons, including default state
  const [buttonStates, setButtonStates] = useState({
    viewPatientDetails: 'active',
    viewTest: 'unactive', // Use "viewTest" as the state key
  });

  const handleButtonClick = (buttonKey) => {
    const newButtonStates = {
      viewPatientDetails: 'unactive',
      viewTest: 'unactive',
      [buttonKey]: 'active',
    };
    setButtonStates(newButtonStates);
  };

  const buttonColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    gap: '1rem',
    margin: '2rem',
  };

  const outerWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
  };

  const displayContainer = {
    width: '75%',
    paddingLeft: '4rem',
    paddingRight: '4rem',
    paddingTop: '1rem',
  };

  // Define user-related objects
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TopNavigationBar />
      {user ? <button onClick={handleSignOut}>Logout</button> : null}
      <BackButton />
      <div style={outerWrapperStyle}>
        <div style={buttonColumnStyle}>
          <PatientOverviewWidget />
          <PrimaryButton
            text={'View Details'}
            state={buttonStates.viewPatientDetails}
            action={() => handleButtonClick('viewPatientDetails')}
          />
          <PrimaryButton
            text={'View Tests'}
            state={buttonStates.viewTest} // Use "viewTest" as the state key
            action={() => handleButtonClick('viewTest')}
          />
        </div>
        <div style={displayContainer}>
          {buttonStates.viewPatientDetails === 'active' && (
            <ViewPatientDetails />
          )}
          {buttonStates.viewTest === 'active' && <ViewTest />}
        </div>
      </div>
      <Footer />
      <div></div>
    </>
  );
}

export default PatientDetails;
