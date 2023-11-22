import React from 'react';
import TitleText from '../../components/widgets/TitleText/TitleText';
import BackButton from '../../components/widgets/BackButton/BackButton';
import { Typography } from '@mui/material';
function GPDetailsPage() {
  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  };

  const mainWrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  return (
    <>
      <div style={wrapperStyle}>
        <TitleText />
        <BackButton />
        <div style={mainWrapper}>
          <Typography variant="h4">GP Details</Typography>
        </div>
      </div>
    </>
  );
}

export default GPDetailsPage;
