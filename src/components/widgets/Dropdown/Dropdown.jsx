import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
function Dropdown({ title, data }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    height: '5rem',
    background: '#D9D9D9',
    fontWeight: 500,
    fontSize: '28px',
    color: 'black',
    textTransform: 'none',
    borderRadius: '0.4rem',
    '&:hover': {
      background: '#b3b3b3',
    },
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    gap: '1rem',
  };
  return (
    <div style={buttonContainerStyle}>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        style={buttonStyles}
      >
        {title}
        <ArrowForwardIosIcon sx={{ paddingLeft: '0.3rem' }} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dropdown;
