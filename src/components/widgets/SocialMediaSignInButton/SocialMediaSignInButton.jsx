import React from 'react';
import Button from '@mui/material/Button';
import GoogleG from '../../../images/GoogleG.png';
import Apple from '../../../images/AppleLogo.png';

function SocialMediaSignInButton({ socialPlatform, action }) {
  let image = null;
  let text = null;

  if (socialPlatform === 'apple') {
    image = Apple;
    text = 'Apple';
  } else if (socialPlatform === 'google') {
    image = GoogleG;
    text = 'Google';
  } else {
    image = null;
    text = null;
  }

  return (
    <Button
      onClick={action}
      sx={{ height: '3rem', margin: '1rem', width: '260px' }}
      variant="outlined"
      startIcon={
        <img
          src={image}
          alt="Google G"
          style={{ width: '24px', height: '24px' }}
        />
      }
    >
      Sign in with {text}
    </Button>
  );
}

export default SocialMediaSignInButton;
