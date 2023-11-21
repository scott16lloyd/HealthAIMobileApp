import React from 'react';
import { Input } from '@mui/material';

function InputField({ placeholderText }) {
  return (
    <Input
      placeholder="Type in here…"
      sx={{
        '& input::placeholder': {
          paddingLeft: '5px', 
        },
      }}
    />
  );
}

export default InputField;
