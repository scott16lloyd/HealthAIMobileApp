import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid, Paper, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';
import BackButton from '../../components/widgets/BackButton/BackButton';
import Cookies from 'js-cookie';
import { ref, database } from '../../firebase';
import { set } from '@firebase/database';
import { UserAuth } from '../../components/auth/AuthContext';

function HealthJournal() {
  const [journalEntry, setJournalEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [filterYear, setFilterYear] = useState('');
  const [uniqueYears, setUniqueYears] = useState([]);

  const { user } = UserAuth();
  const patientID = user.uid;
  console.log(patientID);


  useEffect(() => {
    const storedEntries = Cookies.get('healthJournalEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    Cookies.set('healthJournalEntries', JSON.stringify(entries));
    const years = Array.from(new Set(entries.map((entry) => new Date(entry.timestamp).getFullYear())));
    setUniqueYears(years);
  }, [entries]);

  const handleInputChange = (event) => {
    setJournalEntry(event.target.value);
  };

    const handleSubmit = () => {
        if (journalEntry.trim() !== '') {
        const newEntry = {
            text: journalEntry,
            timestamp: new Date().toLocaleString(),
        };
        if (editIndex !== -1) {
            // If editing an existing entry
            entries[editIndex] = newEntry;
            setEditIndex(-1);
        } else {
            // If adding a new entry
            const newEntries = [...entries, newEntry];
            setEntries(newEntries);

            // Push the new entry to Firebase
            const journalEntriesRef = ref(database, `patients/${patientID}/journalEntries`);
            set(journalEntriesRef, newEntries);
        }
        setJournalEntry('');
        }
    };

  const handleEdit = (index) => {
    setEditIndex(index);
    setJournalEntry(entries[index].text);
  };

  const handleDelete = (index) => {
    const updatedEntries = [...entries];
    updatedEntries.splice(index, 1);
    setEntries(updatedEntries);
    setEditIndex(-1);
  };

  const handleYearFilterChange = (event) => {
    setFilterYear(event.target.value);
  };

  const filteredEntries = filterYear
    ? entries.filter((entry) => new Date(entry.timestamp).getFullYear() === parseInt(filterYear))
    : entries;

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };
  const todayDate = formatDate(new Date());

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <BackButton />
      <Typography variant="h5" gutterBottom>Health Journal</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Today's Date: {todayDate}</Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Keep a daily log of your health-related activities and symptoms. Journaling can be a helpful tool for individuals facing health challenges, aiding in tracking and understanding their well-being.
      </Typography>

      <TextField
        label="Write your journal entry here"
        multiline
        rows={4}
        value={journalEntry}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />

      <PrimaryButton
        text={editIndex !== -1 ? 'Save Edit' : 'Add Entry'}
        action={handleSubmit}
        state={!journalEntry.trim() ? 'disabled' : 'active'}
        size="small"
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Filter by Year</InputLabel>
        <Select
          value={filterYear}
          onChange={handleYearFilterChange}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {uniqueYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container>
        {filteredEntries.map((entry, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ p: 2, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'gray', mb: 1 }}>
                {entry.timestamp}
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                {entry.text}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEdit(index)}
                sx={{ mt: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(index)}
                sx={{ mt: 1, ml: 1 }}
              >
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HealthJournal;
