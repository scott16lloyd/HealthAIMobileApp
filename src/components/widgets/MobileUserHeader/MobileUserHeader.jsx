import React from 'react';
import UserProfile from '../UserProfile/UserProfile';
import { UserAuth } from '../../auth/AuthContext';
import { Typography } from '@mui/material';

function MobileUserHeader() {
  // Logged in user object
  const { user } = UserAuth();
  const topBarStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
  };
  return (
    <>
      <div style={topBarStyle}>
        {user ? <UserProfile /> : null}
        <Typography variant="h5" style={{ fontSize: 25 }}>
          Hello,
          <Typography variant="h4" style={{ fontWeight: 600 }}>
            {user.displayName ? user.displayName : 'User'}
          </Typography>
        </Typography>
      </div>
    </>
  );
}

export default MobileUserHeader;
