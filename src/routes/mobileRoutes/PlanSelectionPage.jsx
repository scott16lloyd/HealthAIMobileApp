import React from 'react';
import { Paper, Typography } from '@mui/material';
import TitleText from '../../components/widgets/TitleText/TitleText';
import BackButton from '../../components/widgets/BackButton/BackButton';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckIcon from '@mui/icons-material/Check';

function PlanSelectionPage() {
  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const mainWrapper = {
    paddingTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '3rem',
    height: '68vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const planBox = {
    backgroundImage:
      'linear-gradient(120deg, rgba(38, 85, 255, 0.80) 26.35%, rgba(0, 117, 255, 0.60) 83.58%)',
    width: '80%',
    height: '60%',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
  };

  const boxItems = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
  };

  const featuresContainer = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '1rem',
  };

  const featuresLine = {
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    gap: '0.5rem',
  };

  return (
    <>
      <div style={wrapperStyle}>
        <TitleText />
        <BackButton />
        <div style={mainWrapper}>
          <Paper elevation={3} style={planBox}>
            <div style={boxItems}>
              <AssignmentTurnedInOutlinedIcon
                sx={{ color: 'white', fontSize: '50px' }}
              />
              <Typography variant="h4" color={'white'}>
                Basic Plan
              </Typography>
              <div style={featuresContainer}>
                <div style={featuresLine}>
                  <CheckIcon />
                  <Typography variant="subtitle1">Single User</Typography>
                </div>
                <div style={featuresLine}>
                  <CheckIcon />
                  <Typography variant="subtitle1">Instant GP access</Typography>
                </div>
                <div style={featuresLine}>
                  <CheckIcon />
                  <Typography variant="subtitle1">Doc-Bot access</Typography>
                </div>
                <div style={featuresLine}>
                  <CheckIcon />
                  <Typography variant="subtitle1">Food Plans</Typography>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
}

export default PlanSelectionPage;
