import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid, Paper, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';
import BackButton from '../../components/widgets/BackButton/BackButton';
import Cookies from 'js-cookie';
import { database } from '../../firebase'; // Adjust the path as needed
import { ref, set, push, onValue, remove } from 'firebase/database';

function HealthJournal() {
  const [journalEntry, setJournalEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [filterYear, setFilterYear] = useState('');
  const [uniqueYears, setUniqueYears] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = Cookies.get('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      const journalRef = ref(database, `journal/${user.uid}`);
      onValue(journalRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetchedEntries = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setEntries(fetchedEntries);
        } else {
          setEntries([]);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    const years = Array.from(new Set(entries.map((entry) => new Date(entry.timestamp).getFullYear())));
    setUniqueYears(years);
  }, [entries]);

  const handleInputChange = (event) => {
    setJournalEntry(event.target.value);
  };

  const handleSubmit = () => {
    if (journalEntry.trim() !== '' && user && user.uid) {
      const newEntry = {
        text: journalEntry,
        timestamp: new Date().toISOString(),
      };
      const journalRef = ref(database, `journalEntries/${user.uid}`);
      push(journalRef, newEntry);
      setJournalEntry('');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setJournalEntry(entries[index].text);
  };

  const handleSaveEdit = () => {
    if (journalEntry.trim() !== '' && user && user.uid && editIndex !== -1) {
      const entryId = entries[editIndex].id;
      const entryRef = ref(database, `journalEntries/${user.uid}/${entryId}`);
      set(entryRef, { ...entries[editIndex], text: journalEntry, timestamp: new Date().toISOString() });
      setEditIndex(-1);
      setJournalEntry('');
    }
  };

  const handleDelete = (index) => {
    if (user && user.uid) {
      const entryId = entries[index].id;
      const entryRef = ref(database, `journalEntries/${user.uid}/${entryId}`);
      remove(entryRef);
    }
  };

  const handleYearFilterChange = (event) => {
    setFilterYear(event.target.value);
  };

  const filteredEntries = filterYear
    ? entries.filter((entry) => new Date(entry.timestamp).getFullYear() === parseInt(filterYear))
    : entries;

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(date).toLocaleDateString('en-US', options);
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
        action={editIndex !== -1 ? handleSaveEdit : handleSubmit}
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
          <Grid item xs={12} key={entry.id}>
            <Paper sx={{ p: 2, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'gray', mb: 1 }}>
                {formatDate(entry.timestamp)}
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
