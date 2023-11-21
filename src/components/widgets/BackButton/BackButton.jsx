import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function BackButton({ goBackPath }) {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    if (goBackPath) {
      navigate(goBackPath);
    } else {
      window.history.back();
    }
  };
  return (
    <IconButton
      onClick={handleBackButtonClick}
      aria-label="delete"
      sx={{
        borderRadius: '0.8rem',
        backgroundColor: '#D9D9D9',
        color: 'black',
        marginRight: '4rem',
        width: '50px',
        height: '50px',
      }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
}

export default BackButton;
