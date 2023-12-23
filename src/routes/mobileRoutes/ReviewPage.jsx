import React, { useState } from 'react';
import TitleText from '../../components/widgets/TitleText/TitleText';
import BackButton from '../../components/widgets/BackButton/BackButton';
import { Typography, Rating, Paper, TextField } from '@mui/material';
import PrimaryButton from '../../components/widgets/PrimaryButton/PrimaryButton';
import AlertBox from '../../components/widgets/AlertBox/AlertBox';
import { auth, database, ref, push, set } from '../../firebase';

function ReviewPage() {
  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0rem',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const mainWrapper = {
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '1.5rem',
    height: '68vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const buttonWrapper = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '1rem',
  };

  const inputStyle = {
    margin: '20px 40px',
    width: '75%',
    borderRadius: '11px',
    background:
      'linear-gradient(93deg, rgba(217, 217, 217, 0.40) 17.46%, rgba(217, 217, 217, 0.10) 82.78%)',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(1.5px)',
  };

  const commentBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  };

  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [severity, setSevereity] = useState('');

  const addCommentToDB = (ratingValue, comment) => {
    // Check rating value is not 0
    if (ratingValue !== 0) {
      const user = auth.currentUser;
      if (user) {
        const username = user.displayName;
        const newReviewRef = push(ref(database, 'reviews/' + username));
        set(newReviewRef, {
          comment: comment,
          rating: ratingValue,
        })
          .then(() => {
            setComment('');
            setRatingValue(0);
            setErrorMessage('Thanks for your review.');
            setSevereity('success');
          })
          .catch((error) => {
            setErrorMessage(error.message);
          });
      } else {
        setErrorMessage('No user is currently logged in');
        setSevereity('error');
      }
    } else {
      setErrorMessage('Please enter a review from 1-5');
      setSevereity('error');
    }
  };

  return (
    <>
      <div style={wrapperStyle}>
        <TitleText />
        <BackButton />
        <AlertBox
          message={errorMessage}
          severity={severity}
          onClose={() => setErrorMessage('')}
        />
        <div style={buttonWrapper}>
          <Typography variant="h4">Leave a Review</Typography>
        </div>
        <div style={mainWrapper}>
          <Rating
            style={{ fontSize: 50 }}
            value={ratingValue}
            onChange={(event, newValue) => {
              setRatingValue(newValue === null ? 0 : newValue);
            }}
          />
          <Typography variant="h6">Your rating: {ratingValue}</Typography>
          <div style={commentBoxStyle}>
            <Paper
              elevation={1}
              sx={{
                padding: '0.5rem',
                paddingX: '1rem',
                borderRadius: 3,
                marginX: '2.5rem',
              }}
            >
              <Typography variant="h5">Comments</Typography>
            </Paper>
            <TextField
              variant="filled"
              style={inputStyle}
              required
              multiline
              rows={5}
              InputProps={{ disableUnderline: true }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add comment..."
            />
          </div>
          <PrimaryButton
            text={'Submit'}
            state="active"
            action={() => addCommentToDB(ratingValue, comment)}
          />
        </div>
      </div>
    </>
  );
}

export default ReviewPage;
