import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ options, onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value) => {
    setInputValue(value);
    onSearch(value);
  };
  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={(_, value) => handleSearch(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search..."
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              '& .MuiInputBase-input': { boxShadow: 'none' },
              width: '100%',
              minWidth: '600px',
            },
          }}
          name={`random_${Math.random()}`}
        />
      )}
    />
  );
};

export default SearchBar;
