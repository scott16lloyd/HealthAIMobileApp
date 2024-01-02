import React, { useState } from 'react';
import { Box, TextField, Typography, Grid, Paper } from '@mui/material';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton'; // Ensure this path is correct

function HealthJournal() {
    const [journalEntry, setJournalEntry] = useState('');
    const [entries, setEntries] = useState([]);

    const handleInputChange = (event) => {
        setJournalEntry(event.target.value);
    };

    const handleSubmit = () => {
        if (journalEntry.trim() !== '') {
            setEntries([...entries, journalEntry]);
            setJournalEntry('');
        }
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    };
    const todayDate = formatDate(new Date());

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom>Health Journal</Typography>
            <Typography variant="subtitle1">Today's Date: {todayDate}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Keep a daily log of your health-related activities and symptoms.
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
                text={'Add Entry'}
                action={handleSubmit}
                state={!journalEntry.trim() ? 'disabled' : 'active'}
            />

            <Grid container>
                {entries.map((entry, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper sx={{ p: 2, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', m: 1 }}>
                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                {entry}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default HealthJournal;
