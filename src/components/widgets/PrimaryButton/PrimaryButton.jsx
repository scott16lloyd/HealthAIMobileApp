import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function PrimaryButton({ text, to, color, action, state }) {
  const activeColor =
    'linear-gradient(120deg, rgba(38, 85, 255, 0.80) 26.35%, rgba(0, 117, 255, 0.60) 83.58%)';
  const unactiveColor =
    'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)';

  const getBackgroundColor = () => {
    return state === 'active' ? activeColor : unactiveColor;
  };

  const getTextColor = () => {
    return state === 'active' ? 'white' : 'black';
  };

  const buttonStyle = {
    width: '240px',
    height: '50px',
    flexShrink: 0,
    margin: '0.8rem',
    fontSize: 24,
    fontWeight: 100,
    color: getTextColor(),
    textTransform: 'none',
    borderRadius: '11px',
    background: getBackgroundColor(),
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(1.5px)',
    '&:hover': {
      background: getBackgroundColor(),
    },
  };

  return (
    <>
      <Link to={to} style={{ textDecoration: 'none' }}>
        <Button variant="contained" sx={buttonStyle} onClick={action}>
          {text}
        </Button>
      </Link>
    </>
  );
}

export default PrimaryButton;
