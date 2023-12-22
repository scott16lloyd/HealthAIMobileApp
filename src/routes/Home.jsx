import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatIcon from '@mui/icons-material/Chat';
import UserProfile from '../components/widgets/UserProfile/UserProfile';

function ResponsiveBottomNav() {
  const [value, setValue] = useState(0);

  const iconStyle = {
    // Adjust the size of the icon as needed
    width: '10px', 
    height: '10px'
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      style={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 1000, // To ensure it stays on top of other elements
      }}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Test" icon={<CheckCircleIcon />} />
      <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
      <BottomNavigationAction label="Profile" icon={<UserProfile style={iconStyle}/>} />
    </BottomNavigation>
  );
}

export default ResponsiveBottomNav;
