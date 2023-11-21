import React, { useState } from 'react';
import { UserAuth } from '../components/auth/AuthContext';
import TopNavigationBar from '../components/widgets/TopNavigationBar/TopNavigationBar';
import PrimaryButton from '../components/widgets/PrimaryButton/PrimaryButton';
import ViewAllPatients from './ViewAllPatients';
import AddPatient from './AddPatient';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/widgets/Footer/Footer';
import UserProfile from '../components/widgets/UserProfile/UserProfile';

function Home() {
  // Manage state of button, including default state
  const [buttonStates, setButtonStates] = useState({
    viewPatients: 'active',
    addPatient: 'unactive',
    viewProfile: 'unactive',
  });

  const navigate = useNavigate();

  const handleButtonClick = (buttonKey) => {
    const newButtonStates = {
      viewPatients: 'unactive',
      addPatient: 'unactive',
      viewProfile: 'unactive',
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
    marginBottom: '9rem',
  };

  const displayContainer = {
    width: '75%',
    paddingLeft: '4rem',
    paddingRight: '4rem',
    paddingTop: '1rem',
  };

  const topBarWrapper = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '2rem',
  };

  // Define user related objects
  const { user } = UserAuth();
  console.log(user.displayName);

  return (
    <>
      <div style={topBarWrapper}>
        <TopNavigationBar />
        {user ? <UserProfile /> : null}
      </div>
      <div style={outerWrapperStyle}>
        <div style={buttonColumnStyle}>
          <PrimaryButton
            text={'View Patients'}
            state={buttonStates.viewPatients}
            action={() => handleButtonClick('viewPatients')}
          />
          <PrimaryButton
            text={'Add Patient'}
            state={buttonStates.addPatient}
            action={() => handleButtonClick('addPatient')}
          />
          <PrimaryButton text={'View Profile'} to={'/viewProfile'} />
        </div>
        <div style={displayContainer}>
          {buttonStates.viewPatients === 'active' && <ViewAllPatients />}
          {buttonStates.addPatient === 'active' && <AddPatient />}
        </div>
      </div>
      <Footer />
      <div></div>
    </>
  );
}
export default Home;
